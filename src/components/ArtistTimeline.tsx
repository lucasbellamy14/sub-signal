"use client";

import { useEffect } from "react";

interface TimelineEntry {
  year: string;
  title: string;
  body: string;
}

interface ArtistTimelineProps {
  artist: {
    name: string;
    meta: string;
    photos: [string, string];
    photoLabels: [string, string];
    timeline: TimelineEntry[];
  } | null;
  onClose: () => void;
}

function splitName(name: string) {
  const words = name.split(" ");
  if (words.length <= 1) return <>{name}</>;
  const last = words.pop();
  return (
    <>
      {words.join(" ")}
      <br />
      {last}
    </>
  );
}

function SpineArrows() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        padding: "8px 0 4px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          viewBox="0 0 22 30"
          width={22}
          fill="none"
          style={{
            animation: `spineArrow 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
            opacity: i === 0 ? 1 : i === 1 ? 0.55 : 0.25,
          }}
        >
          <path
            d="M11 2 L11 20 M4 13 L11 22 L18 13"
            stroke="#39ff5a"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

export default function ArtistTimeline({ artist, onClose }: ArtistTimelineProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!artist) return null;

  return (
    <div
      className="timeline-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="timeline-modal">
        {/* Corner brackets */}
        <div className="corner-bracket corner-tl" />
        <div className="corner-bracket corner-tr" />
        <div className="corner-bracket corner-bl" />
        <div className="corner-bracket corner-br" />

        {/* Radial glow halos */}
        <div className="glow-halo glow-tl" />
        <div className="glow-halo glow-br" />

        {/* Scanning light */}
        <div className="scan-line" />

        {/* Close button */}
        <button className="timeline-close" onClick={onClose}>
          CLOSE ✕
        </button>

        {/* Two-column grid */}
        <div className="timeline-grid">
          {/* LEFT COLUMN */}
          <div className="timeline-left">
            {/* Logo bar */}
            <div className="timeline-logo-bar">
              <span className="timeline-blink-dot" />
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#f0f0f0",
                }}
              >
                SUB{" "}
                <span style={{ color: "#39ff5a" }}>SIGNAL</span>
              </span>
            </div>

            {/* Photo slots */}
            <div className="timeline-photos">
              {[0, 1].map((i) => (
                <div key={i} className="photo-slot">
                  <div className="photo-dashed-border" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={artist.photos[i]}
                    alt={artist.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      filter: "contrast(1.05) brightness(0.95)",
                      display: "block",
                    }}
                  />
                  <div className="photo-gradient" />
                  <span className="photo-ghost-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="photo-label">
                    {artist.photoLabels[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="timeline-right">
            {/* Artist name */}
            <h2 className="timeline-artist-name">
              {splitName(artist.name)}
            </h2>

            {/* Meta */}
            <p className="timeline-meta">{artist.meta}</p>

            {/* Divider */}
            <div className="timeline-divider-row">
              <div className="timeline-divider-line">
                <span className="timeline-divider-accent" />
              </div>
              <div className="timeline-diamond" />
              <div className="timeline-divider-line" />
            </div>

            {/* Timeline entries */}
            <div>
              {artist.timeline.map((entry, i) => (
                <div key={i} className="timeline-entry">
                  {/* Year */}
                  <div className="timeline-year">{entry.year}</div>

                  {/* Spine */}
                  <div className="timeline-spine">
                    <div className="timeline-dot" />
                    {i < artist.timeline.length - 1 && <SpineArrows />}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="timeline-entry-title">{entry.title}</h3>
                    <p
                      className="timeline-entry-body"
                      style={{
                        marginBottom:
                          i === artist.timeline.length - 1 ? 0 : "1.6rem",
                      }}
                    >
                      {entry.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="timeline-cta-row">
              <button className="timeline-cta-button">Listen Now</button>
              <span className="timeline-cta-sub">Sub Signal, Vol. 012</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
