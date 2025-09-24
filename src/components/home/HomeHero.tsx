"use client";

import Link from "next/link";
import { PwaInstallCta } from "@/components/PwaInstallCta";

export default function HomeHero() {
  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="mx-auto max-w-4xl text-center space-y-5 animate-[fade-in_.8s_ease both]">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border px-3 py-1 text-xs text-zinc-700">
          <span className="h-2 w-2 rounded-full bg-green-600" /> entrega em Palmas-TO
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-green-900">
          Monte seu pedido <span className="text-rose-700">&nbsp;agora</span>
        </h1>
        <p className="text-lg sm:text-2xl text-green-800/90">
          Escolha <b>Pastita</b> (massas artesanais) ou <b>Agrião</b> (comida saudável) — tudo feito pela Chef Ivoneth.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/cardapio/pastita" className="h-11 px-5 rounded-xl bg-rose-700 text-white font-semibold shadow hover:bg-rose-800 focus-visible:ring-2 focus-visible:ring-rose-300">
            Ver cardápio Pastita
          </Link>
          <Link href="/cardapio/agriao" className="h-11 px-5 rounded-xl bg-green-700 text-white font-semibold shadow hover:bg-green-800 focus-visible:ring-2 focus-visible:ring-green-300">
            Ver cardápio Agrião
          </Link>
        </div>
        <div className="pt-2">
          <PwaInstallCta />
        </div>
      </div>

      {/* WhatsApp fixo */}
      <a
        href="https://wa.me/+5563991386719?text=Olá! Gostaria de fazer um pedido."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center gap-3 px-5 py-3 text-lg font-bold border-2 border-white"
        aria-label="Fale conosco no WhatsApp"
      >
        WhatsApp
      </a>
    </div>
  );
}
