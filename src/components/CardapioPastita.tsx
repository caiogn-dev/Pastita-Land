// src/components/CardapioPastita.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { AgriaoLogo } from "@/components/AgriaoLogo";
import Image from "next/image";
import { CATEGORIES, PLACEHOLDER, type MenuItem } from "@/data/menu";
import ComboModal from "@/components/ComboModal";
import { PastitaLogo } from "@/components/PastitaLogo";
import { ShoppingCart } from "lucide-react";

// --- INÍCIO DA LÓGICA DO CARRINHO (EXCLUSIVO PARA PASTITA) ---
type CartItem = MenuItem & { qty: number };
type CartState = {
  items: CartItem[];
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
};
const CartContext = createContext<CartState | null>(null);

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart (Pastita) deve ser usado dentro do CartProvider do Pastita");
  return context;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pastita-cart"); // CHAVE ÚNICA E SEPARADA
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("pastita-cart", JSON.stringify(items)); // CHAVE ÚNICA E SEPARADA
  }, [items]);

  const add = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      if (existing) {
        return prev.map((x) => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);
  
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((x) => x.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const total = useMemo(() => items.reduce((acc, it) => acc + it.price * it.qty, 0), [items]);

  return <CartContext.Provider value={{ items, add, remove, clear, total }}>{children}</CartContext.Provider>;
}
// --- FIM DA LÓGICA DO CARRINHO ---

// --- INÍCIO DOS COMPONENTES DE UI (LOCAIS PARA PASTITA) ---
function SwitchMenuButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/cardapio/agriao")}
      className="fixed bottom-8 left-6 sm:left-8 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center gap-2 px-5 py-3 text-lg font-semibold transition-all border-2 border-white animate-bounce-slow focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
      aria-label="Ir para o cardápio Agrião"
    >
      <AgriaoLogo isLink={false} />
      <span className="hidden sm:inline">Agrião</span>
    </button>
  );
}

function CategoryPill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void; }) {
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

function ItemCard({ item }: { item: MenuItem }) {
  const cart = useCart();
  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200/70 shadow-sm bg-white">
      <div className="p-4">
        {/* Renderização do item como no seu original */}
        <h3 className="font-semibold text-zinc-900">{item.name}</h3>
        <p className="text-sm text-zinc-600">{item.description}</p>
        <span className="font-semibold text-rose-600">{item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        <button
          className="mt-3 w-full h-11 rounded-xl bg-rose-600 text-white"
          onClick={() => cart.add(item)}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { items, total, remove, clear } = useCart();
    // ... Implemente a UI do seu modal aqui, usando os dados do useCart()
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Carrinho Pastita</h2>
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center mb-2">
                        <span>{item.qty}x {item.name}</span>
                        <span>{(item.price * item.qty).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                        <button onClick={() => remove(item.id)} className="text-red-500">Remover</button>
                    </div>
                ))}
                <div className="text-xl font-bold mt-4">Total: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                <button onClick={onClose} className="mt-4 w-full bg-gray-200 py-2 rounded">Fechar</button>
            </div>
        </div>
    );
}
// --- FIM DOS COMPONENTES DE UI ---


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
function PastitaPageContent() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("todos");
  const [openCart, setOpenCart] = useState(false);
  const [openCombo, setOpenCombo] = useState(false);

  const { items, add } = useCart();
  const itemCount = items.reduce((acc, it) => acc + it.qty, 0);

  const handleAddCombo = (combo: any) => {
    // ... sua lógica de adicionar combo
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <SwitchMenuButton />
      <CartModal open={openCart} onClose={() => setOpenCart(false)} />
      {/* Recrie o resto da sua UI aqui (Header, botões, lista de itens) */}
      <h1 className="text-center text-4xl p-8">Cardápio Pastita</h1>
      {/* Exemplo de botão para abrir o carrinho */}
      <button onClick={() => setOpenCart(true)} className="fixed bottom-8 right-8 bg-rose-700 text-white p-4 rounded-full shadow-lg">
        <ShoppingCart />
        {itemCount > 0 && <span className="absolute top-0 right-0 bg-white text-rose-700 rounded-full text-xs px-1">{itemCount}</span>}
      </button>
    </main>
  );
}

export default function CardapioPastita() {
  return (
    <CartProvider>
      <PastitaPageContent />
    </CartProvider>
  );
}