// src/lib/events.ts
export function pushDL(event: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.dataLayer.push({ event, ...params });
}

export function gaEvent(name: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  window.gtag?.('event', name, params);
  pushDL(name, params);
}
