// scripts/optimize-images.mjs
import sharp from "sharp";
import { globby } from "globby";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

const SRC = "public/images/agriao-src";   // <- ORIGINAIS
const OUT = "public/images/agriao";       // <- OTIMIZADAS (webp)
const TS_OUT = "src/data/images.agriao.ts";

function slugToAlt(slug) {
  return slug
    .replace(/^.*[\\/]/, "") // tira o caminho
    .replace(/\.(webp|jpg|jpeg|png)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

async function main() {
  const files = await globby([`${SRC}/**/*.{jpg,jpeg,png,webp}`]);
  if (files.length === 0) {
    console.log(`Nenhuma imagem em ${SRC}. Coloque os arquivos e rode de novo.`);
    return;
  }

  const index = [];

  for (const f of files) {
    const isWebp = /\.webp$/i.test(f);
    const outPath = f
      .replace(SRC, OUT)
      .replace(/\.(jpe?g|png)$/i, ".webp");

    mkdirSync(dirname(outPath), { recursive: true });

    let pipeline = sharp(f).rotate(); // respeita EXIF
    let meta = await pipeline.metadata();

    if (!isWebp) {
      await pipeline.webp({ quality: 82 }).toFile(outPath);
    } else {
      // normaliza webp existente
      await pipeline.webp({ quality: Math.min((meta.quality ?? 82), 90) }).toFile(outPath);
    }

    const finalMeta = await sharp(outPath).metadata();
    const publicSrc = outPath.replace(/^public/, "").replaceAll("\\", "/");

    index.push({
      src: publicSrc,
      width: finalMeta.width || 1600,
      height: finalMeta.height || 900,
      alt: slugToAlt(outPath),
    });
    console.log("✔️", publicSrc);
  }

  // JSON em public (útil pra fetch ou inspeção)
  const jsonPath = resolve(OUT, "images.json");
  writeFileSync(jsonPath, JSON.stringify(index, null, 2), "utf-8");
  console.log("📄 Gerado:", jsonPath);

  // Módulo TS pra importar direto no app
  const tsModule = `// Arquivo gerado por scripts/optimize-images.mjs
export type AgriaoImage = { src: string; width: number; height: number; alt: string };
export const agriaoImages: AgriaoImage[] = ${JSON.stringify(index, null, 2)};
`;
  mkdirSync(dirname(TS_OUT), { recursive: true });
  writeFileSync(TS_OUT, tsModule, "utf-8");
  console.log("📦 Gerado:", TS_OUT);

  console.log("\n✅ Pronto! Importe 'agriaoImages' e renderize com <Image>.");
}

main().catch((err) => {
  console.error("Erro no optimize-images:", err);
  process.exit(1);
});
