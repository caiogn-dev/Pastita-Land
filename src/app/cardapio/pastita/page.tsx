// src/app/cardapio/pastita/page.tsx
import CardapioPage from "@/components/CardapioPage";
import { CartProvider } from "@/context/CartContext";
import { CATEGORIES as pastitaMenu } from "@/data/menu"; // menu de pastita
import { PastitaLogo } from "@/components/PastitaLogo";
import { SwitchMenuButton as AgriaoButton } from "@/components/SwitchMenuButton"; // Renomeado para clareza

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
        headerTextColor="text-white"
      />
    </CartProvider>
  );
}