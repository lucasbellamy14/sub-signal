"use client";

import { useEffect } from "react";

interface ArtistProfile {
  name: string;
  genre: string;
  bio: string;
}

interface ArtistModalProps {
  artist: ArtistProfile;
  onClose: () => void;
}

export default function ArtistModal({ artist, onClose }: ArtistModalProps) {
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

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "2rem",
            right: "2.5rem",
            background: "none",
            border: "none",
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            color: "#777",
            cursor: "pointer",
            transition: "color 0.2s",
            padding: "0.5rem",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
        >
          ✕
        </button>

        {/* Genre tag */}
        <div style={{ marginBottom: "1.5rem" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-display)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#39ff5a",
              border: "1px solid #1e4a28",
              padding: "0.25rem 0.6rem",
            }}
          >
            {artist.genre}
          </span>
        </div>

        {/* Artist name */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(3rem, 8vw, 6rem)",
            textTransform: "uppercase",
            color: "#f0f0f0",
            lineHeight: 0.95,
            margin: "0 0 2rem 0",
          }}
        >
          {artist.name}
        </h2>

        {/* Bio */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "1rem",
            color: "#777",
            maxWidth: "600px",
            lineHeight: 1.8,
            margin: "0 0 3rem 0",
          }}
        >
          {artist.bio}
        </p>

        {/* CTA */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: "inline-block",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            background: "#39ff5a",
            color: "#0a0a0a",
            padding: "0.75rem 2rem",
            borderRadius: 0,
            boxShadow: "none",
            border: "none",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Listen Now
        </a>
      </div>
    </div>
  );
}
