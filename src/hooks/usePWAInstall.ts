// src/hooks/usePWAInstall.ts
"use client";

import { useState, useEffect } from 'react';

// Interface para o evento, para garantir a tipagem
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Impede o pop-up automático
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    await installPrompt.prompt(); // Mostra o pop-up de instalação
    
    // Opcional: Analisa o resultado
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação do PWA');
    }
    setInstallPrompt(null); // Limpa o prompt, ele só pode ser usado uma vez
  };

  return { canInstall: !!installPrompt, handleInstall };
};