import { Twitter, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { PastitaLogo } from './PastitaLogo';

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="flex flex-col items-center gap-2">
        <div className="text-primary">
          <PastitaLogo />
        </div>
        <p className="text-xs text-muted-foreground">&copy; 2024 Pastita. Todos os direitos reservados.</p>
      </div>
      <nav className="flex justify-center w-full gap-6 mt-2">
        <Link
          href="https://www.facebook.com/pastita.agriao/"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
          prefetch={false}
          aria-label="Facebook"
        >
          <Facebook className="h-5 w-5" />
        </Link>
        <Link
          href="https://www.instagram.com/pastita.agriao/"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
          prefetch={false}
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </Link>
      </nav>
    </footer>
  );
}
