#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Scraper/Updater de imagens do Anota AI para preencher imageUrl no seu menu.tsx.

Fluxo:
  1) Lê seu TSX (objetos com { id: "...", name: "...", ... }).
  2) Carrega a(s) página(s) da loja do Anota (com ou sem render JS).
  3) Extrai URLs das imagens (regex + DOM). No DOM, escolhe a MAIOR do srcset.
  4) Para cada URL, tenta versões maiores automaticamente (original, _1600, _1400, _1200, _1024, _800, _600).
  5) Baixa com Referer/Origin corretos (evita AccessDenied), salva como <id>.<ext>.
  6) Atualiza seu TSX inserindo/substituindo imageUrl para cada item.

Exemplos (PowerShell):
  # com render (recomendado p/ SPA):
  python .\scraper_img.py `
    --tsx .\menu-agriao.tsx `
    --out-tsx .\menu.updated.tsx `
    --urls "https://pedido.anota.ai/loja/pastita-massas" `
    --referer "https://pedido.anota.ai/loja/pastita-massas/" `
    --download `
    --out-dir "..\..\public\images\menu-agriao" `
    --render `
    --verbose

  # sem render (apenas regex/HTML):
  python .\scraper_img.py --tsx .\menu-agriao.tsx --out-tsx .\menu.updated.tsx --urls "https://pedido.anota.ai/loja/pastita-massas" --referer "https://pedido.anota.ai/loja/pastita-massas/" --download --out-dir "..\..\public\images\menu-agriao" --verbose

Requisitos:
  pip install requests beautifulsoup4
  (opcional p/ --render)
  pip install playwright
  playwright install chromium
"""

import os
import re
import sys
import json
import argparse
import difflib
import unicodedata
from pathlib import Path
from urllib.parse import urlparse

# ---------- Dependências base ----------
try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    raise SystemExit("Instale as dependências base:\n  pip install requests beautifulsoup4")

# ---------- Playwright (opcional) ----------
PLAYWRIGHT_AVAILABLE = False
try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except Exception:
    PLAYWRIGHT_AVAILABLE = False

# ---------- Constantes ----------
ANOTA_ASSET_HOST = "client-assets.anota.ai"
BASE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, como Gecko) "
        "Chrome/124.0 Safari/537.36"
    ),
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
}
# Regex robusta para assets do Anota (aceita sufixos e querystring)
ASSET_REGEX = re.compile(
    r"https://client-assets\.anota\.ai/produtos/[^\s\"'<>]+?\.(?:webp|png|jpe?g)(?:\?[^\s\"'<>]*)?",
    re.IGNORECASE
)

# ---------- Utils ----------
def log(verbose: bool, *args):
    if verbose:
        print(*args, file=sys.stderr)

def strip_accents_lower(s: str) -> str:
    if not s:
        return ""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.lower().strip()

def is_anota_asset(url: str) -> bool:
    try:
        return urlparse(url).netloc.endswith(ANOTA_ASSET_HOST)
    except Exception:
        return False

# ---------- Fetch / Render ----------
def fetch_url(url: str, headers: dict) -> str:
    r = requests.get(url, headers=headers, timeout=45)
    r.raise_for_status()
    return r.text

def render_url(url: str, headers: dict) -> str:
    if not PLAYWRIGHT_AVAILABLE:
        raise RuntimeError("Playwright não disponível. Instale:\n  pip install playwright\n  playwright install chromium")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent=headers.get("User-Agent", BASE_HEADERS["User-Agent"]),
            locale="pt-BR"
        )
        page = ctx.new_page()
        page.set_default_timeout(45000)
        page.goto(url, wait_until="domcontentloaded")
        # esperar alguma evidência de cards/imagens
        try:
            page.wait_for_selector("picture img, img.image", timeout=20000)
        except Exception:
            pass
        html = page.content()
        browser.close()
        return html

# ---------- Coleta de URLs ----------
def collect_images_regex(html: str) -> list[str]:
    urls = ASSET_REGEX.findall(html)
    urls = [u.strip().strip('\\').strip('"').strip("'") for u in urls]
    seen, out = set(), []
    for u in urls:
        if u not in seen:
            out.append(u); seen.add(u)
    return out

def _parse_srcset_max(srcset: str) -> str | None:
    """
    Recebe um srcset e devolve a URL com maior largura (ex.: '... 600w, ... 1200w').
    Se vier em densidade (ex.: '1x', '2x'), prioriza o maior 'x'.
    """
    if not srcset:
        return None
    candidates = []
    for part in srcset.split(","):
        part = part.strip()
        if not part:
            continue
        pieces = part.split()
        url = pieces[0]
        desc = pieces[1] if len(pieces) > 1 else ""
        score = 0
        if desc.endswith("w"):
            try:
                score = int(desc[:-1])
            except:
                score = 0
        elif desc.endswith("x"):
            try:
                score = int(float(desc[:-1]) * 1000)
            except:
                score = 0
        else:
            score = 1000
        candidates.append((score, url))
    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]

def best_src_from_picture(pic) -> str | None:
    # 1) <source type="image/webp" srcset="..."> => maior do srcset
    for src in pic.find_all("source"):
        t = (src.get("type") or "").lower().strip()
        srcset = (src.get("srcset") or "").strip()
        if "webp" in t and srcset:
            cand = _parse_srcset_max(srcset)
            if cand and is_anota_asset(cand):
                return cand
    # 2) qualquer <source> => maior do srcset
    for src in pic.find_all("source"):
        srcset = (src.get("srcset") or "").strip()
        cand = _parse_srcset_max(srcset)
        if cand and is_anota_asset(cand):
            return cand
    # 3) fallback: <img src>
    im = pic.find("img")
    if im:
        u = (im.get("src") or "").strip()
        if is_anota_asset(u):
            return u
    return None

def guess_name_nearby(node) -> str | None:
    cur = node
    for _ in range(4):
        cur = cur.parent
        if not cur:
            break
        el = cur.select_one("h1, h2, h3, h4, strong, b, [class*=title], [class*=name]")
        if el:
            txt = " ".join(el.get_text(" ").split()).strip()
            if txt and "r$" not in txt.lower() and len(txt) >= 4:
                return txt
        texts = []
        for t in cur.find_all(text=True):
            s = " ".join((t or "").strip().split())
            if not s or "r$" in s.lower() or len(s) < 4:
                continue
            texts.append(s)
        if texts:
            texts.sort(key=len, reverse=True)
            return texts[0]
    return None

def collect_images_structured(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    out = []
    for pic in soup.select("picture, picture.image-container"):
        u = best_src_from_picture(pic)
        if u:
            out.append({"name": guess_name_nearby(pic), "url": u})
    for im in soup.select("img"):
        u = (im.get("src") or "").strip()
        if u and is_anota_asset(u):
            out.append({"name": guess_name_nearby(im), "url": u})
    seen, dedup = set(), []
    for r in out:
        if r["url"] not in seen:
            dedup.append(r); seen.add(r["url"])
    return dedup

# ---------- TSX parsing/update ----------
ITEM_OBJ_RE = re.compile(
    r"\{[^{}]*?id:\s*\"(?P<id>[^\"]+)\"[^{}]*?name:\s*\"(?P<name>[^\"]+)\"(?P<body>[^{}]*?)\}",
    re.S
)

def parse_items_from_tsx(tsx_text: str):
    items = []
    for m in ITEM_OBJ_RE.finditer(tsx_text):
        span = (m.start(), m.end())
        obj_text = m.group(0)
        _id = m.group("id")
        name = m.group("name")
        img_m = re.search(r"imageUrl\s*:\s*(PLACEHOLDER|\"[^\"]+\")", obj_text)
        image_url = None if not img_m else (None if img_m.group(1) == "PLACEHOLDER" else img_m.group(1).strip("\""))
        items.append({
            "id": _id,
            "name": name,
            "span": span,
            "text": obj_text,
            "image_url": image_url
        })
    return items

def fuzzy_match_item(items, target_name: str, cutoff=0.55):
    if not target_name:
        return None, 0.0
    norm_target = strip_accents_lower(target_name)
    name_map = {strip_accents_lower(i["name"]): i for i in items}
    if norm_target in name_map:
        return name_map[norm_target], 1.0
    candidates = difflib.get_close_matches(norm_target, list(name_map.keys()), n=1, cutoff=cutoff)
    if candidates:
        chosen = candidates[0]
        score = difflib.SequenceMatcher(None, norm_target, chosen).ratio()
        return name_map[chosen], score
    return None, 0.0

def apply_image_to_obj_text(obj_text: str, url: str) -> str:
    if not url:
        return obj_text
    if re.search(r"imageUrl\s*:", obj_text):
        return re.sub(r"(imageUrl\s*:\s*)(PLACEHOLDER|\"[^\"]+\")",
                      rf"\1\"{url}\"", obj_text, count=1)
    return re.sub(r"(name\s*:\s*\"[^\"]+\")",
                  rf"\1, imageUrl: \"{url}\"", obj_text, count=1)

def update_tsx_with_images(tsx_text: str, images_map_id_to_url: dict, items):
    parts, last = [], 0
    for it in items:
        start, end = it["span"]
        obj_text = it["text"]
        url = images_map_id_to_url.get(it["id"])
        new_obj = apply_image_to_obj_text(obj_text, url) if url else obj_text
        parts.append(tsx_text[last:start]); parts.append(new_obj)
        last = end
    parts.append(tsx_text[last:])
    return "".join(parts)

# ---------- Upscale helpers ----------
def infer_ext_from_url(url: str) -> str:
    u = url.lower()
    for ext in (".webp", ".jpg", ".jpeg", ".png"):
        if u.endswith(ext) or f"{ext}?" in u:
            return ext
    return ".webp"

def _upscale_url_candidates(url: str) -> list[str]:
    """
    Se a URL terminar em *_600.ext, gera candidatos maiores:
    original (sem sufixo), _1600, _1400, _1200, _1024, _800, _600.
    Mantém extensão e querystring.
    """
    m = re.search(r"(_\d{3,4})(\.(webp|jpg|jpeg|png))(?:\?.*)?$", url, re.IGNORECASE)
    if not m:
        return [url]
    size_tag, ext = m.group(1), m.group(2)
    base = url[:m.start(1)]
    tail = url[m.end(2):]  # query, se houver
    sizes = ["", "_1600", "_1400", "_1200", "_1024", "_800", size_tag]  # "" -> sem sufixo
    candidates = [f"{base}{s}{ext}{tail}" for s in sizes]
    seen, out = set(), []
    for u in candidates:
        if u not in seen:
            out.append(u); seen.add(u)
    return out

def _try_fetch_first_ok(urls: list[str], headers: dict) -> tuple[str, int]:
    last_status = None
    for u in urls:
        try:
            r = requests.get(u, headers=headers, timeout=35)
            last_status = r.status_code
            if r.status_code < 400 and r.content:
                return u, r.status_code
        except Exception:
            continue
    return urls[-1], last_status or 0

# ---------- Download ----------
def download_image_as_id(url: str, out_dir: Path, referer: str | None, item_id: str, verbose: bool=False) -> str:
    headers = dict(BASE_HEADERS)
    if referer:
        headers["Referer"] = referer.rstrip("/") + "/"
        headers["Origin"]  = "https://pedido.anota.ai"

    # tenta versão maior automaticamente
    candidates = _upscale_url_candidates(url)
    best_url, status = _try_fetch_first_ok(candidates, headers)
    log(verbose, f"[DBG] Escolhida: {best_url} (status {status}) para {item_id}")

    # baixa de fato
    r = requests.get(best_url, headers=headers, timeout=45, stream=True)
    if r.status_code >= 400:
        raise RuntimeError(f"HTTP {r.status_code} ao baixar {best_url}")

    out_dir.mkdir(parents=True, exist_ok=True)
    ext = infer_ext_from_url(best_url)
    path = out_dir / f"{item_id}{ext}"
    with open(path, "wb") as f:
        for chunk in r.iter_content(1024 * 32):
            if chunk:
                f.write(chunk)

    # caminho web relativo (supondo Next.js/React com /public)
    rel = os.path.relpath(str(path), start="./public")
    return "/" + rel.replace("\\", "/")

# ---------- Main ----------
def main():
    ap = argparse.ArgumentParser(description="Baixa imagens do Anota (com Referer) e atualiza imageUrl no menu.tsx")
    ap.add_argument("--tsx", required=True, help="Arquivo TSX de entrada (ex.: menu-agriao.tsx)")
    ap.add_argument("--out-tsx", required=True, help="Arquivo TSX de saída (ex.: menu.updated.tsx)")
    ap.add_argument("--urls", nargs="*", help="URLs da loja/páginas do Anota")
    ap.add_argument("--html", help="Arquivo HTML salvo da página do Anota")
    ap.add_argument("--render", action="store_true", help="Renderizar JS com Playwright (recomendado p/ SPA)")
    ap.add_argument("--referer", help="Referer p/ baixar assets (ex.: https://pedido.anota.ai/loja/pastita-massas/)")
    ap.add_argument("--download", action="store_true", help="Baixar e re-hospedar localmente")
    ap.add_argument("--out-dir", default="./public/images/menu-agriao", help="Diretório onde salvar as imagens")
    ap.add_argument("--images-json", default="images.json", help="Saída JSON com mapa id->url/path (debug)")
    ap.add_argument("--verbose", action="store_true", help="Logs de depuração")
    args = ap.parse_args()

    # 1) Lê TSX
    tsx_text = Path(args.tsx).read_text(encoding="utf-8")
    items = parse_items_from_tsx(tsx_text)
    if not items:
        raise SystemExit("Nenhum item encontrado no TSX. Garanta objetos com { id: \"...\", name: \"...\", ... }")
    log(args.verbose, f"[DBG] Itens TSX lidos: {len(items)}")

    # 2) Coleta HTML(s)
    html_blobs = []
    headers = dict(BASE_HEADERS)
    if args.referer:
        headers["Referer"] = args.referer
    if args.urls:
        for u in args.urls:
            try:
                html = render_url(u, headers) if args.render else fetch_url(u, headers)
                html_blobs.append(html)
            except Exception as e:
                print(f"[ERRO] Falha ao abrir {u}: {e}")
    if args.html:
        try:
            html_blobs.append(Path(args.html).read_text(encoding="utf-8"))
        except Exception as e:
            print(f"[ERRO] Falha ao ler HTML local: {e}")

    if not html_blobs:
        raise SystemExit("Forneça --urls e/ou --html (HTML salvo da página).")

    # 3) Extrai URLs (regex + DOM)
    scraped_urls = []
    scraped_named = []
    for blob in html_blobs:
        scraped_urls.extend(collect_images_regex(blob))
        scraped_named.extend(collect_images_structured(blob))
    log(args.verbose, f"[DBG] URLs via regex: {len(scraped_urls)} | URLs com nome (DOM): {len(scraped_named)}")

    # 4) Matching por nome + fallback por ordem
    id_to_url = {}
    matched_count = 0

    url_to_name = {}
    for r in scraped_named:
        nm = (r.get("name") or "").strip()
        url = r.get("url")
        if url and nm and url not in url_to_name:
            url_to_name[url] = nm

    for url, nm in url_to_name.items():
        it, score = fuzzy_match_item(items, nm, cutoff=0.55)
        if it and url:
            id_to_url[it["id"]] = url
            matched_count += 1

    remaining_urls = [u for u in scraped_urls if u not in id_to_url.values()]
    remaining_items = [it for it in items if it["id"] not in id_to_url]
    log(args.verbose, f"[DBG] Fallback: {len(remaining_items)} itens sem imagem, {len(remaining_urls)} urls sobrando")

    for it, u in zip(remaining_items, remaining_urls):
        id_to_url[it["id"]] = u

    # 5) Download + troca por caminho local
    if args.download:
        out_dir = Path(args.out_dir)
        new_map = {}
        for _id, url in id_to_url.items():
            try:
                new_map[_id] = download_image_as_id(url, out_dir, args.referer, _id, verbose=args.verbose)
                log(args.verbose, f"[DBG] OK download {_id} <- {url}")
            except Exception as e:
                print(f"[WARN] download falhou para {_id}: {e}")
                new_map[_id] = url  # fallback: mantém URL remota
        id_to_url = new_map

    # 6) Atualiza TSX
    updated_tsx = update_tsx_with_images(tsx_text, id_to_url, items)
    Path(args.out_tsx).write_text(updated_tsx, encoding="utf-8")

    # 7) Salva mapa (debug/versionamento)
    Path(args.images_json).write_text(json.dumps(id_to_url, ensure_ascii=False, indent=2), encoding="utf-8")

    # 8) Resumo
    print("\nResumo:")
    print(f"  Itens no TSX: {len(items)}")
    print(f"  Casados por nome: {matched_count}")
    print(f"  Total com imagem: {len(id_to_url)}")
    if args.download:
        print(f"  Imagens salvas em: {Path(args.out_dir).resolve()}")
    print(f"\nArquivos:")
    print(f"  - {args.out_tsx}")
    print(f"  - {args.images_json}")

if __name__ == "__main__":
    main()
