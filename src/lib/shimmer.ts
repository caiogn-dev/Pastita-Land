// pequeno util pra gerar um blur base64 com cor do tema
export function shimmer(color = "#e6f4ea") {
  const svg = `
  <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g">
        <stop stop-color="${color}" offset="20%" />
        <stop stop-color="#ffffff" offset="50%" />
        <stop stop-color="${color}" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="120" height="80" fill="${color}" />
    <rect id="r" width="120" height="80" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-120" to="120" dur="1.2s" repeatCount="indefinite"  />
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
