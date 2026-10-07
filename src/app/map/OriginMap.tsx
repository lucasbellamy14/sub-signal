"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ArtistImage from "@/components/ArtistImage";
import { PlayArtistButton } from "@/components/PlayButtons";
import { ARTISTS } from "@/data/artists";
import { MAP_H, MAP_W, ORIGINS, VIEWS, WORLD_PATH } from "@/data/origins";

type Box = { x: number; y: number; w: number; h: number };

type Group = {
  key: string;
  x: number;
  y: number;
  precision: "city" | "region";
  label: string;
  slugs: string[];
};

const GREEN = "#39ff5a";

/** The view rectangle for a named region, shaped to the map's current aspect ratio. */
function viewFor(name: string, aspect: number): Box {
  const [x, y, w, h] = VIEWS[name];
  const pad = name === "World" ? 1 : 1.25;
  let bw = w * pad;
  let bh = h * pad;
  if (bw / bh < aspect) bw = bh * aspect;
  else bh = bw / aspect;
  const cx = x + w / 2;
  const cy = y + h / 2;
  return { x: cx - bw / 2, y: cy - bh / 2, w: bw, h: bh };
}

const VIEW_NAMES = Object.keys(VIEWS);

/** Little stem joining the photo bubble to its pin. */
function Pointer({ dir, offset }: { dir: "up" | "down"; offset: number }) {
  return (
    <div
      style={{
        width: 0,
        height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        [dir === "down" ? "borderTop" : "borderBottom"]: `8px solid ${GREEN}`,
        transform: `translateX(${offset}px)`,
        marginTop: dir === "down" ? -6 : 0,
        marginBottom: dir === "up" ? -6 : 0,
      }}
    />
  );
}

export default function OriginMap({ compact = false }: { compact?: boolean }) {
  const bySlug = useMemo(() => new Map(ARTISTS.map((a) => [a.slug, a])), []);

  // Only plot artists that are currently published.
  const groups = useMemo<Group[]>(() => {
    const m = new Map<string, Group & { labels: string[] }>();
    for (const o of ORIGINS) {
      if (!bySlug.has(o.slug)) continue;
      const key = `${o.precision}:${o.x},${o.y}`;
      const g = m.get(key) ?? { key, x: o.x, y: o.y, precision: o.precision, label: "", slugs: [], labels: [] };
      g.slugs.push(o.slug);
      g.labels.push(o.label);
      m.set(key, g);
    }
    return Array.from(m.values()).map(({ labels, ...g }) => {
      // Name the group by its most common label (shortest on a tie).
      const counts = new Map<string, number>();
      labels.forEach((l: string) => counts.set(l, (counts.get(l) ?? 0) + 1));
      const label = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)[0][0];
      return { ...g, label };
    });
  }, [bySlug]);

  const placed = groups.reduce((n, g) => n + g.slugs.length, 0);
  const places = groups.filter((g) => g.precision === "city").length;

  const [view, setView] = useState("World");
  // Taller map on phones so pins are big enough to tap.
  const [aspect, setAspect] = useState(MAP_W / MAP_H);
  const [box, setBox] = useState<Box>({ x: 0, y: 0, w: MAP_W, h: MAP_H });
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);
  const boxRef = useRef(box);
  boxRef.current = box;

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setAspect(mq.matches ? 4 / 3 : MAP_W / MAP_H);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Track the map's on-screen size so the photo bubble can be placed over a pin.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Re-shape the current view when the aspect ratio changes (no animation).
  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setBox(viewFor(view, aspect));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect]);

  const goTo = (name: string) => {
    setView(name);
    const target = viewFor(name, aspect);
    if (raf.current) cancelAnimationFrame(raf.current);
    const from = boxRef.current;
    if (document.hidden) { setBox(target); return; }
    const start = performance.now();
    const dur = 650;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setBox({
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        w: from.w + (target.w - from.w) * e,
        h: from.h + (target.h - from.h) * e,
      });
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const s = box.w / MAP_W; // keeps pins the same on-screen size at every zoom
  const sel = groups.find((g) => g.key === selected) ?? null;
  const bubbleGroup = groups.find((g) => g.key === (hover ?? selected)) ?? null;

  const chip = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-display)",
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.45rem 1rem",
    cursor: "pointer",
    fontWeight: 700,
    border: "1px solid",
    transition: "all 150ms ease",
    background: active ? GREEN : "transparent",
    color: active ? "#0a0a0a" : "#b0b0b0",
    borderColor: active ? GREEN : "#222",
  });

  const pick = (g: Group) => setSelected((cur) => (cur === g.key ? null : g.key));
  const hoverProps = (g: Group) => ({
    onMouseEnter: () => setHover(g.key),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(g.key),
    onBlur: () => setHover(null),
  });

  return (
    <section className={compact ? undefined : "section-featured"} style={compact ? undefined : { paddingTop: "1rem" }}>
      {!compact && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
          {VIEW_NAMES.map((n) => (
            <button key={n} type="button" onClick={() => goTo(n)} aria-pressed={view === n} style={chip(view === n)}>
              {n}
            </button>
          ))}
        </div>
      )}

      <div
        ref={wrapRef}
        style={{
          position: "relative",
          border: "1px solid #1a1a1a",
          background: "radial-gradient(ellipse at 50% 40%, #0f1511 0%, #0a0a0a 75%)",
          lineHeight: 0,
        }}
      >
        <svg
          viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
          role="group"
          aria-label="Map of where each artist is from"
          style={{ width: "100%", height: "auto", display: "block", touchAction: "manipulation" }}
        >
          <defs>
            {/* Halftone dots stay the same on-screen size at every zoom */}
            <pattern id="land-dots" width={5 * s} height={5 * s} patternUnits="userSpaceOnUse">
              <rect width={5 * s} height={5 * s} fill="#0c110e" />
              <circle cx={2.5 * s} cy={2.5 * s} r={0.95 * s} fill={GREEN} fillOpacity={0.34} />
            </pattern>
          </defs>
          <path
            d={WORLD_PATH}
            fill="url(#land-dots)"
            stroke="#2f5a3a"
            strokeOpacity={0.55}
            strokeWidth={0.6}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />

          {/* Region-only origins first, so pins sit on top of them */}
          {groups.filter((g) => g.precision === "region").map((g) => {
            const on = selected === g.key;
            const r = 9 * s;
            return (
              <g
                key={g.key}
                role="button"
                tabIndex={0}
                aria-label={`${g.label}: ${g.slugs.length} artist${g.slugs.length > 1 ? "s" : ""} (region only)`}
                aria-pressed={on}
                onClick={() => pick(g)}
                {...hoverProps(g)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(g); } }}
                style={{ cursor: "pointer", outline: "none" }}
              >
                <circle
                  cx={g.x}
                  cy={g.y}
                  r={r}
                  fill={on ? "rgba(57,255,90,0.12)" : "none"}
                  stroke={GREEN}
                  strokeOpacity={on ? 1 : 0.55}
                  strokeDasharray="4 3"
                  strokeWidth={1.2}
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="stroke"
                />
                <circle cx={g.x} cy={g.y} r={2.2 * s} fill={GREEN} fillOpacity={on ? 1 : 0.55} />
                {g.slugs.length > 1 && (
                  <text x={g.x + r + 2 * s} y={g.y + 3 * s} fontSize={9 * s} fill={GREEN} fillOpacity={0.8} fontFamily="var(--font-display)" fontWeight={700}>
                    {g.slugs.length}
                  </text>
                )}
              </g>
            );
          })}

          {groups.filter((g) => g.precision === "city").map((g) => {
            const on = selected === g.key;
            const many = g.slugs.length > 1;
            const r = (many ? 6.2 : 4.2) * s;
            return (
              <g
                key={g.key}
                role="button"
                tabIndex={0}
                aria-label={`${g.label}: ${g.slugs.length} artist${many ? "s" : ""}`}
                aria-pressed={on}
                onClick={() => pick(g)}
                {...hoverProps(g)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(g); } }}
                style={{ cursor: "pointer", outline: "none" }}
              >
                {/* generous invisible hit area for fingers */}
                <circle cx={g.x} cy={g.y} r={r + 7 * s} fill="transparent" />
                <circle
                  className="pin-pulse"
                  cx={g.x}
                  cy={g.y}
                  r={r}
                  fill="none"
                  stroke={GREEN}
                  strokeWidth={1.2}
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                  style={{ animationDelay: `${(Math.abs(g.x * 7 + g.y * 13) % 28) / 10}s` }}
                />
                <circle cx={g.x} cy={g.y} r={r + 4 * s} fill={GREEN} fillOpacity={on ? 0.28 : 0.14} />
                <circle cx={g.x} cy={g.y} r={r} fill={on ? "#f0f0f0" : GREEN} stroke="#0a0a0a" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                {many && (
                  <text
                    x={g.x}
                    y={g.y + 3.1 * s}
                    textAnchor="middle"
                    fontSize={8.6 * s}
                    fill="#0a0a0a"
                    fontFamily="var(--font-display)"
                    fontWeight={800}
                    pointerEvents="none"
                  >
                    {g.slugs.length}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {bubbleGroup && size.w > 0 && (() => {
          const g = bubbleGroup;
          const px = ((g.x - box.x) / box.w) * size.w;
          const py = ((g.y - box.y) / box.h) * size.h;
          const n = g.slugs.length;
          const shown = g.slugs.slice(0, 4);
          const D = 56; // photo diameter
          const overlap = 18;
          const fanW = D + (shown.length - 1) * (D - overlap);
          const half = Math.max(fanW, 170) / 2 + 8;
          const left = Math.max(half, Math.min(size.w - half, px));
          const below = py < 125;
          const first = bySlug.get(g.slugs[0]);
          const title = n === 1 ? first?.name ?? "" : `${g.label} \u00b7 ${n}`;
          const sub = n === 1 ? g.label : "";
          return (
            <div
              key={g.key}
              aria-hidden="true"
              className="map-bubble"
              style={{
                position: "absolute",
                left,
                top: below ? py + 16 : py - 16,
                transform: below ? "translate(-50%, 0)" : "translate(-50%, -100%)",
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                zIndex: 3,
                lineHeight: 1.2,
              }}
            >
              {below && <Pointer dir="up" offset={px - left} />}
              <div style={{ display: "flex" }}>
                {shown.map((slug, i) => (
                  <div
                    key={slug}
                    style={{
                      position: "relative",
                      width: D,
                      height: D,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: `2px solid ${GREEN}`,
                      background: "#111",
                      marginLeft: i === 0 ? 0 : -overlap,
                      zIndex: shown.length - i,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.55), 0 0 14px rgba(57,255,90,0.35)",
                    }}
                  >
                    <ArtistImage slug={slug} name={bySlug.get(slug)?.name ?? slug} sizes="56px" />
                  </div>
                ))}
                {n > shown.length && (
                  <div
                    style={{
                      width: D,
                      height: D,
                      borderRadius: "50%",
                      marginLeft: -overlap,
                      background: "#0a0a0a",
                      border: `2px solid ${GREEN}`,
                      color: GREEN,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1rem",
                    }}
                  >
                    +{n - shown.length}
                  </div>
                )}
              </div>
              <div
                style={{
                  background: "rgba(10,10,10,0.92)",
                  border: "1px solid #1e4a28",
                  padding: "0.35rem 0.7rem",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  maxWidth: Math.max(160, size.w - 24),
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#f0f0f0", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {title}
                </div>
                {sub && (
                  <div style={{ fontFamily: "var(--font-desc)", fontWeight: 300, fontSize: "0.72rem", color: "#8a8a8a", marginTop: 2 }}>
                    {sub}
                  </div>
                )}
              </div>
              {!below && <Pointer dir="down" offset={px - left} />}
            </div>
          );
        })()}
      </div>

      {!compact && (<>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginTop: "0.9rem",
          fontFamily: "var(--font-display)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#8a8a8a",
        }}
      >
        <span>{placed} artists &middot; {places} places</span>
        <span>
          <span style={{ color: GREEN }}>&#9679;</span> City &nbsp;&nbsp;
          <span style={{ color: GREEN }}>&#9676;</span> Region only (state or country is all we have)
        </span>
      </div>

      <div style={{ marginTop: "2rem", borderTop: "1px solid #1a1a1a", paddingTop: "1.5rem", minHeight: "9rem" }}>
        {!sel ? (
          <p style={{ fontFamily: "var(--font-desc)", fontWeight: 300, color: "#b0b0b0", fontSize: "1rem", maxWidth: "36rem", lineHeight: 1.6 }}>
            Tap a pin to see who started there. The numbered pins are places more than one artist comes from.
          </p>
        ) : (
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: GREEN, marginBottom: "1.25rem" }}>
              {sel.label}
              {sel.precision === "region" ? " · region only" : ""} &middot; {sel.slugs.length} artist{sel.slugs.length > 1 ? "s" : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {sel.slugs.map((slug) => {
                const a = bySlug.get(slug)!;
                const o = ORIGINS.find((x) => x.slug === slug)!;
                return (
                  <div key={slug} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", borderBottom: "1px solid #1a1a1a", paddingBottom: "1.25rem" }}>
                    <Link href={`/artists/${slug}`} style={{ position: "relative", flex: "0 0 84px", width: 84, height: 84, display: "block", overflow: "hidden", background: "#111" }} aria-label={`${a.name} — open profile`}>
                      <ArtistImage slug={slug} name={a.name} sizes="84px" />
                    </Link>
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/artists/${slug}`} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "0.02em", textTransform: "uppercase", color: "#f0f0f0", textDecoration: "none", lineHeight: 1.1, display: "block" }}>
                        {a.name}
                      </Link>
                      <p style={{ fontFamily: "var(--font-desc)", fontWeight: 300, fontSize: "0.85rem", color: "#8a8a8a", margin: "0.3rem 0 0.7rem" }}>
                        {o.label} &middot; {a.genres.slice(0, 2).join(" / ")}
                      </p>
                      <PlayArtistButton slug={slug} name={a.name} ghost label="Listen" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </>)}
    </section>
  );
}
