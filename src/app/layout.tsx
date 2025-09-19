import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer";
import AnalyticsListener from "./analytics-listener";
import Script from "next/script";
import { Suspense } from "react";

const SITE_URL = "https://pastita.com.br";
const OG_IMAGE = "/Logo-site.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Pastita | Massas", template: "%s | Pastita" },
  description: "Massas artesanais e pratos saudáveis. Explore os cardápios e peça online.",
  keywords: [
    "massa","massas artesanais","rondelli","nhoque",
    "comida saudável","delivery","restaurante","marmitas","fitness","agriao marmitas","marmitas fitness"
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Pastita | Massas",
    description: "Massas artesanais e pratos saudáveis. Explore os cardápios e peça online.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pastita | Massas",
    description: "Massas artesanais e pratos saudáveis. Explore os cardápios e peça online.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  verification: {
    // se tiver códigos de verificação:
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
