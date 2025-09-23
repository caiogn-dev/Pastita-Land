// menu.tsx

// Imagem placeholder global para os itens do menu
export const PLACEHOLDER = "https://placehold.co/450x350.png";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  tags?: string[];
};

export type MenuCategory = {
  id: string;
  title: string;
  items: MenuItem[];
};

// Cardápio no estilo pedido (ex.: AGRIÃO Comida Saudável)
export const CATEGORIES: MenuCategory[] = [
  {
    id: "linha-fit",
    title: "Linha Fit",
    items: [
      {
        id: "escondidinho-abobora-frango",
        name: "Escondidinho de Abóbora com Frango",
        price: 18.0,
        description: "Purê de abóbora cabotiá com frango desfiado leve.",
        imageUrl: "/images/agriao/EscondidinhoAbobora.webp",
      },
      {
        id: "macarrao-almondegas-legumes",
        name: "Macarrão com Almôndegas e Legumes",
        price: 18.0,
        description: "Almôndegas ao molho da casa, penne e brócolis.",
        imageUrl: PLACEHOLDER, // sem correspondente gerado
      },
      {
        id: "strogonoff-frango-batata-arroz",
        name: "Strogonoff de Frango c/ Batata Rústica e Arroz",
        price: 18.0,
        description: "Clássico em versão leve e saborosa.",
        imageUrl: "/images/agriao/strogonoffFrango.webp",
      },
      {
        id: "brasileirissimo",
        name: "Brasileiríssimo",
        price: 18.0,
        description: "Patinho moído, arroz, feijão, cenoura e brócolis.",
        imageUrl: "/images/agriao/brasileirissimo.webp",
        tags: ["clássico"],
      },
      {
        id: "frango-cubos-creme-milho-arroz",
        name: "Frango em Cubos c/ Creme de Milho e Arroz",
        price: 18.0,
        description: "Frango grelhado, creme de milho leve e arroz.",
        imageUrl: "/images/agriao/cubosFrango-arroz.webp", // aproximação
      },
      {
        id: "frango-grelhado-arroz-pure",
        name: "Frango Grelhado c/ Arroz e Purê de Batata",
        price: 18.0,
        description: "Filezinho grelhado com acompanhamentos.",
        imageUrl: "/images/agriao/grelhadoFrango-pure.webp",
      },
      {
        id: "tiras-frango-espaguete-cenoura",
        name: "Tirinhas de Frango c/ Espaguete de Cenoura",
        price: 18.0,
        description: "Baixo carbo, alto sabor.",
        imageUrl: "/images/agriao/tirinhaFrango-arroz.webp", // aproximação
        tags: ["low carb"],
      },
    ],
  },
  {
    id: "gourmet-fit",
    title: "Gourmet Fit",
    items: [
      {
        id: "strogonoff-file-mignon",
        name: "Strogonoff de Filé Mignon",
        price: 20.0,
        description: "Versão saudável do clássico com mignon selecionado.",
        imageUrl: PLACEHOLDER, // sem correspondente gerado
        tags: ["carne"],
      },
      {
        id: "file-tilapia-tomate-confitado",
        name: "Filé de Tilápia c/ Tomate Confitado",
        price: 20.0,
        description: "Acompanha arroz integral e cenoura.",
        imageUrl: "/images/agriao/Tilapia-Tomate.webp",
        tags: ["peixe"],
      },
      {
        id: "baiao-de-dois-fit",
        name: "Baião de Dois Fit",
        price: 20.0,
        description: "Arroz branco, feijão vermelho, carne desfiada, queijo.",
        imageUrl: PLACEHOLDER, // sem correspondente gerado
      },
    ],
  },
  {
    id: "combos",
    title: "Combos Promocionais",
    items: [
      {
        id: "combo-fit-5",
        name: "Combo Fit (5 unid.)",
        price: 80.0,
        description: "Unidade sai por R$ 16. Sabores variados.",
        imageUrl: PLACEHOLDER, // sem correspondente gerado
        tags: ["combo"],
      },
      {
        id: "combo-gourmet-3",
        name: "Combo Gourmet (3 unid.)",
        price: 54.0,
        description: "Unidade sai por R$ 18. Sabores variados.",
        imageUrl: PLACEHOLDER, // sem correspondente gerado
        tags: ["combo"],
      },
    ],
  },
];
