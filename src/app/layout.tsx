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
  description: "Pastita e Agrião: massas artesanais, marmitas fitness, comida saudável, delivery em Palmas. Veja o cardápio completo e peça online.",
  keywords: [
    "massa artesanal", "pastita", "massas frescas", "rondelli", "nhoque", "canelone", "marmita fitness", "comida saudável", "delivery Palmas", "restaurante Palmas", "cardápio Pastita", "cardápio Agriao", "marmitas naturais", "molhos artesanais", "kit família", "kit casal", "chef Ivoneth", "agriao marmitas"
  ],
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Pastita | Massas - Cardápio de massas artesanais, marmitas fitness e comida saudável",
    description: "Pastita Massas: massas artesanais, marmitas fitness, comida saudável, delivery em Palmas. Veja o cardápio completo e peça online.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Logo Pastita Massas" }],
    siteName: "Pastita Massas",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pastita | Massas - Cardápio de massas artesanais, marmitas fitness e comida saudável",
    description: "Pastita Massas: massas artesanais, marmitas fitness, comida saudável, delivery em Palmas. Veja o cardápio completo e peça online.",
    images: [OG_IMAGE],
    creator: "@pastitamassas",
    site: "@pastitamassas"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased")}>
        {children}
        <Toaster />
        <Footer />

        {/* GA4 */}
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
            {/* useSearchParams exige Suspense */}
            <Suspense fallback={null}>
              <AnalyticsListener />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
