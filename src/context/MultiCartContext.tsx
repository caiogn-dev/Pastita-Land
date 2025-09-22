// src/context/MultiCartContext.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import type { MenuItem } from "@/data/menu";

// Tipos
export type LojaKey = 'pastita' | 'agriao';

export type CartItem = MenuItem & { 
  qty: number;
  loja: LojaKey;
};

type CartsState = {
  [key in LojaKey]: CartItem[];
};

type MultiCartContextState = {
  carts: CartsState;
  add: (item: CartItem) => void;
  remove: (id: string, loja: LojaKey) => void;
  clear: (loja: LojaKey) => void;
};

const MultiCartContext = createContext<MultiCartContextState | null>(null);

// O Provider que gerencia ambos os carrinhos
export function MultiCartProvider({ children }: { children: React.ReactNode }) {
  const [carts, setCarts] = useState<CartsState>({ pastita: [], agriao: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pastita-agriao-multi-cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCarts({
          pastita: parsed.pastita || [],
          agriao: parsed.agriao || [],
        });
      }
    } catch (e) {
      console.error("Falha ao carregar o carrinho do localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("pastita-agriao-multi-cart", JSON.stringify(carts));
    } catch (e) {
      console.error("Falha ao salvar o carrinho no localStorage", e);
    }
  }, [carts]);

  const add = useCallback((item: CartItem) => {
    const loja = item.loja;
    setCarts((prevCarts) => {
      const currentCart = prevCarts[loja];
      const existing = currentCart.find((x) => x.id === item.id);
      
      let newCart;
      if (existing) {
        newCart = currentCart.map((x) => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      } else {
        newCart = [...currentCart, { ...item, qty: 1 }];
      }
      return { ...prevCarts, [loja]: newCart };
    });
  }, []);

  const remove = useCallback((id: string, loja: LojaKey) => {
    setCarts((prevCarts) => ({
      ...prevCarts,
      [loja]: prevCarts[loja].filter((x) => x.id !== id),
    }));
  }, []);

  const clear = useCallback((loja: LojaKey) => {
    setCarts((prevCarts) => ({ ...prevCarts, [loja]: [] }));
  }, []);

  const value = { carts, add, remove, clear };

  return <MultiCartContext.Provider value={value}>{children}</MultiCartContext.Provider>;
}

// O Hook "inteligente" que pega apenas o carrinho da loja desejada
export function useCart(loja: LojaKey) {
  const context = useContext(MultiCartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um MultiCartProvider");

  const { carts, add, remove, clear } = context;
  const items = carts[loja];

  const total = useMemo(() => items.reduce((acc, it) => acc + it.price * it.qty, 0), [items]);

  return {
    items,
    total,
    add: (item: Omit<CartItem, 'qty'>) => {
        // A propriedade 'loja' já vem do item desde a página
        if (!item.loja) {
            console.error("Item adicionado ao carrinho sem uma 'loja' definida.");
            return;
        }
        add(item as CartItem);
    },
    remove: (id: string) => remove(id, loja),
    clear: () => clear(loja),
  };
}