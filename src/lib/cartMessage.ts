// src/lib/cartMessage.ts
import { formatBRL } from './formatCurrency';
import { CartItem as AppCartItem } from '@/context/CartContext'; // Importando o tipo correto

// Tipos locais para a função
export type CartItem = AppCartItem & {
  quantity: number; // A função original usava 'quantity', vamos manter a compatibilidade
};

export type CustomerInfo = {
  nome?: string;
  telefone?: string;
  entrega?: 'retirada' | 'delivery';
  endereco?: string;
  observacoes?: string;
};

function groupItemsByLoja(items: AppCartItem[]) {
  return items.reduce((acc, item) => {
    const lojaKey = item.loja || 'outros';
    if (!acc[lojaKey]) {
      acc[lojaKey] = [];
    }
    acc[lojaKey].push(item);
    return acc;
  }, {} as Record<string, AppCartItem[]>);
}


export function cartToGa4Items(items: AppCartItem[]) {
  return items.map((it, index) => ({
    item_id: String(it.id),
    item_name: it.name,
    index,
    item_category: (it as any).category || undefined,
    item_variant: (it as any).variant || undefined,
    price: Number(it.price.toFixed(2)),
    quantity: it.qty
  }));
}

export function calcTotals(items: AppCartItem[]) {
  return {
    subtotal: items.reduce((acc, it) => acc + it.price * it.qty, 0),
    total: items.reduce((acc, it) => acc + it.price * it.qty, 0),
  };
}

export function buildWhatsappMessage({ items, customer }: { items: AppCartItem[]; customer?: CustomerInfo; }) {
  const { total } = calcTotals(items);
  const groupedItems = groupItemsByLoja(items);
  const lojas = Object.keys(groupedItems);

  const title = lojas.length > 1 ? "*Pedido Misto (Pastita & Agrião)*" : `*Pedido ${lojas[0] === 'pastita' ? 'Pastita' : 'Agrião'}*`;

  const itemLines: string[] = [];
  lojas.forEach(loja => {
    if (lojas.length > 1) {
      itemLines.push(`\n*-- Itens ${loja === 'pastita' ? 'Pastita' : 'Agrião'} --*`);
    }
    groupedItems[loja].forEach(it => {
      const linhaBase = `• ${it.qty}x ${it.name} — ${formatBRL(it.price * it.qty)}`;
      const obs = (it as any).notes ? `\n   obs: ${(it as any).notes}` : '';
      itemLines.push(linhaBase + obs);
    });
  });

  const linhas = [
    title,
    '',
    ...(lojas.length === 1 ? ["*Itens:*"] : []),
    ...itemLines,
    '',
    `*Total do Pedido:* ${formatBRL(total)}`,
    '',
    '*Dados do cliente:*',
    `Nome: ${customer?.nome || ''}`,
    `Telefone: ${customer?.telefone || ''}`,
    `Entrega: ${customer?.entrega === 'delivery' ? 'Delivery' : 'Retirada'}`,
  ];

  if (customer?.entrega === 'delivery') {
    linhas.push(`Endereço: ${customer?.endereco || ''}`);
  }
  if (customer?.observacoes) {
    linhas.push(`Obs: ${customer.observacoes}`);
  }

  linhas.push('', 'Pode confirmar por favor? 🙏');
  return linhas.join('\n');
}