'use client';

import { useEffect, useState } from 'react';
// Função para disparar evento GA4
function sendGAEvent(event: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('event', event, params);
      console.log('[GA4] Evento enviado:', event, params);
    } else {
      console.warn('[GA4] gtag não está disponível no momento do envio:', event, params);
    }
  }
}

// Modal simples para captar celular (versão simplificada e chamativa)
function CupomModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'created' | 'exists' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://n8n-service-wj7k.onrender.com/webhook/gptmaker-pastita-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error('Erro ao enviar.');
      const data = await res.json();
      if (data.status === 'created') {
        setStatus('created');
      } else if (data.status === 'exists') {
        setStatus('exists');
      } else {
        setStatus('error');
      }
      // Aguarda o GA carregar antes de enviar o evento
      setTimeout(() => {
        sendGAEvent('lead_celular_cupom', { phone, status: data.status });
      }, 500);
    } catch (err) {
      setError('Erro ao enviar. Tente novamente.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-zinc-500 hover:text-rose-700 text-xl">×</button>
        {status === 'idle' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl font-extrabold text-rose-700 text-center">10% DE DESCONTO!</h2>
            <p className="text-zinc-700 text-base text-center font-semibold">Registre seu celular e participe da promoção exclusiva de Rondellis Pastita. Você receberá um cupom de desconto no WhatsApp se for elegível.</p>
            <input
              type="tel"
              required
              pattern="\d{10,13}"
              placeholder="Seu celular com DDD"
              className="text-black border-2 border-rose-200 rounded-lg px-3 py-2 text-lg text-center focus:border-rose-500"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              disabled={loading}
            />
            {error && <span className="text-red-600 text-sm">{error}</span>}
            <button
              type="submit"
              className="bg-rose-700 text-white rounded-lg py-2 font-bold hover:bg-rose-800 transition"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Quero Participar!'}
            </button>
          </form>
        )}
        {status === 'created' && (
          <div className="flex flex-col items-center gap-3 py-6">
            <span className="text-4xl">🎉</span>
            <h2 className="text-lg font-bold text-rose-700">Cadastro realizado!</h2>
            <p className="text-zinc-700 text-center">Aguarde: você receberá seu cupom de 10% no WhatsApp.</p>
            <button onClick={onClose} className="mt-4 bg-zinc-200 hover:bg-zinc-300 rounded-lg px-4 py-2">Fechar</button>
          </div>
        )}
        {status === 'exists' && (
          <div className="flex flex-col items-center gap-3 py-6">
            <span className="text-4xl">ℹ️</span>
            <h2 className="text-lg font-bold text-rose-700">Já cadastrado</h2>
            <p className="text-zinc-700 text-center">Esse número já participou da promoção.</p>
            <button onClick={onClose} className="mt-4 bg-zinc-200 hover:bg-zinc-300 rounded-lg px-4 py-2">Fechar</button>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-3 py-6">
            <span className="text-4xl">❌</span>
            <h2 className="text-lg font-bold text-rose-700">Erro</h2>
            <p className="text-zinc-700 text-center">Ocorreu um erro ao enviar. Tente novamente.</p>
            <button onClick={onClose} className="mt-4 bg-zinc-200 hover:bg-zinc-300 rounded-lg px-4 py-2">Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
}
import { PastitaLogo } from '@/components/PastitaLogo';
import { usePathname, useSearchParams } from 'next/navigation';

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

// Link para o cardápio próprio
const menuLinkHero = `/cardapio`;
const menuLinkGrid = `/cardapio`;

export default function HomePageClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Envia page_view para o dataLayer a cada troca de rota (SPA)
  useEffect(() => {
    const page_location = typeof window !== 'undefined' ? window.location.href : '';
    const page_title = typeof document !== 'undefined' ? document.title : '';
    const page_referrer = typeof document !== 'undefined' ? document.referrer : '';

    pushDL('page_view', {
      page_location,
      page_title,
      page_referrer,
    });
  }, [pathname, searchParams]);

  // Eventos opcionais para analytics, se desejar manter
  const onHeroClick = () => {
    pushDL('view_menu_click', {
      destination_url: '/cardapio',
      button_name: 'Ver Cardápio',
    });
    track('cta_click', { button_name: 'Ver Cardápio' });
  };

  const onGridClick = () => {
    pushDL('view_menu_click', {
      destination_url: '/cardapio',
      button_name: 'Ver Cardápio Completo',
    });
    track('cta_click', { button_name: 'Ver Cardápio Completo' });
  };

  const [cupomOpen, setCupomOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="/banner-site.jpg"
          alt="Massa fresca artesanal Pastita com molho cremoso"
          fill
          className="absolute z-0 w-full h-full object-cover"
          priority
        />
  <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center space-y-4 sm:space-y-6">
          {/* Logo centralizada, maior, sem fundo extra */}
          <div className="flex justify-center items-center mb-2">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[180px] sm:max-w-[260px] md:max-w-[340px]">
                <PastitaLogo />
              </div>
            </div>
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter drop-shadow-lg mt-2">
            A massa perfeita, <br />
            <span className="text-accent">agora na sua casa.</span>
          </h1>
          <p className="max-w-[700px] text-base sm:text-lg md:text-xl drop-shadow-sm px-2">
            Ingredientes frescos e receitas deliciosas para uma experiência inesquecível. Peça já e saboreie!
          </p>

          {/* Botão principal → leva para o cardápio próprio */}
          <Button
            type="button"
            size="lg"
            className="bg-rose-700 hover:bg-rose-800 text-white text-lg sm:text-xl font-bold px-8 sm:px-12 py-5 sm:py-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out mb-2"
            onClick={() => setCupomOpen(true)}
          >
            Ganhar Cupom
          </Button>
  {/* Modal do cupom */}
  <CupomModal open={cupomOpen} onClose={() => setCupomOpen(false)} />
          <Button
            asChild
            size="lg"
            onClick={onHeroClick}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg sm:text-xl font-bold px-8 sm:px-12 py-5 sm:py-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <Link href={menuLinkHero}>
              <ShoppingCart className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7" />
              Ver Cardápio
            </Link>
          </Button>
        </div>

      </section>

      <section id="menu" className="w-full py-12 sm:py-20 md:py-32 bg-background">
        <div className="w-full max-w-6xl mx-auto grid items-center justify-center gap-6 px-2 sm:px-4 md:px-6 text-center">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-headline tracking-tighter text-primary">
              Um Pouco do Nosso Sabor
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl/relaxed px-2">
              Explore nossos pratos cuidadosamente preparados para levar a melhor experiência até você.
            </p>
          </div>

          <div className="mx-auto w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 py-8 sm:py-12">
            <Card className="border-secondary hover:border-accent hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="p-0">
                <Image
                  src="https://placehold.co/450x350.png"
                  alt="Rondellis recheados Pastita"
                  data-ai-hint="rondelli food"
                  width={450}
                  height={350}
                  className="w-full h-48 sm:h-56 md:h-64 rounded-t-lg object-cover"
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

          <div className="flex justify-center mt-6 sm:mt-8">
            {/* Botão secundário → leva para o cardápio próprio */}
            <Button
              asChild
              size="lg"
              onClick={onGridClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg font-semibold px-6 sm:px-10 py-5 sm:py-7 rounded-full shadow-md"
            >
              <Link href={menuLinkGrid}>Ver Cardápio Completo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
