"use client";


import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  CATEGORIES,
  PLACEHOLDER,
  type MenuItem,
} from "@/data/menu.updated";
import { AgriaoLogo } from "@/components/AgriaoLogo";
import { ShoppingCart } from "lucide-react";

const CURRENCY = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type CartItem = MenuItem & { qty: number };
type CartState = {
  items: CartItem[];
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
};
const CartCtx = createContext<CartState | null>(null);
function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("Cart context missing");
  return ctx;
}
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("agriao-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("agriao-cart", JSON.stringify(items));
    } catch {}
  }, [items]);
  const add = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const ix = prev.findIndex((x) => x.id === item.id);
      if (ix >= 0) {
        const clone = [...prev];
        clone[ix] = { ...clone[ix], qty: clone[ix].qty + 1 };
        return clone;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);
  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);
  const clear = useCallback(() => setItems([]), []);
  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );
  const value: CartState = { items, add, remove, clear, total };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

function CategoryPill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void; }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition border ${
        active
          ? "bg-green-700 text-white border-green-700"
          : "bg-white/80 hover:bg-green-50 border-green-200 text-green-700"
      }`}
    >
      {label}
    </button>
  );
}

function ItemCardAgriao({ item }: { item: MenuItem }) {
  const cart = useCart();
  return (
    <div className="group overflow-hidden rounded-2xl border border-green-200 shadow-sm bg-white dark:bg-zinc-900">
      <div className="aspect-[4/3] w-full bg-green-50 dark:bg-green-900">
        <img
          src={item.imageUrl || PLACEHOLDER}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-green-900 dark:text-green-100 leading-tight">
            {item.name}
          </h3>
          <span className="font-semibold text-green-700 dark:text-green-400">
            {CURRENCY(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="mt-2 text-sm text-green-700 dark:text-green-300 line-clamp-3">
            {item.description}
          </p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-900"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4">
          <button
            className="w-full rounded-xl border-2 border-green-700 bg-green-700 text-white hover:bg-white hover:text-green-700 hover:border-green-700 active:bg-green-800 active:text-white transition py-2 text-base font-bold shadow-sm"
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

function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title: string; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-green-200">
        <div className="flex items-center justify-between p-4 border-b border-green-200">
          <h3 className="text-lg font-semibold text-green-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-green-200 px-3 py-1 text-sm"
          >
            Fechar
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function buildOrderBlock(items: CartItem[], total: number) {
  const lines = [
    "*Pedido — Agriao Marmitas*",
    "",
    ...items.map(
      (it) => `• ${it.qty}x ${it.name} — ${CURRENCY(it.price)} (cada)`
    ),
    "",
    `*Total:* ${CURRENCY(total)}`,
  ];
  return lines.join("\n");
}

function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, remove, clear } = useCart();
  const block = useMemo(() => buildOrderBlock(items, total), [items, total]);
  const copyBlock = async () => {
    try {
      await navigator.clipboard.writeText(block);
      alert("Resumo copiado! Cole no WhatsApp ou checkout.");
    } catch {
      const el = document.getElementById(
        "order-block"
      ) as HTMLTextAreaElement | null;
      if (el) {
        el.select();
        document.execCommand("copy");
        alert("Resumo copiado!");
      }
    }
  };
  const whatsappHref = useMemo(() => {
    const phone = ""; // DDI+DDD+número
    const text = encodeURIComponent(block);
    return phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`;
  }, [block]);
  return (
    <Modal open={open} onClose={onClose} title="Seu pedido">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-4xl text-green-300 mb-4">🛒</span>
          <p className="text-green-500 text-lg font-medium">
            Seu carrinho está vazio.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-green-200 bg-white/90 shadow-sm divide-y divide-green-100">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between gap-4 p-4 hover:bg-green-50 transition"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-green-900 text-base">
                    {it.name}
                  </span>
                  <span className="text-xs text-green-500">
                    {it.qty} x {CURRENCY(it.price)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-green-700 min-w-[70px] text-right">
                    {CURRENCY(it.price * it.qty)}
                  </span>
                  <button
                    onClick={() => remove(it.id)}
                    className="rounded-full bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 text-xs font-semibold transition border border-green-200 shadow-sm"
                    title="Remover item"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-base text-green-700 font-medium">Total</span>
            <span className="text-2xl font-bold text-green-700">
              {CURRENCY(total)}
            </span>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="order-block"
              className="text-sm text-green-700 font-medium"
            >
              Resumo do pedido (copiável):
            </label>
            <textarea
              id="order-block"
              className="w-full rounded-xl border border-green-200 p-3 text-base bg-green-50 focus:bg-white focus:ring-2 focus:ring-green-200 transition"
              rows={5}
              readOnly
              value={block}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button
              onClick={copyBlock}
              className="flex-1 rounded-xl bg-green-900 text-white hover:bg-green-800 py-3 text-base font-semibold shadow transition"
            >
              Copiar resumo
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              className="flex-1 text-center rounded-xl bg-green-700 text-white hover:bg-green-800 py-3 text-base font-semibold shadow transition"
            >
              Finalizar pelo WhatsApp
            </a>
            <button
              onClick={clear}
              className="rounded-xl bg-green-100 hover:bg-green-200 text-green-700 px-4 py-3 text-base font-semibold border border-green-200 shadow transition"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function CartButtonFloating({ onClick, itemCount }: { onClick: () => void; itemCount: number; }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-50 bottom-6 right-6 sm:bottom-8 sm:right-8 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg flex items-center gap-2 px-5 py-3 text-lg font-bold transition-all border-2 border-white"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="w-6 h-6 mr-2" />
      <span>Carrinho</span>
      {itemCount > 0 && (
        <span className="ml-2 bg-white text-green-700 rounded-full px-2 py-0.5 text-xs font-bold min-w-[24px] text-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}


export default function CardapioAgriao() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("todos");
  const [openCart, setOpenCart] = useState(false);
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
      const matchText = `${i.name} ${i.description ?? ""} ${
        i.tags?.join(" ") ?? ""
      } ${i.__cat}`.toLowerCase();
      const matchQuery = !q || matchText.includes(q);
      const matchCat = activeCat === "todos" || i.__catId === activeCat;
      return matchQuery && matchCat;
    });
  }, [flatItems, query, activeCat]);
  const visibleCategories = useMemo(
    () =>
      activeCat === "todos"
        ? categories
        : categories.filter((c) => c.id === activeCat),
    [categories, activeCat]
  );
  const { items } = useCart();
  const itemCount = items.reduce((acc, it) => acc + it.qty, 0);
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Botão flutuante do carrinho */}
      <CartButtonFloating
        onClick={() => setOpenCart(true)}
        itemCount={itemCount}
      />
      <CartModal open={openCart} onClose={() => setOpenCart(false)} />

      {/* Header - igual ao Pastita, mas verde */}
      <header className="sticky top-0 z-30 bg-green-700 border-b border-green-800 shadow-md">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10">
                <AgriaoLogo />
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-semibold text-white drop-shadow">
                  Cardápio
                </h1>
                <p className="text-xs text-green-200">
                  Escolha seus pratos favoritos e monte seu pedido!
                </p>
              </div>
            </div>
            {/* Campo de busca */}
            <div className="w-full max-w-sm">
              <input
                type="search"
                placeholder="Buscar no cardápio..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-green-200 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Pills */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-2 overflow-x-auto py-4">
          <CategoryPill
            label="Todos"
            active={activeCat === "todos"}
            onClick={() => setActiveCat("todos")}
          />
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

      {/* Menu sections */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {visibleCategories.map((category) => {
          const these = filtered.filter((i: any) => i.__catId === category.id);
          if (these.length === 0) return null;
          return (
            <div key={category.id} className="py-6" id={category.id}>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-semibold text-green-900">
                  {category.title}
                </h2>
                <a
                  href={`#${category.id}`}
                  className="text-sm text-green-700 hover:underline"
                >
                  Ir para seção
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {these.map((item: any) => (
                  <ItemCardAgriao key={`${category.id}-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-green-600">
            Nenhum item encontrado para "{query}".
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-green-200 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-green-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © {new Date().getFullYear()} Agriao Marmitas — Template Next.js.
              Atualize as fotos e valores quando quiser.
            </p>
            <a href="/" className="hover:underline text-green-700">
              Voltar ao início
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
