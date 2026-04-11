/**
 * Generates a placeholder image URL using a simple SVG data URI.
 * This is used when we don't have a real photo for an artist yet.
 * The image shows the artist's initials on a dark gradient background.
 */
export function getPlaceholderImage(name: string): string {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a2e"/>
        <stop offset="100%" style="stop-color:#0a0a14"/>
      </linearGradient>
    </defs>
    <rect width="600" height="800" fill="url(#g)"/>
    <text x="300" y="420" font-family="sans-serif" font-size="120" font-weight="bold" fill="#00e5a030" text-anchor="middle">${initials}</text>
    <text x="300" y="520" font-family="monospace" font-size="14" fill="#8888a060" text-anchor="middle">${name}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
