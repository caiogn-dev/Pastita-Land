'use client';

import Script from 'next/script';

const ID_FROM_ENV = process.env.NEXT_PUBLIC_GA_ID; // injetado no build

export default function Ga({ gaId }: { gaId?: string }) {
  const id = gaId || ID_FROM_ENV; // fallback para a env

  if (!id) {
    if (typeof window !== 'undefined') {
      console.warn('[GA] NEXT_PUBLIC_GA_ID ausente. Verifique .env.local e reinicie o servidor.');
    }
    return null;
  }

  return (
    <>
      {/* Consent default (LGPD) */}
      <Script id="consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
        `}
      </Script>

      {/* GA4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-setup" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', {
            debug_mode: ${process.env.NODE_ENV !== 'production'}
          });
        `}
      </Script>
    </>
  );
}
