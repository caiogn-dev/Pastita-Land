// src/app/cardapio/pastita/page.tsx
import { MultiCartProvider } from "@/context/MultiCartContext";
import CardapioPage from "@/components/CardapioPage";
import { CATEGORIES as pastitaData } from "@/data/menu";
import { PastitaLogo } from "@/components/PastitaLogo";
import { SwitchMenuButton as AgriaoButton } from "@/components/SwitchMenuButton";

// Importa e exporta os metadados do arquivo separado
export { metadata } from './metadata';

// Adiciona a propriedade 'loja' a cada item do menu
const pastitaMenu = pastitaData.map(category => ({
  ...category,
  items: category.items.map(item => ({ ...item, loja: 'pastita' as const }))
}));

export default function PastitaPage() {
  return (
    <MultiCartProvider>
      <CardapioPage
        theme="pastita"
        categories={pastitaMenu}
        logoComponent={<PastitaLogo />}
        switchMenuButton={<AgriaoButton to="/cardapio/agriao" theme="agriao" />}
        headerColor="bg-rose-700/95"
        headerBorderColor="border-rose-800"
      />
    </MultiCartProvider>
  );
}