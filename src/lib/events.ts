
'use client';

declare global {
  interface Window {
    gtag: (
      command: 'event',
      action: string,
      params: { [key: string]: string | number | undefined }
    ) => void;
  }
}

export const track = (
  action: string,
  params: { [key: string]: string | number | undefined }
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  } else {
    console.warn(`gtag not found. Event "${action}" not tracked.`, params);
  }
};
