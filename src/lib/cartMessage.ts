import { formatBRL } from './formatCurrency';

export type CartItem = {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  variant?: string;
  notes?: string;
};

export type CustomerInfo = {
  nome?: string;
  telefone?: string;
  entrega?: 'retirada' | 'delivery';
  endereco?: string;     // se delivery
  observacoes?: string;  // observações gerais
};

export function cartToGa4Items(items: CartItem[]) {
  // GA4 items specification
  return items.map((it, index) => ({
    item_id: String(it.id),
    item_name: it.name,
    index,
    item_category: it.category || undefined,
    item_variant: it.variant || undefined,
    price: Number(it.price.toFixed(2)),
    quantity: it.quantity
  }));
}

export function calcTotals(items: CartItem[]) {
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  return { subtotal, total: subtotal }; // se tiver taxa/entrega, some aqui
}

export function buildWhatsappMessage({
  loja,               // "Pastita" | "Agrião"
  items,
  customer
}: {
  loja: string;
  items: CartItem[];
  customer?: CustomerInfo;
}) {
  const { subtotal, total } = calcTotals(items);

  const linhas = [
    `*Pedido ${loja}*`,
    '',
    '*Itens:*',
    ...items.map((it) => {
      const linhaBase = `• ${it.quantity}x ${it.name}${it.variant ? ` (${it.variant})` : ''} — ${formatBRL(it.price * it.quantity)}`;
      const obs = it.notes ? `\n   obs: ${it.notes}` : '';
      return linhaBase + obs;
    }),
    '',
    `*Subtotal:* ${formatBRL(subtotal)}`,
    // Se tiver taxa/entrega, adicione aqui e ajuste o total acima.
    `*Total:* ${formatBRL(total)}`,
    '',
    '*Dados do cliente:*',
    customer?.nome ? `Nome: ${customer.nome}` : 'Nome: ',
    customer?.telefone ? `Telefone: ${customer.telefone}` : 'Telefone: ',
    customer?.entrega ? `Entrega: ${customer.entrega === 'delivery' ? 'Delivery' : 'Retirada'}` : 'Entrega: ',
  ];

  if (customer?.entrega === 'delivery') {
    linhas.push(customer?.endereco ? `Endereço: ${customer.endereco}` : 'Endereço: ');
  }
  if (customer?.observacoes) {
    linhas.push(`Obs: ${customer.observacoes}`);
  }

  linhas.push('', 'Pode confirmar por favor? 🙏');

  return linhas.join('\n');
}
