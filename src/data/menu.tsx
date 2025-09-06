// Imagem placeholder global para os itens do menu
export const PLACEHOLDER = "https://placehold.co/450x350.png";

// Exporte um array de categorias de menu
export const CATEGORIES = [
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
];

