// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const toCents = (v) => Math.round(v * 100);
const PLACEHOLDER = "https://placehold.co/450x350.png";

/**
 * Mapa de imagens por item (slug) e marca.
 * Se existir no mapa, o seed grava no banco.
 * Se não existir, usa o imageUrl do cardápio (ou PLACEHOLDER).
 */
const IMAGE_MAP = {
  agriao: {
    "escondidinho-abobora-frango": "/images/agriao/EscondidinhoAbobora.webp",
    "macarrao-almondegas-legumes": null, // sem correspondente -> fallback
    "strogonoff-frango-batata-arroz": "/images/agriao/strogonoffFrango.webp",
    "brasileirissimo": "/images/agriao/brasileirissimo.webp",
    "frango-cubos-creme-milho-arroz": "/images/agriao/cubosFrango-arroz.webp",
    "frango-grelhado-arroz-pure": "/images/agriao/grelhadoFrango-pure.webp",
    "tiras-frango-espaguete-cenoura": "/images/agriao/tirinhaFrango-arroz.webp",

    // gourmet
    "strogonoff-file-mignon": null,
    "file-tilapia-tomate-confitado": "/images/agriao/Tilapia-Tomate.webp",
    "baiao-de-dois-fit": null,
  },
  pastita: {
    // Se já tiver imagens da Pastita, mapeie aqui, ex.:
    // "linguica-toscana": "/images/pastita/linguica-toscana.webp",
  },
};

// ===== AGRIÃO =====
const AGRIAO = {
  name: "Agrião Comida Saudável",
  slug: "agriao",
  categories: [
    {
      id: "linha-fit",
      title: "Linha Fit",
      items: [
        { id: "escondidinho-abobora-frango", name: "Escondidinho de Abóbora com Frango", price: 18.0, description: "Purê de abóbora cabotiá com frango desfiado leve.", imageUrl: PLACEHOLDER },
        { id: "macarrao-almondegas-legumes", name: "Macarrão com Almôndegas e Legumes", price: 18.0, description: "Almôndegas ao molho da casa, penne e brócolis.", imageUrl: PLACEHOLDER },
        { id: "strogonoff-frango-batata-arroz", name: "Strogonoff de Frango c/ Batata Rústica e Arroz", price: 18.0, description: "Clássico em versão leve e saborosa.", imageUrl: PLACEHOLDER },
        { id: "brasileirissimo", name: "Brasileiríssimo", price: 18.0, description: "Patinho moído, arroz, feijão, cenoura e brócolis.", imageUrl: PLACEHOLDER, tags: ["clássico"] },
        { id: "frango-cubos-creme-milho-arroz", name: "Frango em Cubos c/ Creme de Milho e Arroz", price: 18.0, description: "Frango grelhado, creme de milho leve e arroz.", imageUrl: PLACEHOLDER },
        { id: "frango-grelhado-arroz-pure", name: "Frango Grelhado c/ Arroz e Purê de Batata", price: 18.0, description: "Filezinho grelhado com acompanhamentos.", imageUrl: PLACEHOLDER },
        { id: "tiras-frango-espaguete-cenoura", name: "Tirinhas de Frango c/ Espaguete de Cenoura", price: 18.0, description: "Baixo carbo, alto sabor.", imageUrl: PLACEHOLDER, tags: ["low carb"] },
      ],
    },
    {
      id: "gourmet-fit",
      title: "Gourmet Fit",
      items: [
        { id: "strogonoff-file-mignon", name: "Strogonoff de Filé Mignon", price: 20.0, description: "Versão saudável do clássico com mignon selecionado.", imageUrl: PLACEHOLDER, tags: ["carne"] },
        { id: "file-tilapia-tomate-confitado", name: "Filé de Tilápia c/ Tomate Confitado", price: 20.0, description: "Acompanha arroz integral e cenoura.", imageUrl: PLACEHOLDER, tags: ["peixe"] },
        { id: "baiao-de-dois-fit", name: "Baião de Dois Fit", price: 20.0, description: "Arroz branco, feijão vermelho, carne desfiada, queijo.", imageUrl: PLACEHOLDER },
      ],
    },
    {
      id: "combos",
      title: "Combos Promocionais",
      items: [
        { id: "combo-fit-5", name: "Combo Fit (5 unid.)", price: 80.0, description: "Unidade sai por R$ 16. Sabores variados.", imageUrl: PLACEHOLDER, tags: ["combo"] },
        { id: "combo-gourmet-3", name: "Combo Gourmet (3 unid.)", price: 54.0, description: "Unidade sai por R$ 18. Sabores variados.", imageUrl: PLACEHOLDER, tags: ["combo"] },
      ],
    },
  ],
};

// ===== PASTITA =====
const PASTITA = {
  name: "Pastita Massas",
  slug: "pastita",
  categories: [
    {
      id: "rondellis-classicos",
      title: "Rondellis Clássicos",
      items: [
        { id: "linguica-toscana", name: "Linguiça Toscana", price: 39.0, description: "Linguiça artesanal toscana.", imageUrl: PLACEHOLDER },
        { id: "frango-cremoso", name: "Frango Cremoso", price: 39.0, description: "Frango desfiado com ervas frescas.", imageUrl: PLACEHOLDER },
        { id: "tomate-seco-rucula", name: "Tomate Seco com Rúcula", price: 39.0, description: "Tomate seco e rúcula.", imageUrl: PLACEHOLDER },
        { id: "queijo-brocolis", name: "Queijo e Brócolis", price: 39.0, description: "Muçarela, ricota, creme…", imageUrl: PLACEHOLDER },
        { id: "palmito", name: "Palmito", price: 39.0, description: "Palmito com ervas frescas.", imageUrl: PLACEHOLDER },
        { id: "lombo-canadense", name: "Lombo Canadense", price: 39.0, description: "Lombo canadense e ervas.", imageUrl: PLACEHOLDER },
      ],
    },
    {
      id: "rondellis-gourmet",
      title: "Rondellis Gourmet",
      items: [
        { id: "bacalhau-cremoso", name: "Bacalhau Cremoso", price: 35.0, description: "Bacalhau cremoso.", imageUrl: PLACEHOLDER, tags: ["peixe"] },
        { id: "brie-damasco-castanha", name: "Queijo Brie, Damasco e Castanha", price: 46.0, description: "Brie com damasco e castanhas.", imageUrl: PLACEHOLDER, tags: ["queijo", "frutas"] },
      ],
    },
    {
      id: "molhos",
      title: "Molhos",
      items: [
        { id: "molho-branco", name: "Molho Branco (Bechamel)", price: 16.9, description: "Clássico, suave e cremoso.", imageUrl: PLACEHOLDER },
        { id: "molho-sugo", name: "Molho Sugo", price: 22.99, description: "Tomate fresco refogado com cebola, alho e…", imageUrl: PLACEHOLDER, tags: ["mais pedido"] },
        { id: "file-vinho", name: "Filé ao Molho Vinho", price: 32.9, description: "Filé mignon ao molho encorpado de vinho tinto.", imageUrl: PLACEHOLDER },
      ],
    },
    {
      id: "kits",
      title: "Kits",
      items: [
        { id: "kit-familia", name: "Kit Família", price: 93.9, description: "Seleção especial para a família.", imageUrl: PLACEHOLDER, tags: ["combo"] },
        { id: "kit-casal", name: "Kit Casal", price: 89.9, description: "Rondelli c/ molho branco (6 unid.) + acompanhamentos.", imageUrl: PLACEHOLDER, tags: ["combo"] },
      ],
    },
    {
      id: "canelone",
      title: "Canelone",
      items: [
        { id: "canelone-frango", name: "Canelone de Frango", price: 39.0, description: "Canelone recheado com frango desfiado e ervas.", imageUrl: PLACEHOLDER },
      ],
    },
    {
      id: "nhocao",
      title: "Nhocão",
      items: [
        { id: "nhocao-batata-recheado", name: "Nhocão de batata recheado", price: 39.0, description: "Batata com queijo muçarela.", imageUrl: PLACEHOLDER },
      ],
    },
  ],
};

function overrideImage(brand, slug, currentUrl) {
  const mapped = IMAGE_MAP[brand]?.[slug];
  if (mapped === null) return currentUrl ?? PLACEHOLDER; // explicitamente sem imagem mapeada
  if (typeof mapped === "string" && mapped.length > 0) return mapped;
  return currentUrl ?? PLACEHOLDER;
}

async function upsertMenu(full) {
  const menu = await prisma.menu.upsert({
    where: { slug: full.slug },
    update: { name: full.name },
    create: { name: full.name, slug: full.slug },
    select: { id: true },
  });

  for (let cIndex = 0; cIndex < full.categories.length; cIndex++) {
    const c = full.categories[cIndex];

    const cat = await prisma.menuCategory.upsert({
      where: { menuId_slug: { menuId: menu.id, slug: c.id } },
      update: { title: c.title, sortOrder: cIndex },
      create: {
        title: c.title,
        slug: c.id,
        sortOrder: cIndex,
        menuId: menu.id,
      },
      select: { id: true },
    });

    for (let iIndex = 0; iIndex < c.items.length; iIndex++) {
      const it = c.items[iIndex];
      const imageUrl = overrideImage(full.slug, it.id, it.imageUrl);

      await prisma.menuItem.upsert({
        where: { categoryId_slug: { categoryId: cat.id, slug: it.id } },
        update: {
          name: it.name,
          description: it.description ?? null,
          imageUrl,
          priceCents: toCents(it.price),
          tags: it.tags ?? [],
          isActive: true,
          sortOrder: iIndex,
        },
        create: {
          name: it.name,
          slug: it.id,
          description: it.description ?? null,
          imageUrl,
          priceCents: toCents(it.price),
          tags: it.tags ?? [],
          isActive: true,
          sortOrder: iIndex,
          categoryId: cat.id,
        },
      });
    }
  }
}

async function main() {
  console.log("[seed] upserting menus...");
  await upsertMenu(AGRIAO);
  await upsertMenu(PASTITA);
  console.log("[seed] done!");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
