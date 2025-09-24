// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

// 🔰 importa seus arrays existentes (sem usar alias @)
import { CATEGORIES as pastitaCategories } from "../src/data/menu";
import { CATEGORIES as agriaoCategories } from "../src/data/menu.updated";

const db = new PrismaClient();

type LocalItem = {
  id: string;
  name: string;
  price: number; // em reais
  description?: string;
  imageUrl?: string;
  tags?: string[];
};

type LocalCategory = {
  id: string;       // usamos como slug
  title: string;
  items: LocalItem[];
};

function toCents(v: number) {
  return Math.round(v * 100);
}

async function upsertMenu(name: string, slug: "pastita" | "agriao", categories: LocalCategory[]) {
  const menu = await db.menu.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });

  for (const cat of categories) {
    const category = await db.menuCategory.upsert({
      // requer @@unique([menuId, slug]) no schema
      where: { menuId_slug: { menuId: menu.id, slug: cat.id } },
      update: { title: cat.title },
      create: {
        menuId: menu.id,
        title: cat.title,
        slug: cat.id,
        sortOrder: 0,
      },
    });

    for (const it of cat.items) {
      await db.menuItem.upsert({
        // requer @@unique([categoryId, slug]) no schema
        where: { categoryId_slug: { categoryId: category.id, slug: it.id } },
        update: {
          name: it.name,
          description: it.description ?? null,
          imageUrl: it.imageUrl ?? null,
          priceCents: toCents(it.price),
          tags: it.tags ?? [],
          isActive: true,
        },
        create: {
          categoryId: category.id,
          name: it.name,
          slug: it.id,
          description: it.description ?? null,
          imageUrl: it.imageUrl ?? null,
          priceCents: toCents(it.price),
          tags: it.tags ?? [],
          isActive: true,
          sortOrder: 0,
        },
      });
    }
  }
}

async function main() {
  console.log("🌱 Seeding Pastita…");
  await upsertMenu("Pastita", "pastita", pastitaCategories as LocalCategory[]);

  console.log("🌱 Seeding Agrião…");
  await upsertMenu("Agrião", "agriao", agriaoCategories as LocalCategory[]);

  console.log("✅ Seed finalizado.");
}

main()
  .catch((e) => {
    console.error("❌ Seed falhou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
