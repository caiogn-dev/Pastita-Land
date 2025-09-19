export const metadata = {
  title: "Pastita | Cardápio",
  description: "Veja o cardápio completo da Pastita Massas.",
};

import CardapioPastita from "@/components/CardapioPastita";
import { CartProvider } from "../../../components/CardapioAgriao";

  export default function Page() {
    return (
      <CartProvider>
        <CardapioPastita />
      </CartProvider>
    );
  }