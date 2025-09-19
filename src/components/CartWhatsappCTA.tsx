'use client';

import { buildWhatsappUrl } from '@/lib/wa';
import { gaEvent } from '@/lib/events';
import { buildWhatsappMessage, cartToGa4Items, type CartItem, type CustomerInfo } from '@/lib/cartMessage';

// TODO: troque pelo seu hook/contexto real:
import { useCart } from '@/hooks/useCart'; // <- ajuste para o caminho/assinatura corretos

export default function CartWhatsappCTA({
  loja,                   // "pastita" | "agriao"
  phone,                  // "5561999999999"
  className = ''
}: {
  loja: 'pastita' | 'agriao';
  phone: string;
  className?: string;
}) {
  const { items, subtotal, total, getCustomerInfo } = useCart() as {
    items: CartItem[];
    subtotal: number;
    total: number;
    getCustomerInfo?: () => CustomerInfo | undefined;
  };

  const handleClick = () => {
    const customer = getCustomerInfo?.() || {};
    const message = buildWhatsappMessage({
      loja: loja === 'pastita' ? 'Pastita' : 'Agrião',
      items,
      customer
    });

    // GA4 — view_cart pode ser disparado ao abrir o modal (no componente do Modal).
    // Aqui no clique, dispare 'begin_checkout' + 'generate_lead'.
    const gaItems = cartToGa4Items(items);

    gaEvent('begin_checkout', {
      currency: 'BRL',
      value: Number(total?.toFixed?.(2) ?? 0),
      coupon: undefined,
      items: gaItems
    });

    gaEvent('generate_lead', {
      destination: 'whatsapp',
      channel: 'whatsapp',
      placement: 'cart-modal',
      loja
    });

    const href = buildWhatsappUrl({
      phone,
      text: message,
      utm: {
        source: 'site',
        medium: 'whatsapp',
        campaign: loja,
        content: 'cart-modal'
      }
    });

    // Abra o WhatsApp
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const disabled = !items?.length;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-base font-medium text-primary-foreground transition
                  ${disabled ? 'bg-muted cursor-not-allowed' : 'bg-primary hover:opacity-90'} ${className}`}
    >
      Finalizar pelo WhatsApp
    </button>
  );
}
