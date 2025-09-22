// src/components/PwaInstallCta.tsx
"use client";

import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export const PwaInstallCta = () => {
  const { canInstall, handleInstall } = usePWAInstall();

  if (!canInstall) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-fade-in">
      <div className="bg-gradient-to-r from-rose-100 to-green-100 p-6 rounded-2xl shadow-lg border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full shadow">
            <Download className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-green-900">Instale nosso App!</h3>
            <p className="text-sm text-green-800">Acesso rápido e fácil aos nossos cardápios direto do seu celular.</p>
          </div>
        </div>
        <Button 
          onClick={handleInstall}
          className="bg-green-700 hover:bg-green-800 text-white font-bold w-full sm:w-auto flex-shrink-0"
        >
          Instalar
        </Button>
      </div>
    </div>
  );
};