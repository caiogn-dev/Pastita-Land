export const metadata = {
  title: "Agrião | Cardápio",
  description: "Veja o cardápio completo da Agrião Marmitas.",
};

import CardapioAgriao, { CartProvider } from '../../../components/CardapioAgriao';

export default function CardapioAgriaoPage() {
  return (
    <CartProvider>
      <CardapioAgriao />
    </CartProvider>
  );
}
