"use client";

import React, { useMemo, useEffect } from "react";
import { useCart } from "@/context/MultiCartContext";
import { Modal } from "@/components/Modal";
import { buildWhatsappMessage, cartToGa4Items } from "@/lib/cartMessage";
import { event as gaEvent } from "@/lib/ga";
import { cn } from "@/lib/utils";

type CartModalProps = {
  open: boolean;
  onClose: () => void;
  theme: "pastita" | "agriao";
  onConfirm?: () => void;       // salva pedido via API (useCheckout)
  confirmLoading?: boolean;     // loading do salvamento
};

export function CartModal({
  open,
  onClose,
  theme,
  onConfirm,
  confirmLoading,
}: CartModalProps) {
  const { items, total, remove, clear } = useCart(theme);
  const loja = theme === "pastita" ? "Pastita" : "Agrião";

  // Só para manter a telemetria/GA quando o carrinho abre
  const gaItems = useMemo(() => cartToGa4Items(items), [items]);

  useEffect(() => {
    if (!open || items.length === 0) return;
    gaEvent({
      action: "view_cart",
      params: { currency: "BRL", value: total, items: gaItems },
    });
  }, [open, items, total, gaItems]);

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
              <div
                key={it.id}
                className="flex items-center justify-between gap-4 p-4 hover:bg-zinc-50 transition"
              >
                <div>
                  <span className="font-semibold text-zinc-900 text-base">{it.name}</span>
                  <span className="text-xs text-zinc-500 block">
                    {it.qty} x{" "}
                    {it.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-base font-bold min-w-[70px] text-right",
                      classes.accentText
                    )}
                  >
                    {(it.price * it.qty).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <button
                    onClick={() => remove(it.id)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition border shadow-sm",
                      classes.accentText,
                      classes.removeButtonBg,
                      classes.removeButtonBorder
                    )}
                    title="Remover item"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-lg text-zinc-700 font-medium">Total</span>
            <span className={cn("text-2xl font-bold", classes.accentText)}>
              {Number(total || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          {/* Um único botão: SALVAR + WHATSAPP (useCheckout.finalize) */}
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button
              onClick={() => {
                gaEvent({
                  action: "begin_checkout",
                  params: { currency: "BRL", value: total, items: gaItems },
                });
                onConfirm?.(); // salva no banco e abre WhatsApp (implementado no useCheckout)
              }}
              disabled={!!confirmLoading}
              className={cn(
                "flex-1 text-center rounded-xl text-white py-3 text-base font-semibold shadow transition focus:outline-none focus-visible:ring-2",
                classes.buttonBg,
                classes.buttonHoverBg,
                classes.focusRing,
                confirmLoading && "opacity-70 cursor-not-allowed"
              )}
              aria-label="Finalizar pedido"
            >
              {confirmLoading ? "Enviando..." : "Finalizar pedido"}
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
