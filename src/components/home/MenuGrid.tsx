import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const menus = [
  { name: "Pastita", desc: "Massas artesanais & especiais", img: "/pastita-logo.png", href: "/cardapio/pastita" },
  { name: "Agrião",  desc: "Comida saudável e natural",   img: "/agriao-logo2.png", href: "/cardapio/agriao"  },
];

export default function MenuGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {menus.map((m) => (
        <Link key={m.name} href={m.href} className="group">
          <Card className="bg-white/90 border-2 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-col items-center gap-3">
              <Image
                src={m.img}
                alt={m.name}
                width={200}
                height={100}
                className="rounded-full shadow group-hover:scale-105 transition-transform duration-500 object-contain"
                priority
              />
              <CardTitle className="text-2xl text-green-900 group-hover:text-rose-700 transition-colors">
                {m.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-green-700">{m.desc}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
