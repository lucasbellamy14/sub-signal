"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import SaveButton from "@/components/SaveButton";

interface FeaturedCardProps {
  slug: string;
  number: string;
  tag: string;
  title: string;
  body: string;
  image?: string;
  genres?: string[];
  spotifyTrackId?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  spotify?: string;
  onClick?: () => void;
}

export default function FeaturedCard({ slug, number, tag, title, body, image, genres, spotifyTrackId, instagram, tiktok, twitter, spotify, onClick }: FeaturedCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cardContent = (
    <article
      style={{
        background: hovered ? "#111" : "#0a0a0a",
        padding: 0,
        transition: "all 200ms ease",
        cursor: "pointer",
        border: "1px solid",
        borderColor: hovered ? "rgba(57,255,90,0.25)" : "transparent",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artist Image */}
      {image && !imgError ? (
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={image}
            alt={title}
            width={600}
            height={600}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 400ms ease",
              transform: hovered ? "scale(1.03)" : "scale(1)",
            }}
            onError={() => setImgError(true)}
          />
        </div>
      ) : image ? (
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            background: `linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)`,
          }}
        />
      ) : null}

      <div style={{ padding: "2rem" }}>
        {/* Number + Save */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "#555",
          }}
        >
          {number}
        </span>
        <SaveButton slug={slug} size={16} />
      </div>

      {/* Tag badge */}
      <div style={{ marginBottom: "1rem" }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#39ff5a",
            border: "1px solid #1e4a28",
            padding: "0.3rem 0.75rem",
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
          fontSize: "2rem",
          textTransform: "uppercase",
          color: "#e8e8e8",
          lineHeight: 1.1,
          marginBottom: "0.75rem",
          marginTop: 0,
        }}
      >
        {title}
      </h3>

      {/* Genre Labels */}
      {genres && genres.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          {genres.map((genre) => (
            <span
              key={genre}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#b0b0b0",
                border: "1px solid #222",
                padding: "0.2rem 0.5rem",
              }}
            >
              {genre}
            </span>
          ))}
        </div>
      )}

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
          fontSize: "0.95rem",
          color: "#b0b0b0",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {body}
      </p>

      {/* Social Links */}
      <div style={{ marginTop: "1rem" }}>
        <SocialLinks
          instagram={instagram}
          tiktok={tiktok}
          twitter={twitter}
          spotify={spotify}
          size={16}
        />
      </div>

      {/* Spotify Embed */}
      <div
        style={{ marginTop: "1.25rem" }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
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
              height: "80px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              border: "1px dashed #1a1a1a",
              padding: "0 1rem",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#39ff5a",
                animation: "blinkDot 2.2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#39ff5a",
                opacity: 0.5,
              }}
            >
              Track dropping soon
            </span>
          </div>
        )}
      </div>
      </div>{/* end padding wrapper */}
    </article>
  );

  // Wrap in Link for navigation to artist page
  return (
    <Link
      href={`/artists/${slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onClick={(e) => {
        // Allow social links and spotify to work without navigating
        const target = e.target as HTMLElement;
        if (target.closest("iframe") || target.closest("[data-social]")) {
          e.preventDefault();
        }
      }}
    >
      {cardContent}
    </Link>
  );
}
