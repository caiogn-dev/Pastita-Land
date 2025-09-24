// src/hooks/useCheckout.ts
"use client";
import { useState } from "react";
import { useCart } from "@/context/MultiCartContext";

export function useCheckout(theme: "pastita" | "agriao") {
  const { items, clear } = useCart(theme);
  const [loading, setLoading] = useState(false);

  async function finalize(customer?: { name?: string; phone?: string; email?: string }) {
    if (!items.length || loading) return;
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: theme,
        customer,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, imageUrl: i.imageUrl })),
      }),
    });

    setLoading(false);
    if (!res.ok) { alert("Não foi possível salvar o pedido."); return; }

    const order = await res.json(); // { id, totalCents, ... }
    const total = (order.totalCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const msg = encodeURIComponent(`Olá! Fiz o pedido ${order.id} (${theme}). Total: ${total}.`);
    window.location.href = `https://wa.me/5563991386719?text=${msg}`;
    clear();
  }

  return { finalize, loading };
}
