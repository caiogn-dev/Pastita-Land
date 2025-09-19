'use client';
import OrderCTA from './OrderCTA';
import { gaEvent } from '@/lib/events';

export default function StickyOrderBar({
  menu,
  orderUrl,
  whatsapp
}: {
  menu: 'pastita' | 'agriao';
  orderUrl: string;
  whatsapp: { phone: string; text?: string };
}) {
  const waURL = (() => {
    const base = `https://wa.me/${whatsapp.phone.replace(/\D/g, '')}`;
    const u = new URL(base);
    u.searchParams.set('text', whatsapp.text || 'Quero fazer um pedido');
    // UTM no WhatsApp também
    u.searchParams.set('utm_source', 'site');
    u.searchParams.set('utm_medium', 'whatsapp');
    u.searchParams.set('utm_campaign', `${menu}-cardapio`);
    return u.toString();
  })();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="mx-auto max-w-screen-sm px-4 py-3 flex gap-2">
        <OrderCTA
          href={orderUrl}
          menu={menu}
          placement="sticky"
          className="flex-1"
        />
        <a
          href={waURL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => gaEvent('select_promotion', { menu, channel: 'whatsapp', placement: 'sticky' })}
          className="flex-1 inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium border hover:bg-muted transition"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
