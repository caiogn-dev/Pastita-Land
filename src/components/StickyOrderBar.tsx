'use client';
import { WhatsappCTA } from './CartWhatsappCTA';
import { gaEvent } from '@/lib/events';

export default function StickyWhatsappBar({
  phone,
  menu,               // 'pastita' | 'agriao' | 'site'
  message = 'Olá! Quero fazer um pedido.',
  label = 'Pedir no WhatsApp'
}: {
  phone: string;
  menu: string;
  message?: string;
  label?: string;
}) {
  const utmBase = {
    source: 'site',
    medium: 'whatsapp',
    campaign: `${menu}-cardapio`,
    content: 'sticky'
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="mx-auto max-w-screen-sm px-4 py-3 flex gap-2">
        <WhatsappCTA
          phone={phone}
          message={message}
          label={label}
          utm={utmBase}
          className="flex-1"
        />
        <button
          onClick={() => gaEvent('select_promotion', { menu, channel: 'whatsapp', placement: 'sticky_info' })}
          className="flex-1 inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium border hover:bg-muted transition"
        >
          Ver Cardápio
        </button>
      </div>
    </div>
  );
}
