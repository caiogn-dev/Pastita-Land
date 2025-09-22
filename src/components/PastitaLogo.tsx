// src/components/PastitaLogo.tsx
import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  isLink?: boolean;
};

export function PastitaLogo({ isLink = true }: LogoProps) {
  const logoImage = (
    <Image 
      src="/Logo-site.png"
      alt="Logo Pastita" 
      width={100}
      height={32}
      className="drop-shadow-md h-8 w-auto max-w-[100px]"
      priority
    />
  );

  if (!isLink) {
    return logoImage;
  }

  return (
    <Link href="/" className="flex items-center justify-center" prefetch={false}>
      {logoImage}
    </Link>
  );
}