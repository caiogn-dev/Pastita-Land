// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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
  // GTM removido, só Analytics

  return (
    <html lang="pt-BR" className="scroll-smooth">
  {/* <head> removido, agora controlado por app/head.tsx */}
      <body className={cn('min-h-screen bg-background font-body antialiased')}>

  {/* Google Analytics e fontes agora estão em app/head.tsx */}


        <div className="relative flex min-h-dvh flex-col bg-background">
          <main className="flex-1">{children}</main>
    <Footer />
        </div>
        <Toaster />

        {/* (Opcional) Componente de consentimento LGPD/Consent Mode pode vir aqui */}
      </body>
    </html>
  );
}
