import Link from 'next/link';

export function PastitaLogo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center"
      prefetch={false}
    >
      <span className="font-headline text-3xl font-bold drop-shadow-md">Pastita</span>
    </Link>
  );
}
