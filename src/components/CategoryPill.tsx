// src/components/CategoryPill.tsx
"use client";

import { cn } from "@/lib/utils";

type CategoryPillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  theme: "pastita" | "agriao";
};

export function CategoryPill({ label, active, onClick, theme }: CategoryPillProps) {
  const themeClasses = {
    pastita: {
      activeBg: "bg-rose-700",
      activeBorder: "border-rose-700",
    },
    agriao: {
      activeBg: "bg-green-700",
      activeBorder: "border-green-700",
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full px-4 py-2 text-sm transition border",
        active
          ? `${currentTheme.activeBg} text-white ${currentTheme.activeBorder} shadow-sm`
          : "bg-white/90 hover:bg-white border-zinc-200 text-zinc-700"
      )}
    >
      {label}
    </button>
  );
}