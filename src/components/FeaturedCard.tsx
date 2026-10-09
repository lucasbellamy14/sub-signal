"use client";

import { useState } from "react";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import Link from "next/link";
import ArtistImage from "@/components/ArtistImage";
import SocialLinks from "@/components/SocialLinks";
import SaveButton from "@/components/SaveButton";
import { PlayArtistButton } from "@/components/PlayButtons";

interface FeaturedCardProps {
  slug: string;
  name: string;
  number: string;
  tag: string;
  title: string;
  body: string;
  artistIndex?: number;
  genres?: string[];
  spotifyTrackId?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  spotify?: string;
}

export default function FeaturedCard({ slug, name, number, tag, title, body, artistIndex = 0, genres, spotifyTrackId, instagram, tiktok, twitter, spotify }: FeaturedCardProps) {
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
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card-wide link. A sibling overlay (not a wrapper) so the social links
          and Spotify player inside the card are never nested inside an <a>. */}
      <Link
        href={`/artists/${slug}`}
        aria-label={`${name} — read the story`}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />
      {/* Artist Generative Art */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1/1",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transition: "transform 600ms cubic-bezier(0.22,1,0.36,1), filter 400ms ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            filter: hovered ? "grayscale(0) saturate(1.05)" : "grayscale(0.85) contrast(1.05)",
          }}
        >
          <ArtistImage slug={slug} name={name} index={artistIndex} />
        </div>
        <div style={{ position: "absolute", left: "0.9rem", bottom: "0.9rem", zIndex: 2 }}>
          <PlayArtistButton slug={slug} name={name} ghost />
        </div>
      </div>

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
        <span style={{ position: "relative", zIndex: 2 }}>
          <SaveButton slug={slug} size={16} />
        </span>
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
        className="artist-desc"
        style={{
          fontSize: "1.075rem",
          color: "#c4c4c4",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {body}
      </p>

      {/* Social Links */}
      <div style={{ marginTop: "1rem", position: "relative", zIndex: 2, width: "fit-content" }}>
        <SocialLinks
          instagram={instagram}
          tiktok={tiktok}
          twitter={twitter}
          spotify={spotify}
          size={16}
        />
      </div>

      {/* Spotify Embed */}
      <div style={{ marginTop: "1.25rem", position: "relative", zIndex: 2 }}>
        {spotifyTrackId ? (
          <SpotifyEmbed trackId={spotifyTrackId} title={`${name} on Spotify`} height={80} radius={8} />
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

  return cardContent;
}
