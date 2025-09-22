// src/components/CardapioPage.tsx
"use client";

import React, { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { type MenuCategory, type MenuItem } from "@/data/menu";
import { ItemCard } from "@/components/ItemCard";
import { CartModal } from "@/components/CartModal"; // Supondo que foi extraído
import { CategoryPill } from "@/components/CategoryPill"; // Supondo que foi extraído
import { useCart } from "@/context/CartContext";

type CardapioPageProps = {
  theme: "pastita" | "agriao";
  categories: MenuCategory[];
  logoComponent: React.ReactNode;
  switchMenuButton: React.ReactNode;
  headerColor: string;
  headerBorderColor: string;
  headerTextColor: string;
};

export default function CardapioPage({
  theme,
  categories,
  logoComponent,
  switchMenuButton,
  headerColor,
  headerBorderColor,
  headerTextColor,
}: CardapioPageProps) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("todos");
  const [openCart, setOpenCart] = useState(false);
  const { items } = useCart();
  const itemCount = items.reduce((acc, it) => acc + it.qty, 0);

  const flatItems = useMemo(
    () =>
      categories.flatMap((c) =>
        c.items.map((i) => ({ ...i, __cat: c.title, __catId: c.id }))
      ),
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

  return (
    <main className={`min-h-screen bg-gradient-to-b from-${theme === 'pastita' ? 'rose' : 'green'}-50 to-white`}>
      {/* Botões Flutuantes */}
      {/* ... CartButtonFloating e switchMenuButton ... */}
      {switchMenuButton}

      <CartModal open={openCart} onClose={() => setOpenCart(false)} theme={theme} />
      
      {/* Header */}
      <header className={`sticky top-0 z-30 ${headerColor} backdrop-blur border-b ${headerBorderColor} shadow-md`}>
         {/* ... conteúdo do header usando logoComponent e props de cor ... */}
      </header>

      {/* Filtros */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-2 overflow-x-auto py-4">
          <CategoryPill label="Todos" active={activeCat === "todos"} onClick={() => setActiveCat("todos")} theme={theme} />
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              label={c.title}
              active={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
              theme={theme}
            />
          ))}
        </div>
      </div>
      
      {/* Lista de Itens */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {visibleCategories.map((category) => {
           const itemsInCategory = filteredItems.filter(i => i.__catId === category.id);
           if (itemsInCategory.length === 0) return null;

           return (
             <div key={category.id} className="py-6" id={category.id}>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">{category.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {itemsInCategory.map((item) => (
                    <ItemCard key={item.id} item={item as MenuItem} theme={theme} />
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
      
      {/* Footer */}
      {/* ... */}
    </main>
  );
}