import Image from 'next/image';
import Link from 'next/link';

export function AgriaoLogo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center"
      prefetch={false}
    >
      <Image 
        src="/agriao-logo.png" // ou .png conforme o arquivo real
        alt="Logo Agriao" 
        width={120}
        height={120}
        className="drop-shadow-md object-contain"
        priority
      />
    </Link>
  );
}