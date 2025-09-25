// src/components/ItemCard.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { type MenuItem, PLACEHOLDER } from "@/data/menu";
import { useCart } from "@/context/MultiCartContext";
import { cn } from "@/lib/utils";
import { shimmer } from "@/lib/shimmer";
// (opcional) se quiser mapear dimensões conhecidas sem mexer no DB:
import { agriaoImages } from "@/data/images.agriao"; // [{src,width,height}]

type LojaKey = "pastita" | "agriao";
type ItemWithOptDims = MenuItem & { loja: LojaKey; imageWidth?: number; imageHeight?: number };

function findDimsBySrc(src?: string) {
  if (!src) return null;
  const hit = agriaoImages.find(i => i.src === src);
  return hit ? { w: hit.width, h: hit.height } : null;
}

export function ItemCard({ item, theme, priority = false }: { item: ItemWithOptDims; theme: LojaKey; priority?: boolean; }) {
  const cart = useCart(theme);
  const [imgError, setImgError] = useState(false);

  const src = useMemo(() => {
    const raw = (item.imageUrl ?? "").trim();
    return imgError ? PLACEHOLDER : (raw || PLACEHOLDER);
  }, [item.imageUrl, imgError]);

  // 1) tenta usar dimensões vindas do banco
  // 2) senão, tenta achar em agriaoImages
  // 3) fallback para 4/3
  const { w, h } = useMemo(() => {
    if (item.imageWidth && item.imageHeight) return { w: item.imageWidth, h: item.imageHeight };
    const fromMap = findDimsBySrc(item.imageUrl);
    if (fromMap) return { w: fromMap.w, h: fromMap.h };
    return { w: 4, h: 3 }; // fallback
  }, [item.imageWidth, item.imageHeight, item.imageUrl]);

  const blurDataURL = useMemo(
    () => shimmer(theme === "agriao" ? "#e6f4ea" : "#fde2e7"),
    [theme]
  );

  const themeColors = theme === "agriao"
    ? { price: "text-green-800", bg: "bg-green-50", btnBorder: "border-green-600", btnBg: "bg-green-600", btnText: "text-white", btnHoverBg: "hover:bg-green-700", btnHoverText: "hover:text-white" }
    : { price: "text-rose-600",  bg: "bg-rose-50",  btnBorder: "border-rose-600",  btnBg: "bg-rose-600",  btnText: "text-white", btnHoverBg: "hover:bg-white",       btnHoverText: "hover:text-rose-700" };

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200/70 shadow-sm bg-white">
      {/* Container com proporção EXATA da imagem */}
      <div
        className={cn("relative w-full overflow-hidden rounded-xl", themeColors.bg)}
        style={{ aspectRatio: `${w} / ${h}` }} // <-- magia aqui
      >
        <Image
          src={src}
          alt={item.name}
          fill
          className="object-contain"       // sem crop, sem zoom
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
          onError={() => !imgError && setImgError(true)}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-zinc-900 leading-tight">{item.name}</h3>
          <span className={cn("font-semibold whitespace-nowrap", themeColors.price)}>
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
              themeColors.btnBorder, themeColors.btnBg, themeColors.btnText,
              themeColors.btnHoverBg, themeColors.btnHoverText
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
