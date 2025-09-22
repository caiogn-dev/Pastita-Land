// src/app/cardapio/agriao/page.tsx
import CardapioPage from "@/components/CardapioPage";
import { CartProvider } from "@/context/CartContext";
import { CATEGORIES as agriaoMenu } from "@/data/menu-agriao"; // menu de agriao
import { AgriaoLogo } from "@/components/AgriaoLogo";
import { SwitchMenuButton as PastitaButton } from "@/components/SwitchMenuButton";

export default function AgriaoPage() {
  return (
    <CartProvider>
      <CardapioPage
        theme="agriao"
        categories={agriaoMenu}
        logoComponent={<AgriaoLogo />}
        switchMenuButton={<PastitaButton to="/cardapio/pastita" theme="pastita" />}
        headerColor="bg-green-700/95"
        headerBorderColor="border-green-800"
        headerTextColor="text-white"
      />
    </CartProvider>
  );
}