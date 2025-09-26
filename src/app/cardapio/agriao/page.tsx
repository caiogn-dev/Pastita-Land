// src/app/cardapio/agriao/page.tsx
import CardapioPage from "@/components/CardapioPage";
import { MultiCartProvider } from "@/context/MultiCartContext";
import { loadMenuByBrand } from "@/lib/menu-loader";
import { AgriaoLogo } from "@/components/AgriaoLogo";
import { SwitchMenuButton as PastitaButton } from "@/components/SwitchMenuButton";
import type { Metadata } from "next";

const SITE_URL = "https://pastita.com.br";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agrião",
  alternates: { canonical: `${SITE_URL}/cardapio/agriao` },
  openGraph: {
    title: "Agrião | Cardápio",
    url: `${SITE_URL}/cardapio/agriao`,
  },
  twitter: { title: "Agrião | Cardápio" },
};


export default async function AgriaoPage() {
  const { categories } = await loadMenuByBrand("agriao");
  return (
    <MultiCartProvider>
      <CardapioPage
        theme="agriao"
        categories={categories as any}
        logoComponent={<AgriaoLogo />}
        switchMenuButton={<PastitaButton to="/cardapio/pastita" theme="pastita" />}
        headerColor="bg-green-700/95"
        headerBorderColor="border-green-800"
      />
    </MultiCartProvider>
  );
}
