"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useListen } from "@/context/ListenContext";

const fmt = (s: number) => `0:${String(Math.min(Math.floor(s), 59)).padStart(2, "0")}`;

const iconBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#f0f0f0",
  cursor: "pointer",
  padding: "0.5rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

/**
 * Persistent player pinned to the bottom of every page. Hidden until something
 * is playing. Plays 30-second previews (via Deezer), so it says so.
 */
export default function ListenBar() {
  const { current, playing, loading, progress, position, error, mode, toggle, next, prev, seek, close } = useListen();
  const open = !!current;

  // Keep page content (footer) from sitting underneath the bar.
  useEffect(() => {
    document.body.style.paddingBottom = open ? "76px" : "";
    return () => { document.body.style.paddingBottom = ""; };
  }, [open]);

  return (
    <div
      role="region"
      aria-label="Music player"
      aria-hidden={!open}
      className="listen-bar"
      data-open={open}
    >
      {current && (
        <>
          <div className="listen-progress" aria-hidden="true">
            <div className="listen-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            value={Math.round(progress * 1000)}
            onChange={(e) => seek(Number(e.target.value) / 1000)}
            aria-label="Seek within preview"
            aria-valuetext={`${fmt(position)} of 0:30`}
            className="listen-seek"
          />

          <div className="listen-inner">
            <Link href={`/artists/${current.artistSlug}`} className="listen-meta" aria-label={`${current.artistName} — open artist page`}>
              {current.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.cover} alt="" width={48} height={48} className="listen-cover" />
              ) : (
                <span className="listen-cover" />
              )}
              <span className="listen-text">
                <span className="listen-title">{current.title}</span>
                <span className="listen-artist">{current.artistName}</span>
              </span>
            </Link>

            <div className="listen-controls">
              <button type="button" onClick={prev} aria-label="Previous track" style={iconBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z" /></svg>
              </button>
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
                className="listen-play"
              >
                {loading && !playing ? (
                  <span className="listen-spin" aria-hidden="true" />
                ) : playing ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <button type="button" onClick={next} aria-label="Next track" style={iconBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l11-7z" /></svg>
              </button>
            </div>

            <div className="listen-side">
              <span className="listen-time" aria-hidden="true">{fmt(position)} / 0:30</span>
              <span className="listen-note">{error ?? (mode === "feed" ? "Sub Signal feed · 30s previews via Deezer" : "30s preview via Deezer")}</span>
            </div>

            <button type="button" onClick={close} aria-label="Close player" style={{ ...iconBtn, color: "#777" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
          </div>

          {/* Announce track changes to screen readers */}
          <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            {playing ? `Now playing ${current.title} by ${current.artistName}` : ""}
          </span>
        </>
      )}
    </div>
  );
}
