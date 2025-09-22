// src/lib/cartMessage.ts
import { formatBRL } from './formatCurrency';

// Adicione a propriedade 'loja' aos tipos
export type CartItem = {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
  loja?: 'pastita' | 'agriao';
  // ... outras propriedades
};

export type CustomerInfo = { /* ... */ };

// Função de agrupamento
function groupItemsByLoja(items: CartItem[]) {
  return items.reduce((acc, item) => {
    const lojaKey = item.loja || 'outros';
    if (!acc[lojaKey]) {
      acc[lojaKey] = [];
    }
    acc[lojaKey].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);
}

export function cartToGa4Items(items: CartItem[]) {
    // ... (função existente)
}
export function calcTotals(items: CartItem[]) {
    // ... (função existente)
}


export function buildWhatsappMessage({ items, customer }: { items: CartItem[]; customer?: CustomerInfo }) {
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
      const linhaBase = `• ${it.quantity}x ${it.name} — ${formatBRL(it.price * it.quantity)}`;
      itemLines.push(linhaBase);
    });
  });

  const linhas = [
    title,
    '',
    ...(lojas.length === 1 ? ["*Itens:*"] : []), // Adiciona "Itens:" apenas se for de uma loja só
    ...itemLines,
    '',
    `*Total do Pedido:* ${formatBRL(total)}`,
    '',
    '*Dados do cliente:*',
    `Nome: ${customer?.nome || ''}`,
    `Telefone: ${customer?.telefone || ''}`,
    // ... (resto da lógica)
  ];

  linhas.push('', 'Pode confirmar por favor? 🙏');
  return linhas.join('\n');
}