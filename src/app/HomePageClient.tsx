'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const menus = [
  {
    name: 'Pastita',
    description: 'Massas artesanais frescas e molhos especiais.',
    image: '/pastita-logo.png',
    link: '/cardapio/pastita', // Novo padrão de rota
    width: 200,
    height: 100,
  },
  {
    name: 'Agrião',
    description: 'Comida saudável, natural e saborosa.',
    image: '/agriao-logo2.png',
    link: '/cardapio/agriao', // Novo padrão de rota
    width: 200,
    height: 100,
  },
];

export default function HomePageClient() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4 py-16">
      <h1 className="text-3xl sm:text-5xl font-bold mb-10 text-center">Escolha seu cardápio</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
        {menus.map(menu => (
          <Link href={menu.link} key={menu.name} className="group">
            <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <CardHeader className="flex flex-col items-center gap-2">
                <Image
                  src={menu.image}
                  alt={`Logo ${menu.name}`}
                  width={menu.width}
                  height={menu.height}
                  className="rounded-full mb-2 object-contain"
                  priority
                />
                <CardTitle className="text-2xl text-accent group-hover:underline">{menu.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground text-center">{menu.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}