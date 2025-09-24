// src/lib/menu-loader.ts
import { prisma } from "./prisma";

type LojaKey = "pastita" | "agriao";

export async function loadMenuByBrand(brand: LojaKey) {
  const menu = await prisma.menu.findUnique({
    where: { slug: brand },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
        include: {
          items: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!menu) return { categories: [] as any[] };

  // Mapeia para o shape esperado pelo CardapioPage
  const categories = menu.categories.map((c) => ({
    id: c.slug,             // seu componente usa 'id' como slug
    title: c.title,
    items: c.items.map((it) => ({
      id: it.slug,
      name: it.name,
      description: it.description ?? undefined,
      imageUrl: it.imageUrl ?? undefined,
      // DB guarda centavos -> componente espera number (reais)
      price: it.priceCents / 100,
      tags: it.tags && it.tags.length ? it.tags : undefined,
      loja: brand as const,  // adiciona a loja para o carrinho
    })),
  }));
  console.log("[menu-loader]", brand, "primeiroItem", categories[0]?.items[0]);
  return { categories };
}
