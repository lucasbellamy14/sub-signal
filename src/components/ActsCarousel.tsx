"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArtistImage from "@/components/ArtistImage";
import { ARTISTS, LANES, lanesOf } from "@/data/artists";
import { ORIGINS } from "@/data/origins";

const GREEN = "#39ff5a";

/** One glow color per lane; the centered artist's lane tints the whole stage. */
const LANE_GLOW: Record<(typeof LANES)[number], string> = {
  Electronic: "#2ee6ff",
  "Hip-Hop & Rap": "#ff8a2e",
  "R&B": "#b36bff",
  Pop: "#ff4fa3",
  "Indie & Alternative": "#39ff5a",
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Tilt = { rx: number; ry: number; gx: number; gy: number; on: boolean };
const FLAT: Tilt = { rx: 0, ry: 0, gx: 50, gy: 50, on: false };

export default function ActsCarousel() {
  // Newest artists first.
  const items = useMemo(
    () =>
      [...ARTISTS].sort(
        (a, b) => b.featuredDate.localeCompare(a.featuredDate) || Number(b.cardNumber) - Number(a.cardNumber),
      ),
    [],
  );
  const n = items.length;
  const originOf = useMemo(() => new Map(ORIGINS.map((o) => [o.slug, o.label])), []);

  const [pos, setPos] = useState(0);
  const posRef = useRef(0);
  const target = useRef(0);
  const raf = useRef<number | null>(null);
  const drag = useRef<{ x: number; pos: number; moved: boolean; lastX: number; lastT: number; v: number } | null>(null);
  const suppressClick = useRef(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageW, setStageW] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [tilt, setTilt] = useState<Tilt>(FLAT);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Phone tilt where the browser allows it without a permission prompt (Android).
  useEffect(() => {
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: unknown } }).DeviceOrientationEvent;
    if (!DOE || typeof DOE.requestPermission === "function" || reduced) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const onOri = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      setTilt({ rx: clamp((e.beta - 45) / -6, -9, 9), ry: clamp(e.gamma / 6, -9, 9), gx: 50 + clamp(e.gamma, -30, 30), gy: 50 + clamp(e.beta - 45, -30, 30), on: true });
    };
    window.addEventListener("deviceorientation", onOri);
    return () => window.removeEventListener("deviceorientation", onOri);
  }, [reduced]);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const tick = useCallback(() => {
    const diff = target.current - posRef.current;
    if (Math.abs(diff) < 0.002) {
      posRef.current = target.current;
      setPos(posRef.current);
      raf.current = null;
      return;
    }
    posRef.current += diff * 0.15;
    setPos(posRef.current);
    raf.current = requestAnimationFrame(tick);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      target.current = clamp(Math.round(i), 0, n - 1);
      if (reduced || document.hidden) {
        posRef.current = target.current;
        setPos(target.current);
        return;
      }
      if (raf.current == null) raf.current = requestAnimationFrame(tick);
    },
    [n, reduced, tick],
  );

  const cw = Math.min(stageW * 0.66, 300);
  const ch = cw * 1.3;
  const step = Math.max(cw * 0.5, 1);
  const centerIdx = clamp(Math.round(pos), 0, n - 1);
  const center = items[centerIdx];
  const centerLane = lanesOf(center.genres)[0] as (typeof LANES)[number] | undefined;

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
    drag.current = { x: e.clientX, pos: posRef.current, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    if (!d.moved) return;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.v = 0.8 * d.v + 0.2 * (-(e.clientX - d.lastX) / step / dt);
    d.lastX = e.clientX;
    d.lastT = now;
    posRef.current = clamp(d.pos - dx / step, -0.4, n - 0.6);
    setPos(posRef.current);
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      suppressClick.current = true;
      setTimeout(() => { suppressClick.current = false; }, 60);
      goTo(posRef.current + d.v * 140);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(target.current + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(target.current - 1); }
  };

  // Mouse tilt on the centered card
  const onCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse" || drag.current?.moved) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * 14, ry: (px - 0.5) * 16, gx: px * 100, gy: py * 100, on: true });
  };

  return (
    <section aria-roledescription="carousel" aria-label="Meet the acts" style={{ position: "relative", padding: "0.5rem 0 2.5rem", overflow: "hidden" }}>
      {/* Genre-colored glow: one layer per lane, the centered artist's lane fades in */}
      {LANES.map((lane) => (
        <div
          key={lane}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 55% at 50% 52%, ${LANE_GLOW[lane]}38 0%, ${LANE_GLOW[lane]}12 38%, transparent 70%)`,
            opacity: centerLane === lane ? 1 : 0,
            transition: "opacity 700ms ease",
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "1.25rem" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#9a9a9a" }}>
          Meet the acts
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6a6a6a" }}>
          Drag to browse
        </span>
      </div>

      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label={`${center.name}, ${centerIdx + 1} of ${n}. Use the left and right arrow keys to browse.`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          position: "relative",
          height: stageW ? ch + 70 : 460,
          perspective: "1100px",
          touchAction: "pan-y",
          cursor: drag.current?.moved ? "grabbing" : "grab",
          outline: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {stageW > 0 &&
          items.map((a, i) => {
            const d = i - pos;
            const abs = Math.abs(d);
            if (abs > 4) return null;
            const sign = d < 0 ? -1 : 1;
            const x = sign * (Math.min(abs, 1) * cw * 0.64 + Math.max(0, abs - 1) * cw * 0.3);
            const rotY = -clamp(d, -1, 1) * 50;
            const z = -Math.min(abs, 3) * 120;
            const scale = 1 - Math.min(abs, 3) * 0.04;
            const opacity = abs <= 2.2 ? 1 : Math.max(0, 1 - (abs - 2.2) * 0.55);
            const isCenter = i === centerIdx;
            const t = isCenter ? tilt : FLAT;
            return (
              <div
                key={a.slug}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 20,
                  width: cw,
                  height: ch,
                  marginLeft: -cw / 2,
                  transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  zIndex: 100 - Math.round(abs * 10),
                  opacity,
                  willChange: "transform",
                }}
              >
                <div
                  onPointerMove={isCenter ? onCardMove : undefined}
                  onPointerLeave={isCenter ? () => setTilt(FLAT) : undefined}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    background: "#111",
                    border: `1px solid ${isCenter ? GREEN : "#1e2a21"}`,
                    boxShadow: isCenter
                      ? `0 28px 60px rgba(0,0,0,0.65), 0 0 40px ${GREEN}33`
                      : "0 18px 40px rgba(0,0,0,0.6)",
                    transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
                    transition: t.on ? "transform 90ms linear" : "transform 400ms ease",
                  }}
                >
                  <ArtistImage slug={a.slug} name={a.name} sizes="300px" priority={Math.abs(i - centerIdx) < 2} />

                  {/* depth: darken the cards that aren't in focus */}
                  <div
                    aria-hidden="true"
                    style={{ position: "absolute", inset: 0, background: "#0a0a0a", opacity: clamp(abs * 0.35, 0, 0.75), pointerEvents: "none" }}
                  />
                  {/* bottom fade for text */}
                  <div
                    aria-hidden="true"
                    style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.35) 38%, transparent 62%)", pointerEvents: "none" }}
                  />
                  {/* holographic glare follows the cursor */}
                  {isCenter && t.on && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 28%, transparent 55%)`,
                        mixBlendMode: "overlay",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "1rem 1.1rem 1.1rem",
                      opacity: clamp(1 - abs * 1.4, 0, 1),
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(1.4rem, 5.5vw, 1.9rem)", letterSpacing: "0.02em", textTransform: "uppercase", color: "#f0f0f0", lineHeight: 1.02 }}>
                      {a.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-desc)", fontWeight: 300, fontSize: "0.78rem", color: "#b0b0b0", margin: "0.35rem 0 0.7rem" }}>
                      {a.genres.slice(0, 2).join(" / ")}
                    </div>
                    {isCenter && (
                      <Link
                        href={`/map?focus=${a.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{
                          pointerEvents: "auto",
                          position: "relative",
                          zIndex: 3,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: GREEN,
                          textDecoration: "none",
                          background: "rgba(10,10,10,0.72)",
                          border: "1px solid #1e4a28",
                          padding: "0.35rem 0.6rem",
                        }}
                      >
                        <span aria-hidden="true">&#9679;</span>
                        {originOf.get(a.slug) ?? "Origin"} &middot; map &rarr;
                      </Link>
                    )}
                  </div>

                  {/* Click target: centered card opens the profile, side cards swing to the middle */}
                  {isCenter ? (
                    <Link
                      href={`/artists/${a.slug}`}
                      aria-label={`${a.name} — open profile`}
                      onClick={(e) => { if (suppressClick.current) e.preventDefault(); }}
                      draggable={false}
                      style={{ position: "absolute", inset: 0, zIndex: 2 }}
                    />
                  ) : (
                    <button
                      type="button"
                      aria-label={`Show ${a.name}`}
                      onClick={() => { if (!suppressClick.current) goTo(i); }}
                      style={{ position: "absolute", inset: 0, zIndex: 2, background: "transparent", border: "none", cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>
            );
          })}

        {/* floor shadow under the centered card */}
        {stageW > 0 && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: ch + 22,
              width: cw * 0.9,
              height: 26,
              marginLeft: -(cw * 0.9) / 2,
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, transparent 70%)",
              filter: "blur(4px)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      <div style={{ position: "relative", textAlign: "center", marginTop: "0.25rem", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.3em", color: "#8a8a8a" }}>
        <span style={{ color: GREEN }}>{String(centerIdx + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
      </div>
    </section>
  );
}
