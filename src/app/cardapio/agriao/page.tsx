// src/app/cardapio/agriao/page.tsx
import CardapioPage from "@/components/CardapioPage";
import { CartProvider } from "@/context/CartContext";
import { CATEGORIES as agriaoData } from "@/data/menu.updated"; // Usando o menu correto
import { AgriaoLogo } from "@/components/AgriaoLogo";
import { SwitchMenuButton as PastitaButton } from "@/components/SwitchMenuButton";

// Adicionamos a propriedade 'loja' a cada item do menu
const agriaoMenu = agriaoData.map(category => ({
  ...category,
  items: category.items.map(item => ({ ...item, loja: 'agriao' as const }))
}));

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
      />
    </CartProvider>
  );
}