export function buildWhatsappUrl({
  phone,            // "5561999999999"
  text,
  utm = { source: 'site', medium: 'whatsapp', campaign: 'pedido', content: 'cart-modal' }
}: {
  phone: string;
  text: string;
  utm?: { source?: string; medium?: string; campaign?: string; content?: string };
}) {
  const base = `https://wa.me/${phone.replace(/\D/g, '')}`;
  const url = new URL(base);
  url.searchParams.set('text', text || 'Olá! Quero fazer um pedido.');
  if (utm.source)   url.searchParams.set('utm_source', utm.source);
  if (utm.medium)   url.searchParams.set('utm_medium', utm.medium);
  if (utm.campaign) url.searchParams.set('utm_campaign', utm.campaign);
  if (utm.content)  url.searchParams.set('utm_content', utm.content);
  return url.toString();
}
