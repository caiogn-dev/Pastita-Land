// lib/events.ts
export type UTM = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export function pushDL(event: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  window.dataLayer.push({ event, ...params });
}

// Mantém compatibilidade com seu código atual
export function track(event: string, params: Record<string, any> = {}) {
  pushDL(event, params);
}
