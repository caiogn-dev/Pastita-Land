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
      {/* Google Analytics 4 via next/script */}
      <head>
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F6RDSM45Q0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F6RDSM45Q0');
            `,
          }}
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
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
