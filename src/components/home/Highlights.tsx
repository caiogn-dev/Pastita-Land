import { UtensilsCrossed, Leaf, Truck } from "lucide-react";

const feats = [
  { icon: UtensilsCrossed, title: "Feito na cozinha da Chef", text: "Qualidade artesanal de verdade." },
  { icon: Leaf,            title: "Opções saudáveis",          text: "Sem frescura e muito sabor." },
  { icon: Truck,           title: "Entrega ágil em Palmas",    text: "Combine entrega no WhatsApp." },
];

export default function Highlights() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {feats.map((f) => (
        <div key={f.title} className="rounded-2xl bg-white/80 border p-5 flex gap-3">
          <f.icon className="h-6 w-6 text-green-700" />
          <div>
            <p className="font-semibold text-green-900">{f.title}</p>
            <p className="text-sm text-green-800/90">{f.text}</p>
          </div>
        </div>
      ))}
      <div className="rounded-2xl bg-white/80 border p-5">
        <p className="font-semibold text-green-900">Horários</p>
        <p className="text-sm text-green-800/90">Seg–Sáb 10h–20h • Dom 10h–14h</p>
      </div>
    </div>
  );
}
