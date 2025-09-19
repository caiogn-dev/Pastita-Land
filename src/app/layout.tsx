// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';
import Ga from '@/components/Ga';

const SITE_URL = 'https://pastita.com.br';
const OG_IMAGE = '/Logo-site.png'; // coloque esse arquivo em /public (ideal: 1200x630)

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Pastita | Massas', template: '%s | Pastita' },
  description: 'Massas artesanais e pratos saudáveis. Explore os cardápios e peça online.',
  keywords: [
    'massa','massas artesanais','rondelli','nhoque',
    'comida saudável','delivery','restaurante','marmitas','fitness','agriao marmitas','marmitas fitness'
  ],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Pastita | Massas',
    description: 'Massas artesanais e pratos saudáveis. Explore os cardápios e peça online.',
    siteName: 'Pastita',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Pastita' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pastita | Massas',
    description: 'Massas artesanais e pratos saudáveis. Explore os cardápios e peça online.',
    images: [OG_IMAGE]
  },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/apple-touch-icon.png' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // defina seus números reais (somente dígitos, com DDI 55)
  const WHATS_PASTITA = '5561999999999';
  const WHATS_AGRIAO  = '5561888888888';

  // JSON-LD globais: Organization + 2 Restaurants com OrderAction via WhatsApp
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Pastita',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      sameAs: [
        'https://www.instagram.com/SEU_PERFIL',
        'https://www.facebook.com/SEU_PERFIL'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Pastita',
      servesCuisine: 'Massas',
      url: `${SITE_URL}/cardapio/pastita`,
      hasMenu: `${SITE_URL}/cardapio/pastita`,
      potentialAction: {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `https://wa.me/${WHATS_PASTITA}?text=Quero%20fazer%20um%20pedido%20Pastita`,
          inLanguage: 'pt-BR',
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform'
          ]
        }
      },
      telephone: '+55 (61) 99999-9999'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Agrião',
      servesCuisine: 'Saudável',
      url: `${SITE_URL}/cardapio/agriao`,
      hasMenu: `${SITE_URL}/cardapio/agriao`,
      potentialAction: {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `https://wa.me/${WHATS_AGRIAO}?text=Quero%20fazer%20um%20pedido%20Agri%C3%A3o`,
          inLanguage: 'pt-BR',
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform'
          ]
        }
      },
      telephone: '+55 (61) 88888-8888'
    }
  ];

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* JSON-LD global */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Consent Mode default (LGPD) */}
        <script
          id="consent-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
            `
          }}
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <div className="relative flex min-h-dvh flex-col bg-background">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <Ga gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
