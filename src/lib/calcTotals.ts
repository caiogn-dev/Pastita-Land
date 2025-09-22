// src/lib/calcTotals.ts

export type Totals = {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
};

type PriceQty = { price?: number; qty?: number };

/**
 * calcTotals NUNCA retorna undefined.
 * Pode receber items undefined/null sem quebrar.
 */
export function calcTotals(items?: PriceQty[] | null): Totals {
  const list = Array.isArray(items) ? items : [];
  const count = list.reduce((acc, it) => acc + (Number(it.qty) || 0), 0);
  const subtotal = list.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 0),
    0
  );
  const discount = 0; // ajuste sua regra aqui, se existir
  const total = Math.max(0, subtotal - discount);
  return { count, subtotal, discount, total };
}

/** Atalho seguro: retorna só o total numérico. */
export function getTotal(items?: PriceQty[] | null): number {
  return calcTotals(items).total;
}
