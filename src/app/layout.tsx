import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';
import Ga from '@/components/Ga';

export const metadata: Metadata = {
  title: 'Pastita | Massas',
  description:
    'Descubra o sabor de massas incríveis. Explore nosso cardápio e peça online para uma experiência deliciosa.',
  keywords: ['massa', 'comida', 'restaurante', 'cardápio online', 'delivery'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <div className="relative flex min-h-dvh flex-col bg-background">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />

        {/* Google Analytics 4 via componente e ENV */}
        <Ga gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}