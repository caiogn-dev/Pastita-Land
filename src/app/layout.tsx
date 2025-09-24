// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://pastita.com.br";
const OG_IMAGE = "https://pastita.com.br/icons/ivoneth-512.png";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pastita | Agrião",
    template: "%s | Cardápio",
  },
  description:
    "Pastita e Agrião: massas artesanais, marmitas fitness, comida saudável, delivery em Palmas. Veja o cardápio completo e peça online.",
  keywords: [
    "massa artesanal","pastita","massas frescas","rondelli","nhoque","canelone",
    "marmita fitness","comida saudável","delivery Palmas","restaurante Palmas",
    "cardápio Pastita","cardápio Agriao","marmitas naturais","molhos artesanais",
    "kit família","kit casal","chef Ivoneth","agriao marmitas"
  ],
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Pastita | Agrião",
    description:
      "Pastita e Agrião: massas artesanais, marmitas fitness, comida saudável, delivery em Palmas. Veja o cardápio completo e peça online.",
    images: [{ url: OG_IMAGE, width: 512, height: 512, alt: "Logo Pastita Massas" }],
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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

// 🔴 OBRIGATÓRIO: export default componente React
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      {/* <head /> é opcional no App Router */}
      <body>{children}</body>
    </html>
  );
}
