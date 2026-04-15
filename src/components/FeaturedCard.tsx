"use client";

interface FeaturedCardProps {
  number: string;
  tag: string;
  title: string;
  body: string;
  spotifyTrackId?: string;
  onClick?: () => void;
}

export default function FeaturedCard({ number, tag, title, body, spotifyTrackId, onClick }: FeaturedCardProps) {
  return (
    <article
      style={{
        background: "#0a0a0a",
        padding: "2rem",
        transition: "background 0.2s",
        cursor: "pointer",
      }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#111")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#0a0a0a")}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: "#333",
          marginBottom: "2rem",
        }}
      >
        {number}
      </div>

      {/* Tag badge */}
      <div style={{ marginBottom: "1rem" }}>
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
          {tag}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.6rem",
          textTransform: "uppercase",
          color: "#e8e8e8",
          lineHeight: 1.1,
          marginBottom: "0.75rem",
          marginTop: 0,
        }}
      >
        {title}
      </h3>

      {/* Divider */}
      <div
        style={{
          width: "24px",
          height: "1px",
          background: "#222",
          margin: "1.25rem 0",
        }}
      />

      {/* Body */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: "0.75rem",
          color: "#555",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {body}
      </p>

      {/* Spotify Embed */}
      <div
        style={{ marginTop: "1.25rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {spotifyTrackId ? (
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`}
            width="100%"
            height={80}
            frameBorder={0}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#39ff5a",
              opacity: 0.5,
              paddingTop: "0.5rem",
            }}
          >
            Listen soon
          </div>
        )}
      </div>
    </article>
  );
}
