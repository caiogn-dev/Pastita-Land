import CartWhatsappCTA from '@/components/CartWhatsappCTA';
import { gaEvent } from '@/lib/events';
import { cartToGa4Items } from '@/lib/cartMessage';

// ... dentro do JSX do modal:
<footer className="mt-4 space-y-3">
  {/* Resumo de valores... */}
  {/* Botão principal */}
  <CartWhatsappCTA
    loja="pastita"                // ou "agriao" nessa página
    phone="5561999999999"        // número real da loja
    className="h-12"
  />
  {/* Botão secundário (ex.: continuar comprando) */}
  {/* <button ...>Continuar comprando</button> */}
</footer>
