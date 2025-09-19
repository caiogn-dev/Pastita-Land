// lib/ga.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const canSend = () =>
  typeof window !== 'undefined' && typeof window.gtag === 'function' && !!GA_ID;

export const pageview = (url: string) => {
  if (!canSend()) return;
  window.gtag!('event', 'page_view', {
    page_location: url,
    page_title: document.title,
  });
};

type GAEvent = {
  action: string;
  params?: Record<string, any>;
};

export const event = ({ action, params }: GAEvent) => {
  if (!canSend()) return;
  window.gtag!('event', action, params);
};

// (Opcional) consent mode helper
export const updateConsent = (consent: {
  ad_storage?: 'granted' | 'denied';
  analytics_storage?: 'granted' | 'denied';
  ad_user_data?: 'granted' | 'denied';
  ad_personalization?: 'granted' | 'denied';
}) => {
  if (!canSend()) return;
  window.gtag!('consent', 'update', consent);
};
