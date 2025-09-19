import React, { useState } from "react";
import { CATEGORIES } from "@/data/menu";

const sobremesas = [
  { id: "brownie", name: "Brownie", price: 12 },
  { id: "pudim", name: "Pudim", price: 10 },
  { id: "mousse-limao", name: "Mousse de Limão", price: 9 },
];

function getOptionsByCategory(id: string) {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat ? cat.items : [];
}

export default function ComboModal({ open, onClose, onAddCombo }: {
  open: boolean;
  onClose: () => void;
  onAddCombo: (combo: { rondelli: any; molho: any; sobremesa: any }) => void;
}) {
  const [rondelli, setRondelli] = useState("");
  const [molho, setMolho] = useState("");
  const [sobremesa, setSobremesa] = useState("");

  const rondelliOptions = [
    ...getOptionsByCategory("rondellis-classicos"),
    ...getOptionsByCategory("rondellis-gourmet"),
  ];
  const molhoOptions = getOptionsByCategory("molhos");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const selectedRondelli = rondelliOptions.find((r) => r.id === rondelli);
    const selectedMolho = molhoOptions.find((m) => m.id === molho);
    const selectedSobremesa = sobremesas.find((s) => s.id === sobremesa);
    if (selectedRondelli && selectedMolho && selectedSobremesa) {
      onAddCombo({ rondelli: selectedRondelli, molho: selectedMolho, sobremesa: selectedSobremesa });
      onClose();
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md z-10">
        <h2 className="text-xl font-bold mb-4 text-center">Monte seu Combo</h2>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Rondelli</label>
          <select value={rondelli} onChange={e => setRondelli(e.target.value)} className="w-full rounded border p-2">
            <option value="">Selecione...</option>
            {rondelliOptions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Molho</label>
          <select value={molho} onChange={e => setMolho(e.target.value)} className="w-full rounded border p-2">
            <option value="">Selecione...</option>
            {molhoOptions.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Sobremesa</label>
          <select value={sobremesa} onChange={e => setSobremesa(e.target.value)} className="w-full rounded border p-2">
            <option value="">Selecione...</option>
            {sobremesas.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-rose-700 text-white rounded-xl py-2 font-bold mt-2">Adicionar Combo</button>
        <button type="button" onClick={onClose} className="w-full mt-2 text-sm text-zinc-500">Cancelar</button>
      </form>
    </div>
  );
}
