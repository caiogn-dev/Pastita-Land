// app/cardapio/page.tsx
'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getUtmFromSearchParams, pushDL } from '@/lib/events';

export const dynamic = 'force-dynamic'; // evita tentativa de SSG com search params

const DEST = process.env.NEXT_PUBLIC_MENU_DEST!;

function CardapioInner() {
  const sp = useSearchParams();
  const utm = useMemo(() => getUtmFromSearchParams(sp as any), [sp]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    pushDL('view_menu_click', { destination_url: DEST, ...utm });
    setTimeout(() => (window.location.href = DEST), 150);
  };

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
        Cardápio Pastita
      </h1>
      <p className="mt-4 text-muted-foreground md:text-lg">
        Massas artesanais, molhos e combos. Clique abaixo para abrir o cardápio.
      </p>
      <div className="mt-8">
        <Button
          size="lg"
          onClick={handleClick}
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-semibold px-8 py-6 rounded-full shadow-md"
        >
          Ver Cardápio
        </Button>
      </div>
      <div className="mt-10 text-sm text-muted-foreground">
        Dica: adicione aqui um cupom em troca do WhatsApp para capturar leads.
      </div>
    </main>
  );
}

export default function CardapioPage() {
  return (
    <Suspense fallback={null}>
      <CardapioInner />
    </Suspense>
  );
}
