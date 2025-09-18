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
        src="/agriao-logo2.png"
        alt="Logo Agriao" 
        width={100}
        height={32}
        className="drop-shadow-md h-8 w-auto max-w-[100px]"
        priority
      />
    </Link>
  );
}