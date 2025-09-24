// src/app/cardapio/pastita/page.tsx
import CardapioPage from "@/components/CardapioPage";
import { MultiCartProvider } from "@/context/MultiCartContext";
import { loadMenuByBrand } from "@/lib/menu-loader";
import { PastitaLogo } from "@/components/PastitaLogo";
import { SwitchMenuButton as AgriaoButton } from "@/components/SwitchMenuButton";

export const dynamic = "force-dynamic";

export default async function PastitaPage() {
  const { categories } = await loadMenuByBrand("pastita");
  return (
    <MultiCartProvider>
      <CardapioPage
        theme="pastita"
        categories={categories as any}
        logoComponent={<PastitaLogo />}
        switchMenuButton={<AgriaoButton to="/cardapio/agriao" theme="agriao" />}
        headerColor="bg-rose-700/95"
        headerBorderColor="border-rose-800"
      />
    </MultiCartProvider>
  );
}
