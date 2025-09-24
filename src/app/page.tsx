// app/page.tsx
import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import MenuGrid from "@/components/home/MenuGrid";
import Highlights from "@/components/home/Highlights";

export const metadata: Metadata = {
  title: "Pastita & Agrião — Comida artesanal e saudável em Palmas",
  description: "Massas artesanais e marmitas saudáveis. Peça Pastita ou Agrião. Entrega em Palmas-TO.",
  alternates: { canonical: "https://pastita.com.br" },
  openGraph: { title: "Pastita & Agrião — Comida artesanal e saudável em Palmas", url: "https://pastita.com.br" },
  twitter: { title: "Pastita & Agrião" },
};

export default function Page() {
  return (
    <main className="min-h-[100svh] bg-gradient-to-br from-rose-50 via-green-50 to-amber-50">
      <HomeHero />
      <section className="mx-auto max-w-5xl px-4">
        <MenuGrid />
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Highlights />
      </section>

      {/* JSON-LD simples pra SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Pastita & Agrião",
            url: "https://pastita.com.br",
            servesCuisine: ["Italiana", "Saudável"],
            address: { "@type": "PostalAddress", addressLocality: "Palmas", addressRegion: "TO", addressCountry: "BR" },
          }),
        }}
      />
    </main>
  );
}
