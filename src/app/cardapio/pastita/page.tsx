// src/app/cardapio/pastita/page.tsx
import CardapioPage from "@/components/CardapioPage";
import { CartProvider } from "@/context/CartContext";
import { CATEGORIES as pastitaData } from "@/data/menu";
import { PastitaLogo } from "@/components/PastitaLogo";
import { SwitchMenuButton as AgriaoButton } from "@/components/SwitchMenuButton";

// Adicionamos a propriedade 'loja' a cada item do menu
const pastitaMenu = pastitaData.map(category => ({
  ...category,
  items: category.items.map(item => ({ ...item, loja: 'pastita' as const }))
}));

export default function PastitaPage() {
  return (
    <CartProvider>
      <CardapioPage
        theme="pastita"
        categories={pastitaMenu}
        logoComponent={<PastitaLogo />}
        switchMenuButton={<AgriaoButton to="/cardapio/agriao" theme="agriao" />}
        headerColor="bg-rose-700/95"
        headerBorderColor="border-rose-800"
      />
    </CartProvider>
  );
}