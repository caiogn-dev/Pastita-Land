'use client';
import { buildWhatsappUrl } from '@/lib/wa';
import { gaEvent } from '@/lib/events';

export function WhatsappCTA({
  phone,
  label = 'Pedir no WhatsApp',
  message = 'Olá! Quero fazer um pedido.',
  utm = { source: 'site', medium: 'cta', campaign: 'pedido', content: 'header' },
  className = ''
}: {
  phone: string;
  label?: string;
  message?: string;
  utm?: { source?: string; medium?: string; campaign?: string; content?: string };
  className?: string;
}) {
  const href = buildWhatsappUrl({ phone, text: message, utm });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium bg-primary text-primary-foreground hover:opacity-90 transition ${className}`}
      onClick={() =>
        gaEvent('generate_lead', {
          destination: 'whatsapp',
          channel: 'whatsapp',
          placement: utm.content || 'cta'
        })
      }
    >
      {label}
    </a>
  );
}
