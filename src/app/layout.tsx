// app/layout.tsx (ou app/(site)/layout.tsx)
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer";
import AnalyticsListener from "./analytics-listener";
import Script from "next/script";
import { Suspense } from "react";

const SITE_URL = "https://pastita.com.br";
const OG_IMAGE = "https://pastita.com.br/pastita-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pastita | Agrião",
  description:
    "Pastita e Agrião: massas artesanais, marmitas fitness, comida saudável, delivery em Palmas. Veja o cardápio completo e peça online.",
  keywords: [
    "massa artesanal", "pastita", "massas frescas", "rondelli", "nhoque", "canelone",
    "marmita fitness", "comida saudável", "delivery Palmas", "restaurante Palmas",
    "cardápio Pastita", "cardápio Agriao", "marmitas naturais", "molhos artesanais",
    "kit família", "kit casal", "chef Ivoneth", "agriao marmitas"
  ],
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    // opcional: ajuda o Google a gerar snippet e prévias de imagem/vídeo
    // nocache: false,
    // googleBot: "max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title:
      "Pastita | Agrião - Cardápio de massas artesanais, marmitas fitness e comida saudável",
    description:
      "Pastita e Agrião: massas artesanais, marmitas fitness, comida saudável, delivery em Palmas. Veja o cardápio completo e peça online.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Logo Pastita Massas" }],
    siteName: "Pastita Massas",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pastita | Massas - Cardápio de massas artesanais, marmitas fitness e comida saudável",
    description:
      "Pastita Massas: massas artesanais, marmitas fitness, comida saudável, delivery em Palmas. Veja o cardápio completo e peça online.",
    images: [OG_IMAGE],
    creator: "@pastitamassas",
    site: "@pastitamassas",
  },
  icons: {
    // ➜ use caminhos públicos (raiz) — NÃO "public/..."
    icon: [
      { url: "/favicon.ico" },
      { url: "https://pastita.com.br/favicon-48x48.png", sizes: "48x48", type: "image/png" }, // explícito e absoluto
      // { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png", // 180x180
    shortcut: "/favicon.ico",
    other: [
      // opcional para Safari
      // { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    // Se você verificou por DNS, isso é opcional.
    // Deixe apenas se também quiser verificação por meta tag:
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased")}>
        {children}
        <Toaster />
        <Footer />

        {GA_ID && process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
            <Suspense fallback={null}>
              <AnalyticsListener />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
