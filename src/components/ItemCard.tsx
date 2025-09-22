// src/components/ItemCard.tsx
import Image from "next/image";
import { type MenuItem, PLACEHOLDER } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

type ItemCardProps = {
  item: MenuItem;
  theme: "pastita" | "agriao";
};

export function ItemCard({ item, theme }: ItemCardProps) {
  const cart = useCart();

  const themeClasses = {
    pastita: {
      price: "text-rose-600",
      tagBg: "bg-rose-50",
      tagText: "text-rose-700",
      tagBorder: "border-rose-100",
      buttonBorder: "border-rose-600",
      buttonBg: "bg-rose-600",
      buttonText: "text-white",
      buttonHoverBg: "hover:bg-white",
      buttonHoverText: "hover:text-rose-700",
      buttonHoverBorder: "hover:border-rose-700",
      focusRing: "focus-visible:ring-rose-300",
    },
    agriao: {
      price: "text-green-800",
      tagBg: "bg-green-50",
      tagText: "text-green-700",
      tagBorder: "border-green-100",
      buttonBorder: "border-green-600",
      buttonBg: "bg-green-600",
      buttonText: "text-white",
      buttonHoverBg: "hover:bg-green-700",
      buttonHoverText: "hover:text-white",
      buttonHoverBorder: "hover:border-green-700",
      focusRing: "focus-visible:ring-green-300",
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

        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className={cn("text-xs px-2 py-1 rounded-full border", classes.tagBg, classes.tagText, classes.tagBorder)}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3">
          <button
            className={cn(
              "w-full h-11 rounded-xl border-2 active:translate-y-[1px] transition font-semibold tracking-tight focus:outline-none focus-visible:ring-2",
              classes.buttonBorder, classes.buttonBg, classes.buttonText,
              classes.buttonHoverBg, classes.buttonHoverText, classes.buttonHoverBorder,
              classes.focusRing
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