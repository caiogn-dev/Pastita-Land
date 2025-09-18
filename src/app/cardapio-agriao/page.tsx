
import CardapioAgriao, { CartProvider } from '../../components/CardapioAgriao';

export default function CardapioAgriaoPage() {
  return (
    <CartProvider>
      <CardapioAgriao />
    </CartProvider>
  );
}
