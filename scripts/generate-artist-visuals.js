#!/usr/bin/env node

/**
 * Sub Signal — Algorithmic Artist Visual Generator
 *
 * Generates unique SVG art for each artist, seeded from their slug.
 * Four visual styles: flow field, concentric disruption, grid scatter, waveform.
 * Each artist gets a unique color derived from their name.
 *
 * Run: node scripts/generate-artist-visuals.js
 */

const fs = require("fs");
const path = require("path");

// ── Simple seeded PRNG (mulberry32) ──
function createRNG(seed) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Hash string to number ──
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

// ── HSL to hex ──
function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// ── Simplex-like noise approximation ──
function noise2D(rng, x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + rng() * 0.001) * 43758.5453;
  return n - Math.floor(n);
}

// ── Generate Flow Field SVG ──
function generateFlowField(rng, primary, secondary, size) {
  let paths = "";
  const lineCount = 600 + Math.floor(rng() * 400);

  for (let i = 0; i < lineCount; i++) {
    let x = rng() * size;
    let y = rng() * size;
    const opacity = 0.2 + rng() * 0.5;
    const strokeWidth = 0.5 + rng() * 2;
    const color = i % 30 === 0 ? secondary : primary;
    const actualOpacity = i % 30 === 0 ? 0.6 : opacity;

    let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    const steps = 8 + Math.floor(rng() * 12);

    for (let s = 0; s < steps; s++) {
      const angle =
        noise2D(rng, x * 0.003, y * 0.003) * Math.PI * 4 +
        Math.sin(x * 0.01) * 0.5 +
        Math.cos(y * 0.008) * 0.5;
      x += Math.cos(angle) * 8;
      y += Math.sin(angle) * 8;
      if (x < 0 || x > size || y < 0 || y > size) break;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }

    paths += `<path d="${d}" stroke="${color}" stroke-width="${strokeWidth.toFixed(1)}" fill="none" opacity="${actualOpacity.toFixed(2)}" stroke-linecap="round"/>\n`;
  }

  return paths;
}

// ── Generate Concentric Disruption SVG ──
function generateConcentric(rng, primary, secondary, size) {
  let circles = "";
  const cx = size / 2 + (rng() - 0.5) * 60;
  const cy = size / 2 + (rng() - 0.5) * 60;
  const ringCount = 30 + Math.floor(rng() * 25);
  const maxRadius = size * 0.45;

  for (let i = 0; i < ringCount; i++) {
    const t = i / ringCount;
    const baseRadius = t * maxRadius;
    const color = i % 5 === 0 ? secondary : primary;
    const opacity = i % 5 === 0 ? 0.5 : 0.2 + rng() * 0.15;
    const strokeWidth = i % 5 === 0 ? 1.5 : 0.8;

    // Distort the circle into a wavy path
    const points = [];
    const segments = 72;
    for (let s = 0; s <= segments; s++) {
      const angle = (s / segments) * Math.PI * 2;
      const distortion =
        Math.sin(angle * 3 + rng() * 10) * (8 + rng() * 15) +
        Math.sin(angle * 7 + rng() * 5) * (3 + rng() * 8);
      const r = baseRadius + distortion;
      const offsetX = Math.sin(t * 12 + rng()) * (5 + t * 20);
      const offsetY = Math.cos(t * 8 + rng()) * (5 + t * 15);
      const px = cx + offsetX + Math.cos(angle) * r;
      const py = cy + offsetY + Math.sin(angle) * r;
      points.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
    }

    const d = `M ${points[0]} ` + points.slice(1).map((p) => `L ${p}`).join(" ") + " Z";
    circles += `<path d="${d}" stroke="${color}" stroke-width="${strokeWidth}" fill="none" opacity="${opacity.toFixed(2)}"/>\n`;
  }

  return circles;
}

// ── Generate Grid Scatter SVG ──
function generateGridScatter(rng, primary, secondary, size) {
  let elements = "";
  const gridSize = 18 + Math.floor(rng() * 6);
  const cellSize = size / gridSize;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const chance = rng();
      if (chance > 0.45) continue;

      const x = col * cellSize + cellSize * 0.1;
      const y = row * cellSize + cellSize * 0.1;
      const w = cellSize * 0.8;
      const opacity = 0.15 + rng() * 0.65;

      if (rng() > 0.3) {
        // Rectangle
        elements += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${w.toFixed(1)}" fill="${primary}" opacity="${opacity.toFixed(2)}"/>\n`;
      } else {
        // Circle
        const cr = w / 2;
        elements += `<circle cx="${(x + cr).toFixed(1)}" cy="${(y + cr).toFixed(1)}" r="${cr.toFixed(1)}" fill="${primary}" opacity="${opacity.toFixed(2)}"/>\n`;
      }
    }
  }

  // Diagonal accent lines
  const lineCount = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < lineCount; i++) {
    const x1 = rng() * size;
    const y1 = rng() * size;
    const x2 = x1 + (rng() - 0.5) * size * 0.8;
    const y2 = y1 + (rng() - 0.5) * size * 0.8;
    elements += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${secondary}" stroke-width="1.5" opacity="0.15"/>\n`;
  }

  return elements;
}

// ── Generate Waveform SVG ──
function generateWaveform(rng, primary, secondary, size) {
  let waves = "";
  const waveCount = 5 + Math.floor(rng() * 4);

  for (let w = 0; w < waveCount; w++) {
    const amplitude = 40 + rng() * 120;
    const frequency = 0.005 + rng() * 0.015;
    const phase = rng() * Math.PI * 2;
    const yOffset = size * 0.2 + rng() * size * 0.6;
    const strokeWidth = 3 + rng() * 5;
    const opacity = 0.3 + rng() * 0.4;

    const points = [];
    for (let x = 0; x <= size; x += 4) {
      const y =
        yOffset +
        Math.sin(x * frequency + phase) * amplitude +
        Math.sin(x * frequency * 2.5 + phase * 0.7) * (amplitude * 0.3);
      points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    const d = `M ${points[0]} ` + points.slice(1).map((p) => `L ${p}`).join(" ");

    // Glow layer
    waves += `<path d="${d}" stroke="${primary}" stroke-width="${(strokeWidth * 2.5).toFixed(1)}" fill="none" opacity="${(opacity * 0.15).toFixed(2)}" stroke-linecap="round"/>\n`;
    // Main line
    waves += `<path d="${d}" stroke="${primary}" stroke-width="${strokeWidth.toFixed(1)}" fill="none" opacity="${opacity.toFixed(2)}" stroke-linecap="round"/>\n`;
  }

  // Fill area under the last wave
  const fillAmplitude = 60 + rng() * 80;
  const fillFreq = 0.008 + rng() * 0.01;
  const fillPhase = rng() * Math.PI * 2;
  const fillY = size * 0.55;
  const fillPoints = [];
  for (let x = 0; x <= size; x += 4) {
    const y = fillY + Math.sin(x * fillFreq + fillPhase) * fillAmplitude;
    fillPoints.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const fillD =
    `M 0 ${size} ` +
    fillPoints.map((p) => `L ${p}`).join(" ") +
    ` L ${size} ${size} Z`;
  waves += `<path d="${fillD}" fill="${secondary}" opacity="0.08"/>\n`;

  return waves;
}

// ── Build full SVG ──
function generateArtistSVG(slug, index) {
  const hash = hashString(slug);
  const rng = createRNG(hash);
  const size = 1200;

  // Derive unique colors
  const hue = hash % 360;
  const primary = hslToHex(hue, 85, 55);
  const secondary = hslToHex(hue + 40, 70, 40);

  // Pick style — ensure all 4 styles get used across the artist set
  const style = (index * 3 + ((hash >> 12) & 3)) % 4;
  let artContent;
  switch (style) {
    case 0:
      artContent = generateFlowField(rng, primary, secondary, size);
      break;
    case 1:
      artContent = generateConcentric(rng, primary, secondary, size);
      break;
    case 2:
      artContent = generateGridScatter(rng, primary, secondary, size);
      break;
    case 3:
      artContent = generateWaveform(rng, primary, secondary, size);
      break;
  }

  // Card number
  const cardNum = String(index + 1).padStart(3, "0");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#0a0a0a"/>

  <!-- Generative Art -->
  <g>
    ${artContent}
  </g>

  <!-- Vignette -->
  <defs>
    <radialGradient id="vignette-${slug}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(10,10,10,0.7)"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#vignette-${slug})"/>

  <!-- Card number watermark -->
  <text x="40" y="${size - 30}" font-family="monospace" font-size="48" fill="rgba(255,255,255,0.06)">${cardNum}</text>
</svg>`;
}

// ── Main ──
function main() {
  // Read artist slugs from the data file
  const dataPath = path.join(__dirname, "..", "src", "data", "artists.ts");
  const dataContent = fs.readFileSync(dataPath, "utf8");

  // Extract slugs using regex
  const slugMatches = [...dataContent.matchAll(/slug:\s*"([^"]+)"/g)];
  const slugs = slugMatches.map((m) => m[1]);

  if (slugs.length === 0) {
    console.error("No artist slugs found in artists.ts");
    process.exit(1);
  }

  // Ensure output directory
  const outDir = path.join(__dirname, "..", "public", "images", "artists");
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Generating visuals for ${slugs.length} artists...\n`);

  slugs.forEach((slug, i) => {
    const svg = generateArtistSVG(slug, i);
    const filePath = path.join(outDir, `${slug}.svg`);
    fs.writeFileSync(filePath, svg);
    console.log(`  ✓ ${slug}.svg (style ${hashString(slug) % 4})`);
  });

  console.log(`\nDone! ${slugs.length} SVG files in public/images/artists/`);
}

main();
