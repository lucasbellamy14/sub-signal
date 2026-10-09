"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Spotify's player pulls in ~900 KB of scripts, fonts and images. Browsers start
 * "lazy" iframes long before they scroll into view, so on a slow connection every
 * player on a page loaded up front and slowed the whole page. This only creates
 * the iframe when its box is about to be on screen.
 */
export default function SpotifyEmbed({
  trackId,
  title,
  height,
  radius = 8,
}: {
  trackId: string;
  title: string;
  height: number;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height, borderRadius: radius, background: show ? "transparent" : "#111" }}>
      {show && (
        <iframe
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
          title={title}
          width="100%"
          height={height}
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{ borderRadius: radius, border: "none", background: "transparent", display: "block" }}
        />
      )}
    </div>
  );
}
