import { PastitaLogo } from '@/components/PastitaLogo';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-20 flex items-center absolute top-0 left-0 right-0 z-50 bg-transparent text-white">
      <div className="text-primary">
        <PastitaLogo />
      </div>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Button asChild className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
          <Link href="https://pedido.anota.ai/loja/pastita-massas" target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Peça Agora
          </Link>
        </Button>
         <Button asChild variant="outline" size="icon" className="sm:hidden bg-transparent border-white/50 hover:bg-white/10">
           <Link href="https://pedido.anota.ai/loja/pastita-massas" target="_blank" rel="noopener noreferrer" aria-label="Abrir Menu">
              <Menu className="h-5 w-5" />
           </Link>
        </Button>
      </nav>
    </header>
  );
}
