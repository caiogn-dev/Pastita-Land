// src/components/ItemCard.tsx
"use client";

import Image from "next/image";
import { type MenuItem, PLACEHOLDER } from "@/data/menu";
import { useCart } from "@/context/MultiCartContext"; // CORRIGIDO: Importa do novo contexto
import { cn } from "@/lib/utils";

type LojaKey = "pastita" | "agriao";

type ItemCardProps = {
  item: MenuItem & { loja: LojaKey }; // CORRIGIDO: O item agora tem a propriedade 'loja'
  theme: LojaKey;
};

export function ItemCard({ item, theme }: ItemCardProps) {
  // CORRIGIDO: Passa o 'theme' para o hook pegar o carrinho correto
  const cart = useCart(theme);

  const themeClasses = {
    pastita: {
      price: "text-rose-600",
      buttonBorder: "border-rose-600",
      buttonBg: "bg-rose-600",
      buttonText: "text-white",
      buttonHoverBg: "hover:bg-white",
      buttonHoverText: "hover:text-rose-700",
    },
    agriao: {
      price: "text-green-800",
      buttonBorder: "border-green-600",
      buttonBg: "bg-green-600",
      buttonText: "text-white",
      buttonHoverBg: "hover:bg-green-700",
      buttonHoverText: "hover:text-white",
    },
  };

  const classes = themeClasses[theme];

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200/70 shadow-sm bg-white">
      <div className="aspect-[4/3] w-full bg-zinc-100">
        <Image
          src={item.imageUrl || PLACEHOLDER}
          alt={item.name}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-zinc-900 leading-tight">{item.name}</h3>
          <span className={cn("font-semibold", classes.price)}>
            {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>
        {item.description && (
          <p className="mt-1.5 mb-2.5 text-sm text-zinc-600 line-clamp-3">{item.description}</p>
        )}
        <div className="mt-3">
          <button
            className={cn(
              "w-full h-11 rounded-xl border-2 active:translate-y-[1px] transition font-semibold",
              classes.buttonBorder, classes.buttonBg, classes.buttonText,
              classes.buttonHoverBg, classes.buttonHoverText
            )}
            onClick={() => cart.add(item)}
            aria-label={`Adicionar ${item.name} ao carrinho`}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}