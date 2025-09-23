// src/components/CardapioPage.tsx
"use client";

import React, { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { type MenuCategory, type MenuItem } from "@/data/menu";
import { useCart } from "@/context/MultiCartContext"; // ATUALIZADO
import { cn } from "@/lib/utils";
import { ItemCard } from "@/components/ItemCard";
import { CartModal } from "@/components/CartModal";
import { CategoryPill } from "@/components/CategoryPill";
import ComboModal from "@/components/ComboModal";

// --- Componente do Botão Flutuante do Carrinho (sem alterações) ---
function CartButtonFloating({ onClick, itemCount, theme }: { onClick: () => void; itemCount: number; theme: "pastita" | "agriao" }) {
  const themeClasses = {
    pastita: {
      buttonBg: "bg-rose-700",
      buttonHoverBg: "hover:bg-rose-800",
      focusRing: "focus-visible:ring-rose-300",
      countText: "text-rose-700",
    },
    agriao: {
      buttonBg: "bg-green-700",
      buttonHoverBg: "hover:bg-green-800",
      focusRing: "focus-visible:ring-green-300",
      countText: "text-green-700",
    },
  };
  const classes = themeClasses[theme];

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-50 bottom-6 right-6 sm:bottom-8 sm:right-8 text-white rounded-full shadow-lg flex items-center gap-2 px-5 py-3 text-lg font-semibold transition-all border-2 border-white focus:outline-none focus-visible:ring-2",
        classes.buttonBg,
        classes.buttonHoverBg,
        classes.focusRing
      )}
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="w-6 h-6 mr-2" />
      <span>Carrinho</span>
      {itemCount > 0 && (
        <span className={cn(
          "ml-2 bg-white rounded-full px-2 py-0.5 text-xs font-bold min-w-[24px] text-center",
          classes.countText
        )}>
          {itemCount}
        </span>
      )}
    </button>
  );
}

// --- Tipos para as Props ---
type LojaKey = 'pastita' | 'agriao';
type ItemComLoja = MenuItem & { loja: LojaKey };
type CategoriaComLoja = MenuCategory & { items: ItemComLoja[] };

type CardapioPageProps = {
  theme: LojaKey;
  categories: CategoriaComLoja[];
  logoComponent: React.ReactNode;
  switchMenuButton: React.ReactNode;
  headerColor: string;
  headerBorderColor: string;
};

// --- Componente Principal da Página ---
export default function CardapioPage({
  theme,
  categories,
  logoComponent,
  switchMenuButton,
  headerColor,
  headerBorderColor,
}: CardapioPageProps) {
  // ATUALIZADO: O hook agora pega o carrinho correto (pastita ou agriao)
  const { items, add } = useCart(theme);
  
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("todos");
  const [openCart, setOpenCart] = useState(false);
  const [openCombo, setOpenCombo] = useState(false);

  const itemCount = items.reduce((acc, it) => acc + it.qty, 0);

  const flatItems = useMemo(
    () => categories.flatMap((c) => c.items.map((i) => ({ ...i, __cat: c.title, __catId: c.id }))),
    [categories]
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flatItems.filter((i) => {
      const matchText = `${i.name} ${i.description ?? ""} ${i.tags?.join(" ") ?? ""} ${i.__cat}`.toLowerCase();
      const matchQuery = !q || matchText.includes(q);
      const matchCat = activeCat === "todos" || i.__catId === activeCat;
      return matchQuery && matchCat;
    });
  }, [flatItems, query, activeCat]);

  const visibleCategories = useMemo(
    () => (activeCat === "todos" ? categories : categories.filter((c) => c.id === activeCat)),
    [categories, activeCat]
  );
  
  const handleAddCombo = (combo: { rondelli: any; molho: any; sobremesa: any }) => {
    const comboItem = {
      id: `combo-${combo.rondelli.id}-${combo.molho.id}-${combo.sobremesa.id}`,
      name: `Combo: ${combo.rondelli.name} + ${combo.molho.name} + ${combo.sobremesa.name}`,
      price: Number(combo.rondelli.price || 0) + Number(combo.molho.price || 0) + Number(combo.sobremesa.price || 0),
      imageUrl: combo.rondelli.imageUrl,
      tags: ["combo"],
      loja: 'pastita' as const,
    };
    add(comboItem);
  };

  return (
    <main className={`min-h-screen bg-gradient-to-b from-${theme === 'pastita' ? 'rose' : 'green'}-50 to-white`}>
      <CartButtonFloating onClick={() => setOpenCart(true)} itemCount={itemCount} theme={theme} />
      {switchMenuButton}

      {theme === 'pastita' && (
        <>
          <div className="fixed z-40 bottom-24 right-6 sm:right-8">
            <button
              onClick={() => setOpenCombo(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg px-6 py-3 font-bold text-base border-2 border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              Montar Combo
            </button>
          </div>
          <ComboModal open={openCombo} onClose={() => setOpenCombo(false)} onAddCombo={handleAddCombo} />
        </>
      )}

      <CartModal open={openCart} onClose={() => setOpenCart(false)} theme={theme} />
      
      <header className={cn("sticky top-0 z-30 backdrop-blur border-b shadow-md", headerColor, headerBorderColor)}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-auto">{logoComponent}</div>
              <div className="ml-2">
                <h1 className="text-lg font-semibold text-white drop-shadow">Cardápio</h1>
                <p className={`text-xs ${theme === 'pastita' ? 'text-rose-100/90' : 'text-green-200'}`}>
                  Escolha seus pratos favoritos e monte seu pedido!
                </p>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <input
                type="search"
                placeholder="Buscar no cardápio..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`w-full h-11 rounded-xl border bg-white/95 px-3 text-sm focus:outline-none focus:ring-2 ${theme === 'pastita' ? 'border-rose-200 focus:ring-rose-200' : 'border-green-200 focus:ring-green-200'}`}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-2 overflow-x-auto py-4">
          <CategoryPill label="Todos" active={activeCat === "todos"} onClick={() => setActiveCat("todos")} theme={theme} />
          {categories.map((c) => (
            <CategoryPill key={c.id} label={c.title} active={activeCat === c.id} onClick={() => setActiveCat(c.id)} theme={theme} />
          ))}
        </div>
      </div>
      
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {visibleCategories.map((category) => {
           const itemsInCategory = filteredItems.filter(i => i.__catId === category.id);
           if (itemsInCategory.length === 0) return null;

           return (
             <div key={category.id} className="py-6" id={category.id}>
                <div className="flex items-baseline justify-between mb-4">
                    <h2 className={`text-xl font-semibold ${theme === 'pastita' ? 'text-zinc-900' : 'text-green-900'}`}>{category.title}</h2>
                    <a href={`#${category.id}`} className={`text-sm ${theme === 'pastita' ? 'text-rose-700' : 'text-green-700'} hover:underline`}>
                        Ir para seção
                    </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {itemsInCategory.map((item) => (
                    <ItemCard key={item.id} item={item} theme={theme} />
                  ))}
                </div>
             </div>
           );
        })}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-zinc-600">
            Nenhum item encontrado para "{query}".
          </div>
        )}
      </section>
      
      <footer className={cn("border-t", theme === 'pastita' ? 'border-zinc-200' : 'border-green-200', "bg-white/70")}>
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} {theme === 'pastita' ? 'Pastita Massas' : 'Agrião Marmitas'} — Todos os direitos reservados.</p>
            <a href="/" className={cn("hover:underline", theme === 'pastita' ? 'text-rose-700' : 'text-green-700')}>
              Voltar ao início
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}