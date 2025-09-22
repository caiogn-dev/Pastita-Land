// src/lib/cartMessage.ts
import { calcTotals } from "@/lib/calcTotals";

/** Item para Whats/GA */
export type WhatsItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

function formatBRL(n: number) {
  return (Number(n) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Gera a mensagem do WhatsApp de forma resiliente.
 * Nunca lança por causa de totals undefined.
 */
export function buildWhatsappMessage(opts: {
  items?: WhatsItem[] | null;
  title?: string;
  intro?: string;
  outro?: string;
}): string {
  const safeItems = Array.isArray(opts.items) ? opts.items : [];

  // Usa o calcTotals (que já é seguro e nunca retorna undefined)
  const totals = calcTotals(
    safeItems.map((i) => ({ price: i.price, qty: i.quantity }))
  );

  const lines: string[] = [];
  if (opts.title) lines.push(`*${opts.title}*`);
  if (opts.intro) lines.push(opts.intro);

  if (safeItems.length === 0) {
    lines.push("_Carrinho vazio_");
  } else {
    for (const it of safeItems) {
      const subtotal = Number(it.price || 0) * Number(it.quantity || 0);
      lines.push(
        `• ${it.quantity}× ${it.name} — ${formatBRL(it.price)} (subtotal ${formatBRL(
          subtotal
        )})`
      );
    }
  }

  // Totais
  lines.push("");
  lines.push(`Subtotal: ${formatBRL(totals.subtotal)}`);
  if ((totals.discount || 0) > 0) {
    lines.push(`Desconto: -${formatBRL(totals.discount)}`);
  }
  lines.push(`*Total: ${formatBRL(totals.total)}*`);

  if (opts.outro) {
    lines.push("");
    lines.push(opts.outro);
  }

  return lines.join("\n");
}

/**
 * GA4 items seguro.
 */
export function cartToGa4Items(items?: WhatsItem[] | null) {
  const safe = Array.isArray(items) ? items : [];
  return safe.map((it, index) => ({
    item_id: String(it.id),
    item_name: String(it.name ?? ""),
    price: Number(it.price) || 0,
    quantity: Number(it.quantity) || 0,
    index,
    currency: "BRL",
  }));
}
