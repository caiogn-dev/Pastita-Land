'use client';
import Ga from './Ga';
import { useEffect } from 'react';

export default function GaClient({ gaId }: { gaId: string | undefined }) {
  // Força renderização client-side
  useEffect(() => {}, []);
  return <Ga gaId={gaId} />;
}
