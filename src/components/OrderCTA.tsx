'use client';
import Link from 'next/link';
import { gaEvent } from '@/lib/events';

type Props = {
  label?: string;
  href: string;            // link do anota.ai
  menu: 'pastita' | 'agriao';
  placement:
    | 'hero'
    | 'header'
    | 'sticky'
    | 'category'
    | 'footer'
    | 'home-card';
  className?: string;
};

function withUTM(url: string, menu: string, placement: string) {
  try {
    const u = new URL(url);
    // não sobrescreve query existente
    u.searchParams.set('utm_source', 'site');
    u.searchParams.set('utm_medium', 'cta');
    u.searchParams.set('utm_campaign', `${menu}-cardapio`);
    u.searchParams.set('utm_content', placement);
    return u.toString();
  } catch {
    return url;
  }
}

export default function OrderCTA({
  label = 'Peça agora',
  href,
  menu,
  placement,
  className = ''
}: Props) {
  const finalHref = withUTM(href, menu, placement);

  return (
    <Link
      href={finalHref}
      prefetch={false}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium bg-primary text-primary-foreground hover:opacity-90 transition ${className}`}
      onClick={() =>
        gaEvent('generate_lead', {
          destination: 'whatsapp',
          menu,
          placement
        })
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </Link>
  );
}
