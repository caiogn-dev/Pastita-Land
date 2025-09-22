// src/components/CategoryPill.tsx
"use client";

import { cn } from "@/lib/utils";

type CategoryPillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  theme: "pastita" | "agriao";
};

/**
 * Componente de botão (pill) para filtrar categorias no cardápio.
 * Adapta seu estilo com base no tema fornecido.
 *
 * @param {string} label - O texto a ser exibido no botão.
 * @param {boolean} [active=false] - Se o botão está no estado ativo.
 * @param {function} [onClick] - A função a ser executada ao clicar.
 * @param {'pastita' | 'agriao'} theme - O tema de cores a ser aplicado.
 */
export function CategoryPill({ label, active, onClick, theme }: CategoryPillProps) {
  // Mapeamento de classes de estilo por tema
  const themeClasses = {
    pastita: {
      activeBg: "bg-rose-700",
      activeText: "text-white",
      activeBorder: "border-rose-700",
      focusRing: "focus-visible:ring-rose-300",
    },
    agriao: {
      activeBg: "bg-green-700",
      activeText: "text-white",
      activeBorder: "border-green-700",
      focusRing: "focus-visible:ring-green-300",
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full px-4 py-2 text-sm transition border focus:outline-none focus-visible:ring-2",
        currentTheme.focusRing,
        active
          ? `${currentTheme.activeBg} ${currentTheme.activeText} ${currentTheme.activeBorder} shadow-sm`
          : "bg-white/90 hover:bg-white border-zinc-200 text-zinc-700"
      )}
    >
      {label}
    </button>
  );
}