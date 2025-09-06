import Image from 'next/image';
import Link from 'next/link';


export function PastitaLogo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center"
      prefetch={false}
    >
      <Image 
        src="/Logo-site.png"
        alt="Logo Pastita" 
        width={100} // Ajuste para a largura ideal da navbar
        height={32}  // Ajuste para a altura ideal da navbar
        className="drop-shadow-md h-8 w-auto max-w-[100px]"
        priority
      />
    </Link>
  );
}