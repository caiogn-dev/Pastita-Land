'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { pushDL, track } from '@/lib/events';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Use a rota server-side para registrar o clique no GA4 via Measurement Protocol
// Ajuste as UTMs conforme preferir
const menuLinkHero = `/r/cardapio?utm_source=site&utm_medium=hero&utm_campaign=cardapio`;
const menuLinkGrid = `/r/cardapio?utm_source=site&utm_medium=menu_grid&utm_campaign=cardapio`;

export default function HomePageClient() {
  const onHeroClick = () => {
    // dispara evento de clique no botão principal antes do redirect
    pushDL('view_menu_click', {
      destination_url: process.env.NEXT_PUBLIC_MENU_DEST,
      utm_source: 'site',
      utm_medium: 'hero',
      utm_campaign: 'cardapio',
      button_name: 'Peça Agora no Anota.ai Hero',
    });

    // mantém seu evento custom existente (compatível)
    track('cta_click', { button_name: 'Peça Agora no Anota.ai Hero' });
  };

  const onGridClick = () => {
    pushDL('view_menu_click', {
      destination_url: process.env.NEXT_PUBLIC_MENU_DEST,
      utm_source: 'site',
      utm_medium: 'menu_grid',
      utm_campaign: 'cardapio',
      button_name: 'Ver Cardápio Completo',
    });

    track('cta_click', { button_name: 'Ver Cardápio Completo' });
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="/banner-site.jpg"
          alt="Massa fresca artesanal Pastita com molho cremoso"
          fill
          className="absolute z-0 w-full h-full object-cover"
          priority
        />
        <div className="relative z-20 container px-4 md:px-6 flex flex-col items-center space-y-6">
          <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl drop-shadow-lg">
            A massa perfeita, <br />
            <span className="text-accent">agora na sua casa.</span>
          </h1>
          <p className="max-w-[700px] text-lg md:text-xl drop-shadow-sm">
            Ingredientes frescos e receitas deliciosas para uma experiência inesquecível. Peça já e saboreie!
          </p>

          {/* Botão principal → usa /r/cardapio com UTMs do hero */}
          <Button
            asChild
            size="lg"
            onClick={onHeroClick}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold px-12 py-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <Link href={menuLinkHero}>
              <ShoppingCart className="mr-3 h-7 w-7" />
              Peça Agora no Anota.ai
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <Link href="#menu">
            <div className="flex flex-col items-center text-white/80 hover:text-white transition-all duration-300">
              <span className="text-sm font-medium tracking-wide">Ver Cardápio</span>
              <ChevronDown className="h-6 w-6 mt-1" />
            </div>
          </Link>
        </div>
      </section>

      <section id="menu" className="w-full py-20 md:py-32 bg-background">
        <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-headline tracking-tighter md:text-5xl text-primary">
              Um Pouco do Nosso Sabor
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Explore nossos pratos cuidadosamente preparados para levar a melhor experiência até você.
            </p>
          </div>

          <div className="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <Card className="border-secondary hover:border-accent hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="p-0">
                <Image
                  src="https://placehold.co/450x350.png"
                  alt="Rondellis recheados Pastita"
                  data-ai-hint="rondelli food"
                  width={450}
                  height={350}
                  className="w-full h-auto rounded-t-lg object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-2xl text-accent">Rondelli's</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Deliciosos rondellis recheados com os melhores e mais frescos ingredientes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-secondary hover:border-accent hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="p-0">
                <Image
                  src="https://placehold.co/450x350.png"
                  alt="Iscas de carne suculentas"
                  data-ai-hint="beef strips"
                  width={450}
                  height={350}
                  className="w-full h-auto rounded-t-lg object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-2xl text-accent">Iscas de Carne</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Saborosas e suculentas iscas de carne para acompanhar sua massa preferida.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-secondary hover:border-accent hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="p-0">
                <Image
                  src="https://placehold.co/450x350.png"
                  alt="Molhos artesanais Pastita"
                  data-ai-hint="sauce bottle"
                  width={450}
                  height={350}
                  className="w-full h-auto rounded-t-lg object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-2xl text-accent">Molhos Artesanais</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Nossa variedade de molhos artesanais para complementar e enriquecer seu prato.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            {/* Botão secundário → também via /r/cardapio com outras UTMs */}
            <Button
              asChild
              size="lg"
              onClick={onGridClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold px-10 py-7 rounded-full shadow-md"
            >
              <Link href={menuLinkGrid}>
                Ver Cardápio Completo e Peça Já
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
