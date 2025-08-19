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
        width={150} // Ajuste para a largura real da sua imagem
        height={50}  // Ajuste para a altura real da sua imagem
        className="drop-shadow-md"
      />
    </Link>
  );
}