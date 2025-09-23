// src/context/CartContext.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import type { MenuItem } from "@/data/menu";

/* ===========================================================
   Tipos
   =========================================================== */
export type CartItem = MenuItem & { qty: number };

export type CartState = {
  items: CartItem[];
  total: number;

  add: (item: MenuItem | (MenuItem & Partial<Pick<CartItem, "qty">>)) => void;
  remove: (id: string) => void;
  clear: () => void;
  setQty: (id: string, qty: number) => void;
};

/* ===========================================================
   Constantes
   =========================================================== */
const STORAGE_KEY = "pastita-agriao-cart";

/* ===========================================================
   Contexto com VALORES SEGUROS por padrão
   (evita null/undefined durante a montagem)
   =========================================================== */
const CartContext = createContext<CartState>({
  items: [],
  total: 0,
  add: () => {},
  remove: () => {},
  clear: () => {},
  setQty: () => {},
});

/* Hook */
export function useCart() {
  return useContext(CartContext);
}

/* ===========================================================
   Provider
   =========================================================== */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hidratação do localStorage (lado do cliente)
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized: CartItem[] = parsed
          .filter((x) => x && typeof x.id === "string")
          .map((x) => ({
            id: String(x.id),
            name: String(x.name ?? ""),
            price: Number(x.price ?? 0),
            qty: Math.max(0, Number(x.qty ?? 0)),
            description: x.description ? String(x.description) : undefined,
            imageUrl: x.imageUrl ? String(x.imageUrl) : undefined,
            tags: Array.isArray(x.tags) ? x.tags.map(String) : undefined,
          }));
        setItems(normalized);
      }
    } catch {
      // silêncio: não quebra a UI se o JSON estiver inválido
    }
  }, []);

  // Persistência no localStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  /* ========================
     Ações
     ======================== */
  const add = useCallback<CartState["add"]>((item) => {
    setItems((prev) => {
      const qtyToAdd = Math.max(0, Number((item as any)?.qty ?? 1));
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          qty: (Number(next[idx].qty) || 0) + qtyToAdd,
        };
        return next;
      }
      return [
        ...prev,
        {
          ...item,
          price: Number(item.price ?? 0),
          qty: qtyToAdd,
        },
      ];
    });
  }, []);

  const remove = useCallback<CartState["remove"]>((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clear = useCallback<CartState["clear"]>(() => {
    setItems([]);
  }, []);

  const setQty = useCallback<CartState["setQty"]>((id, qty) => {
    setItems((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, qty: Math.max(0, Number(qty || 0)) } : x
      )
    );
  }, []);

  /* ========================
     Derivados (sempre válidos)
     ======================== */
  const total = useMemo(() => {
    return items.reduce(
      (acc, it) =>
        acc + (Number(it.price) || 0) * (Math.max(0, Number(it.qty)) || 0),
      0
    );
  }, [items]);

  const value: CartState = useMemo(
    () => ({ items, total, add, remove, clear, setQty }),
    [items, total, add, remove, clear, setQty]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
