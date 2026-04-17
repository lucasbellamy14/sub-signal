"use client";

/**
 * GenerativeArt — renders unique algorithmic visuals per artist.
 * Pure React/SVG — no external files, no image loading.
 * Seeded from the artist slug so output is deterministic.
 */

// Simple seeded PRNG (mulberry32)
function createRNG(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

interface GenerativeArtProps {
  slug: string;
  index?: number;
  size?: number;
}

export default function GenerativeArt({ slug, index = 0, size = 600 }: GenerativeArtProps) {
  const hash = hashString(slug);
  const rng = createRNG(hash);
  const hue = hash % 360;
  const primary = hslToHex(hue, 85, 55);
  const secondary = hslToHex(hue + 40, 70, 40);
  const style = (index * 3 + ((hash >> 12) & 3)) % 4;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      style={{ display: "block", background: "#0a0a0a" }}
    >
      <rect width={size} height={size} fill="#0a0a0a" />

      {style === 0 && <FlowField rng={rng} primary={primary} secondary={secondary} size={size} />}
      {style === 1 && <ConcentricRings rng={rng} primary={primary} secondary={secondary} size={size} />}
      {style === 2 && <GridScatter rng={rng} primary={primary} secondary={secondary} size={size} />}
      {style === 3 && <Waveform rng={rng} primary={primary} secondary={secondary} size={size} />}

      {/* Vignette */}
      <defs>
        <radialGradient id={`vig-${slug}`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      <rect width={size} height={size} fill={`url(#vig-${slug})`} />

      {/* Card number watermark */}
      <text
        x={20}
        y={size - 16}
        fontFamily="monospace"
        fontSize={size * 0.06}
        fill="white"
        opacity={0.05}
      >
        {String(index + 1).padStart(3, "0")}
      </text>
    </svg>
  );
}

// ── STYLE 0: Flow Field ──
function FlowField({ rng, primary, secondary, size }: { rng: () => number; primary: string; secondary: string; size: number }) {
  const paths: React.ReactNode[] = [];
  const count = 200 + Math.floor(rng() * 150);

  for (let i = 0; i < count; i++) {
    let x = rng() * size;
    let y = rng() * size;
    const opacity = 0.2 + rng() * 0.5;
    const sw = 0.5 + rng() * 2.5;
    const color = i % 20 === 0 ? secondary : primary;
    const steps = 6 + Math.floor(rng() * 8);
    let d = `M${x.toFixed(0)},${y.toFixed(0)}`;

    for (let s = 0; s < steps; s++) {
      const angle =
        Math.sin(x * 0.008 + rng() * 0.01) * Math.PI * 2 +
        Math.cos(y * 0.006) * 1.5;
      x += Math.cos(angle) * 10;
      y += Math.sin(angle) * 10;
      if (x < 0 || x > size || y < 0 || y > size) break;
      d += `L${x.toFixed(0)},${y.toFixed(0)}`;
    }

    paths.push(
      <path
        key={i}
        d={d}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        opacity={opacity}
        strokeLinecap="round"
      />
    );
  }

  return <g>{paths}</g>;
}

// ── STYLE 1: Concentric Rings ──
function ConcentricRings({ rng, primary, secondary, size }: { rng: () => number; primary: string; secondary: string; size: number }) {
  const rings: React.ReactNode[] = [];
  const cx = size / 2 + (rng() - 0.5) * 40;
  const cy = size / 2 + (rng() - 0.5) * 40;
  const count = 20 + Math.floor(rng() * 15);

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const r = t * size * 0.42;
    const color = i % 5 === 0 ? secondary : primary;
    const opacity = i % 5 === 0 ? 0.45 : 0.18 + rng() * 0.12;
    const offsetX = Math.sin(t * 8 + rng()) * (3 + t * 15);
    const offsetY = Math.cos(t * 6 + rng()) * (3 + t * 10);

    rings.push(
      <circle
        key={i}
        cx={cx + offsetX}
        cy={cy + offsetY}
        r={r}
        stroke={color}
        strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
        fill="none"
        opacity={opacity}
      />
    );
  }

  return <g>{rings}</g>;
}

// ── STYLE 2: Grid Scatter ──
function GridScatter({ rng, primary, secondary, size }: { rng: () => number; primary: string; secondary: string; size: number }) {
  const els: React.ReactNode[] = [];
  const gridSize = 16;
  const cellSize = size / gridSize;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (rng() > 0.45) continue;
      const x = col * cellSize + cellSize * 0.15;
      const y = row * cellSize + cellSize * 0.15;
      const w = cellSize * 0.7;
      const opacity = 0.15 + rng() * 0.6;
      const key = `${row}-${col}`;

      if (rng() > 0.3) {
        els.push(<rect key={key} x={x} y={y} width={w} height={w} fill={primary} opacity={opacity} />);
      } else {
        els.push(<circle key={key} cx={x + w / 2} cy={y + w / 2} r={w / 2} fill={primary} opacity={opacity} />);
      }
    }
  }

  // Accent lines
  for (let i = 0; i < 3; i++) {
    els.push(
      <line
        key={`line-${i}`}
        x1={rng() * size}
        y1={rng() * size}
        x2={rng() * size}
        y2={rng() * size}
        stroke={secondary}
        strokeWidth={1.5}
        opacity={0.15}
      />
    );
  }

  return <g>{els}</g>;
}

// ── STYLE 3: Waveform ──
function Waveform({ rng, primary, secondary, size }: { rng: () => number; primary: string; secondary: string; size: number }) {
  const waves: React.ReactNode[] = [];
  const waveCount = 4 + Math.floor(rng() * 3);

  for (let w = 0; w < waveCount; w++) {
    const amp = 30 + rng() * 100;
    const freq = 0.006 + rng() * 0.012;
    const phase = rng() * Math.PI * 2;
    const yOff = size * 0.2 + rng() * size * 0.6;
    const sw = 3 + rng() * 4;
    const opacity = 0.3 + rng() * 0.35;

    const points: string[] = [];
    for (let x = 0; x <= size; x += 6) {
      const y = yOff + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase * 0.7) * (amp * 0.25);
      points.push(`${x},${y.toFixed(0)}`);
    }
    const d = `M${points[0]} ${points.slice(1).map((p) => `L${p}`).join(" ")}`;

    // Glow
    waves.push(<path key={`glow-${w}`} d={d} stroke={primary} strokeWidth={sw * 2.5} fill="none" opacity={opacity * 0.15} strokeLinecap="round" />);
    // Main line
    waves.push(<path key={`wave-${w}`} d={d} stroke={primary} strokeWidth={sw} fill="none" opacity={opacity} strokeLinecap="round" />);
  }

  // Fill area
  const fillAmp = 50 + rng() * 60;
  const fillFreq = 0.008 + rng() * 0.008;
  const fillPhase = rng() * Math.PI * 2;
  const fillY = size * 0.55;
  const fillPts: string[] = [];
  for (let x = 0; x <= size; x += 6) {
    const y = fillY + Math.sin(x * fillFreq + fillPhase) * fillAmp;
    fillPts.push(`${x},${y.toFixed(0)}`);
  }
  const fillD = `M0,${size} ${fillPts.map((p) => `L${p}`).join(" ")} L${size},${size} Z`;
  waves.push(<path key="fill" d={fillD} fill={secondary} opacity={0.08} />);

  return <g>{waves}</g>;
}
