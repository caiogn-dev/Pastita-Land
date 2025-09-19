"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AgriaoLogo } from "@/components/AgriaoLogo";
import Image from "next/image";
import { CATEGORIES, PLACEHOLDER, type MenuItem } from "@/data/menu";
import ComboModal from "@/components/ComboModal";
import { PastitaLogo } from "@/components/PastitaLogo";
import { ShoppingCart } from "lucide-react";
import { event as gaEvent } from "@/lib/ga";
import { useCart } from "./CardapioAgriao";

/* ================================
   SWITCH: Agrião (canto ESQUERDO)
   ================================ */
function SwitchMenuButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/cardapio/agriao")}
      className="fixed bottom-8 left-6 sm:left-8 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center gap-2 px-5 py-3 text-lg font-semibold transition-all border-2 border-white animate-bounce-slow focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
      aria-label="Ir para o cardápio Agrião"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
    >
      <AgriaoLogo width={32} height={32} />
      <span className="hidden sm:inline">Agrião</span>
    </button>
  );
}

/* ================================
   UI: Category Pill
   ================================ */
function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition border focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
        active
          ? "bg-rose-700 text-white border-rose-700 shadow-sm"
          : "bg-white/90 hover:bg-white border-zinc-200 text-zinc-700"
      }`}
    >
      {label}
    </button>
  );
}

/* ================================
   UI: Item Card (Pastita)
   ================================ */
function ItemCard({ item }: { item: MenuItem }) {
  const cart = useCart();
  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200/70 shadow-sm bg-white">
      <div className="aspect-[4/3] w-full bg-zinc-100">
        <Image
          src={item.imageFile ? `/imagens/${item.imageFile}` : item.imageUrl || PLACEHOLDER}
          alt={item.name}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-zinc-900 leading-tight">{item.name}</h3>
          <span className="font-semibold text-rose-600">
            {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>

        {item.description && (
          <p className="mt-1.5 mb-2.5 text-sm text-zinc-600 line-clamp-3">{item.description}</p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3">
          <button
            className="w-full h-11 rounded-xl border-2 border-rose-600 bg-rose-600 text-white
                       hover:bg-white hover:text-rose-700 hover:border-rose-700
                       active:translate-y-[1px] transition font-semibold tracking-tight
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            onClick={() => cart.add(item)}
            aria-label={`Adicionar ${item.name} ao carrinho`}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================
   UI: Botão flutuante do carrinho
   ================================ */
function CartButtonFloating({
  onClick,
  itemCount,
}: {
  onClick: () => void;
  itemCount: number;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed z-50 bottom-6 right-6 sm:bottom-8 sm:right-8 bg-rose-700 hover:bg-rose-800 text-white rounded-full shadow-lg flex items-center gap-2 px-5 py-3 text-lg font-semibold transition-all border-2 border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="w-6 h-6 mr-2" />
      <span>Carrinho</span>
      {itemCount > 0 && (
        <span className="ml-2 bg-white text-rose-700 rounded-full px-2 py-0.5 text-xs font-bold min-w-[24px] text-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}

/* ================================
   Helpers do carrinho
   ================================ */
function buildOrderBlock(items: any[], total: number) {
  const lines = [
    "*Pedido — Pastita Massas*",
    "",
    ...items.map(
      (it) =>
        `• ${it.qty}x ${it.name} — ${it.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })} (cada)`
    ),
    "",
    `*Total:* ${total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`,
  ];
  return lines.join("\n");
}

function cartToGa4Items(items: any[]) {
  return items.map((it: any, index: number) => ({
    item_id: String(it.id),
    item_name: it.name,
    index,
    price: Number(it.price.toFixed(2)),
    quantity: it.qty,
  }));
}

/* ================================
   Modal genérico
   ================================ */
function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-zinc-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
          >
            Fechar
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}

/* ================================
   Modal do carrinho (Pastita)
   ================================ */
function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, remove, clear } = useCart();
  const block = useMemo(() => buildOrderBlock(items, total), [items, total]);

  useEffect(() => {
    if (!open) return;
    gaEvent({
      action: "view_cart",
      params: {
        currency: "BRL",
        value: Number(total.toFixed(2)),
        items: cartToGa4Items(items),
      },
    });
  }, [open, items, total]);

  const copyBlock = async () => {
    try {
      await navigator.clipboard.writeText(block);
      alert("Resumo copiado! Cole no WhatsApp ou checkout.");
    } catch {
      const el = document.getElementById("order-block") as HTMLTextAreaElement | null;
      if (el) {
        el.select();
        document.execCommand("copy");
        alert("Resumo copiado!");
      }
    }
  };

  const WHATS_PHONE = "5563991386719";
  const whatsappHref = useMemo(
    () => `https://wa.me/${WHATS_PHONE}?text=${encodeURIComponent(block)}`,
    [block]
  );

  const onFinishClick = () => {
    gaEvent({
      action: "begin_checkout",
      params: {
        currency: "BRL",
        value: Number(total.toFixed(2)),
        items: cartToGa4Items(items),
      },
    });
    gaEvent({
      action: "generate_lead",
      params: {
        destination: "whatsapp",
        channel: "whatsapp",
        placement: "cart-modal",
        loja: "pastita",
        value: Number(total.toFixed(2)),
        currency: "BRL",
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Seu pedido">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-4xl text-zinc-300 mb-4">🛒</span>
          <p className="text-zinc-500 text-lg font-medium">Seu carrinho está vazio.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white/90 shadow-sm divide-y divide-zinc-100">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between gap-4 p-4 hover:bg-zinc-50 transition"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-900 text-base">{it.name}</span>
                  <span className="text-xs text-zinc-500">
                    {it.qty} x{" "}
                    {it.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-rose-700 min-w-[70px] text-right">
                    {(it.price * it.qty).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <button
                    onClick={() => remove(it.id)}
                    className="rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1 text-xs font-semibold transition border border-rose-200 shadow-sm"
                    title="Remover item"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-base text-zinc-700 font-medium">Total</span>
            <span className="text-2xl font-bold text-rose-700">
              {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>

          <div className="space-y-2">
            <label htmlFor="order-block" className="text-sm text-zinc-700 font-medium">
              Resumo do pedido (copiável):
            </label>
            <textarea
              id="order-block"
              className="w-full rounded-xl border border-zinc-200 p-3 text-base bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-rose-200 transition"
              rows={5}
              readOnly
              value={block}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onFinishClick}
                    className="flex-1 text-center rounded-xl bg-rose-600 text-white hover:bg-rose-700 py-3 text-base font-semibold shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                    aria-label="Finalizar pedido pelo WhatsApp"
                >
                    Finalizar pelo WhatsApp
                </a>

                <button
                    onClick={clear}
                    className="rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-3 text-base font-semibold border border-zinc-200 shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                    aria-label="Limpar carrinho"
                >
                    Limpar
                </button>
            </div>
        </div>
      )}
    </Modal>
  );
}

/* ================================
   Página
   ================================ */
export default function CardapioPastita() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("todos");
  const [openCart, setOpenCart] = useState(false);
  const [openCombo, setOpenCombo] = useState(false);

  const categories = useMemo(() => CATEGORIES, []);
  const flatItems = useMemo(
    () =>
      categories.flatMap((c) =>
        c.items.map((i) => ({ ...i, __cat: c.title, __catId: c.id } as any))
      ),
    [categories]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flatItems.filter((i: any) => {
      const matchText = `${i.name} ${i.description ?? ""} ${i.tags?.join(" ") ?? ""} ${i.__cat}`.toLowerCase();
      const matchQuery = !q || matchText.includes(q);
      const matchCat = activeCat === "todos" || i.__catId === activeCat;
      return matchQuery && matchCat;
    });
  }, [flatItems, query, activeCat]);

  const visibleCategories = useMemo(
    () => (activeCat === "todos" ? categories : categories.filter((c) => c.id === activeCat)),
    [categories, activeCat]
  );

  const { items, add } = useCart();
  const itemCount = items.reduce((acc, it) => acc + it.qty, 0);

  const handleAddCombo = (combo: { rondelli: any; molho: any; sobremesa: any }) => {
    const comboItem: MenuItem = {
      id: `combo-${combo.rondelli.id}-${combo.molho.id}-${combo.sobremesa.id}`,
      name: `Combo: ${combo.rondelli.name} + ${combo.molho.name} + ${combo.sobremesa.name}`,
      description: `Combo personalizado com ${combo.rondelli.name}, molho ${combo.molho.name} e sobremesa ${combo.sobremesa.name}.`,
      price:
        Number(combo.rondelli.price || 0) +
        Number(combo.molho.price || 0) +
        Number(combo.sobremesa.price || 0),
      imageUrl: combo.rondelli.imageUrl || PLACEHOLDER,
      tags: ["combo"],
    };
    add(comboItem);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Botões flutuantes */}
      <CartButtonFloating onClick={() => setOpenCart(true)} itemCount={itemCount} />
      <SwitchMenuButton />

      {/* Modal do carrinho */}
      <CartModal open={openCart} onClose={() => setOpenCart(false)} />

      {/* Montar combo */}
      <div className="fixed z-40 bottom-24 right-6 sm:right-8">
        <button
          onClick={() => setOpenCombo(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg px-6 py-3 font-bold text-base border-2 border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          Montar Combo
        </button>
      </div>
      <ComboModal open={openCombo} onClose={() => setOpenCombo(false)} onAddCombo={handleAddCombo} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-rose-700/95 backdrop-blur border-b border-rose-800 shadow-md">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-auto">
                <PastitaLogo />
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-semibold text-white drop-shadow">Cardápio</h1>
                <p className="text-xs text-rose-100/90">
                  Escolha seus pratos favoritos e monte seu pedido!
                </p>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <input
                type="search"
                placeholder="Buscar no cardápio..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-11 rounded-xl border border-rose-200 bg-white/95 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-2 overflow-x-auto py-4">
          <CategoryPill label="Todos" active={activeCat === "todos"} onClick={() => setActiveCat("todos")} />
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              label={c.title}
              active={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Lista */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {visibleCategories.map((category) => {
          const these = filtered.filter((i: any) => i.__catId === category.id);
          if (these.length === 0) return null;
          return (
            <div key={category.id} className="py-6" id={category.id}>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900">{category.title}</h2>
                <a href={`#${category.id}`} className="text-sm text-rose-700 hover:underline">
                  Ir para seção
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {these.map((item: any) => (
                  <ItemCard key={`${category.id}-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-zinc-600">
            Nenhum item encontrado para "{query}".
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © {new Date().getFullYear()} Pastita Massas — Template Next.js. Atualize as fotos e
              valores quando quiser.
            </p>
            <a href="/" className="hover:underline text-rose-700">
              Voltar ao início
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
