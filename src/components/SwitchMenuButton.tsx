// src/components/SwitchMenuButton.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AgriaoLogo } from "./AgriaoLogo";
import { PastitaLogo } from "./PastitaLogo";

type SwitchMenuButtonProps = {
  to: string;
  theme: "pastita" | "agriao";
};

export function SwitchMenuButton({ to, theme }: SwitchMenuButtonProps) {
  const isPastita = theme === "pastita";

  const themeClasses = {
    pastita: "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-300",
    agriao: "bg-green-600 hover:bg-green-700 focus-visible:ring-green-300",
  };

  return (
    <Link
      href={to}
      className={cn(
        "fixed bottom-8 left-6 sm:left-8 z-50 text-white rounded-full shadow-xl flex items-center gap-2 px-5 py-3 text-lg font-semibold transition-all border-2 border-white animate-bounce-slow focus:outline-none focus-visible:ring-2",
        themeClasses[theme]
      )}
      aria-label={`Ir para o cardápio ${isPastita ? "Pastita" : "Agrião"}`}
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
    >
      {/* Aqui está a correção: passamos isLink={false} */}
      {isPastita ? <PastitaLogo isLink={false} /> : <AgriaoLogo isLink={false} />}
      
      <span className="hidden sm:inline">
        {isPastita ? "Pastita" : "Agrião"}
      </span>
    </Link>
  );
}