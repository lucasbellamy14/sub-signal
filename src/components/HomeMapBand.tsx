"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// The map (and its 110 KB world outline) loads only when someone scrolls near it.
const OriginMap = dynamic(() => import("@/app/map/OriginMap"), { ssr: false });

const label: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "0.7rem",
  letterSpacing: "0.25em",
  textTransform: "uppercase",
};

export default function HomeMapBand() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section-featured">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <span style={{ ...label, color: "#9a9a9a" }}>Where It Starts</span>
        <Link href="/map" style={{ ...label, color: "#39ff5a", textDecoration: "none" }}>
          Explore the map &rarr;
        </Link>
      </div>
      <div ref={ref} style={{ minHeight: "16rem" }}>
        {near && <OriginMap compact />}
      </div>
    </section>
  );
}
