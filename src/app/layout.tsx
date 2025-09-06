// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
// import GaClient from '@/components/GaClient';

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* fontes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>

  {/* Google Analytics carregado em todas as páginas */}
  {/* Google tag (gtag.js) - inserido diretamente no head */}
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {/* fontes */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
      rel="stylesheet"
    />
    {/* Google Analytics 4 tag padrão */}
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-MWC3H6H1BJ"></script>
    <script dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-MWC3H6H1BJ');
      `
    }} />
  </head>


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
