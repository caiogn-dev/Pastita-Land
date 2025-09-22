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
import type { MenuItem } from "@/data/menu"; // Assumindo que MenuItem está em menu

/* ===========================================================
   CARRINHO (context + provider + hook)
   =========================================================== */
export type CartItem = MenuItem & { qty: number };

export type CartState = {
  items: CartItem[];
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartState | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pastita-agriao-cart");
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (error) {
      console.error("Falha ao carregar o carrinho do localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("pastita-agriao-cart", JSON.stringify(items));
    } catch (error) {
      console.error("Falha ao salvar o carrinho no localStorage", error);
    }
  }, [items]);

  const add = useCallback((item: MenuItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((x) => x.id === item.id);
      if (existingItem) {
        return prevItems.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prevItems, { ...item, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((x) => x.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );

  const value: CartState = { items, add, remove, clear, total };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}