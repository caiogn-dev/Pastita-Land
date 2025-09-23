// src/components/CartModal.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { useCart } from "@/context/MultiCartContext"; // ATUALIZADO
import { Modal } from "@/components/Modal";
import { buildWhatsappMessage, cartToGa4Items } from "@/lib/cartMessage";
import { event as gaEvent } from "@/lib/ga";
import { buildWhatsappUrl } from "@/lib/wa";
import { cn } from "@/lib/utils";

type CartModalProps = {
  open: boolean;
  onClose: () => void;
  theme: "pastita" | "agriao";
};


export function CartModal({ open, onClose, theme }: CartModalProps) {
  // ATUALIZADO: O hook já nos dá o carrinho CERTO para a página atual.
  const { items, total, remove, clear } = useCart(theme);
  
  const loja = theme === 'pastita' ? 'Pastita' : 'Agrião';

  // Lógica da mensagem adaptada para usar um único carrinho por vez
  const message = useMemo(
    () => buildWhatsappMessage({ loja, items: items.map(it => ({...it, quantity: it.qty})) }),
    [items, loja]
  );

  useEffect(() => {
    if (!open || items.length === 0) return;
    gaEvent({
      action: "view_cart",
      params: { currency: "BRL", value: total, items: cartToGa4Items(items) },
    });
  }, [open, items, total]);

  const onFinishClick = () => {
    gaEvent({
      action: "begin_checkout",
      params: { currency: "BRL", value: total, items: cartToGa4Items(items) },
    });
    gaEvent({
      action: "generate_lead",
      params: { destination: "whatsapp", placement: "cart-modal", loja: theme },
    });

    const href = buildWhatsappUrl({
      phone: "5563991386719", // SEU NÚMERO DE WHATSAPP
>>>>>>> dev
      text: message,
    });
    window.open(href, "_blank", "noopener,noreferrer");
  };

  
  const themeClasses = {
    pastita: {
      accentText: "text-rose-700",
      buttonBg: "bg-rose-600",
      buttonHoverBg: "hover:bg-rose-700",
      focusRing: "focus-visible:ring-rose-300",
      removeButtonBg: "bg-rose-100 hover:bg-rose-200",
      removeButtonBorder: "border-rose-200",
    },
    agriao: {
      accentText: "text-green-700",
      buttonBg: "bg-green-600",
      buttonHoverBg: "hover:bg-green-700",
      focusRing: "focus-visible:ring-green-300",
      removeButtonBg: "bg-green-100 hover:bg-green-200",
      removeButtonBorder: "border-green-200",
    },
  } as const;
  const classes = themeClasses[theme];

  return (
    <Modal open={open} onClose={onClose} title={`Seu Pedido ${loja}`}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-4xl text-zinc-300 mb-4">🛒</span>
          <p className="text-zinc-500 text-lg font-medium">Seu carrinho está vazio.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white/90 shadow-sm divide-y divide-zinc-100">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-4 p-4 hover:bg-zinc-50 transition">
                <div>
                  <span className="font-semibold text-zinc-900 text-base">{it.name}</span>
                  <span className="text-xs text-zinc-500 block">{it.qty} x {it.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-base font-bold min-w-[70px] text-right", classes.accentText)}>
                    {(it.price * it.qty).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                  <button onClick={() => remove(it.id)} className={cn("rounded-full px-3 py-1 text-xs font-semibold transition border shadow-sm", classes.accentText, classes.removeButtonBg, classes.removeButtonBorder)} title="Remover item">
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-lg text-zinc-700 font-medium">Total</span>

            <span className={cn("text-2xl font-bold", classes.accentText)}>
              {Number(total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>



          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button
              onClick={onFinishClick}
              className={cn(
                "flex-1 text-center rounded-xl text-white py-3 text-base font-semibold shadow transition focus:outline-none focus-visible:ring-2",
                classes.buttonBg,
                classes.buttonHoverBg,
                classes.focusRing
              )}
              aria-label="Finalizar pedido pelo WhatsApp"
            >
              Finalizar pelo WhatsApp
            </button>
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
