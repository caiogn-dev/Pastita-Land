'use client';
import Script from 'next/script';

const ID_FROM_ENV = process.env.NEXT_PUBLIC_GA_ID;

export default function Ga({ gaId }: { gaId?: string }) {
  const id = gaId || ID_FROM_ENV;
  if (!id) {
    if (typeof window !== 'undefined') {
      console.warn('[GA] NEXT_PUBLIC_GA_ID ausente. Verifique .env.local e reinicie o servidor.');
    }
    return null;
  }

  return (
    <>
      {/* GA4 apenas */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-setup" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { debug_mode: ${process.env.NODE_ENV !== 'production'} });
        `}
      </Script>
    </>
  );
}
