'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PwaInstallCta } from '@/components/PwaInstallCta';

const menus = [
  {
    name: 'Pastita',
    description: 'Massas artesanais frescas e comidas especiais da Chef Ivoneth',
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
    <main className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 py-16 bg-gradient-to-br from-rose-50 via-green-50 to-yellow-100">
      {/* Banner/Hero */}
      <div className="w-full max-w-4xl mx-auto mb-10 flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-green-900 drop-shadow mb-4 text-center">Monte seu pedido!</h1>
        <p className="text-lg sm:text-2xl text-green-700 text-center mb-6">Escolha entre Pastita ou Agrião e aproveite o melhor da comida artesanal e saudável.</p>
      </div>

      <PwaInstallCta />
      
      {/* Cards dos cardápios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
        {menus.map(menu => (
          <Link href={menu.link} key={menu.name} className="group">
            <Card className="hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer bg-white/90 border-2 border-green-100 animate-fade-in">
              <CardHeader className="flex flex-col items-center gap-2">
                <Image
                  src={menu.image}
                  alt={`Logo ${menu.name}`}
                  width={menu.width}
                  height={menu.height}
                  className="rounded-full mb-2 object-contain shadow-lg transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <CardTitle className="text-3xl font-bold text-green-900 group-hover:text-rose-700 group-hover:underline transition-colors duration-300">{menu.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base sm:text-lg text-green-700 text-center font-medium">{menu.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Botão flutuante WhatsApp */}
      <a
        href="https://wa.me/+5563991386719?text=Olá! Gostaria de fazer um pedido."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center gap-3 px-5 py-3 text-lg font-bold transition-all border-2 border-white animate-bounce-slow"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.75v.008h.008M12 3.75c-4.694 0-8.25 3.556-8.25 8.25 0 1.53.417 2.97 1.21 4.22L3 21l4.03-1.21A8.19 8.19 0 0 0 12 20.25c4.694 0 8.25-3.556 8.25-8.25s-3.556-8.25-8.25-8.25z" />
        </svg>
        Fale Conosco
      </a>
      {/* Animações CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
      `}</style>
    </main>
  );
}