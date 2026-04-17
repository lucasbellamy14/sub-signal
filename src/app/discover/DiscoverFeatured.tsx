"use client";

import { useState } from "react";
import FeaturedCard from "@/components/FeaturedCard";
import { ARTISTS } from "@/data/artists";

const allGenres = Array.from(new Set(ARTISTS.flatMap((a) => a.genres))).sort();

export default function DiscoverFeatured() {
  const [activeGenres, setActiveGenres] = useState<Set<string>>(new Set());

  const toggleGenre = (genre: string) => {
    setActiveGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) {
        next.delete(genre);
      } else {
        next.add(genre);
      }
      return next;
    });
  };

  const clearFilters = () => setActiveGenres(new Set());

  const filteredArtists =
    activeGenres.size === 0
      ? ARTISTS
      : ARTISTS.filter((a) => a.genres.some((g) => activeGenres.has(g)));

  const chipBase: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.45rem 1rem",
    cursor: "pointer",
    fontWeight: 700,
    transition: "all 150ms ease",
    border: "1px solid",
    background: "transparent",
  };

  return (
    <section id="discover" className="section-featured">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: "1rem",
          marginBottom: "0",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#9a9a9a",
          }}
        >
          Featured Artists
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#333",
          }}
        >
          Vol. 001 &mdash; Apr 2026
        </span>
      </div>

      {/* Genre Filter Chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          padding: "2rem 0 1rem",
          borderBottom: "1px solid #151515",
          marginBottom: "0.75rem",
        }}
      >
        {/* "All" chip */}
        <button
          onClick={clearFilters}
          style={{
            ...chipBase,
            background: activeGenres.size === 0 ? "#39ff5a" : "transparent",
            color: activeGenres.size === 0 ? "#0a0a0a" : "#b0b0b0",
            borderColor: activeGenres.size === 0 ? "#39ff5a" : "#222",
          }}
        >
          All
        </button>

        {allGenres.map((genre) => {
          const isActive = activeGenres.has(genre);
          return (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              style={{
                ...chipBase,
                background: isActive ? "#39ff5a" : "transparent",
                color: isActive ? "#0a0a0a" : "#b0b0b0",
                borderColor: isActive ? "#39ff5a" : "#222",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#39ff5a";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#222";
                  e.currentTarget.style.color = "#b0b0b0";
                }
              }}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <p
        style={{
          fontSize: "0.75rem",
          color: "#555",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.1em",
          marginBottom: "2rem",
        }}
      >
        {filteredArtists.length} artist{filteredArtists.length !== 1 ? "s" : ""}
      </p>

      {/* Artist Grid or Empty State */}
      {filteredArtists.length > 0 ? (
        <div className="featured-grid">
          {filteredArtists.map((artist) => (
            <FeaturedCard
              key={artist.id}
              slug={artist.slug}
              number={artist.cardNumber}
              tag={artist.cardTag}
              title={artist.cardTitle}
              body={artist.cardBody}
              artistIndex={ARTISTS.indexOf(artist)}
              genres={artist.genres}
              spotifyTrackId={artist.spotifyTrackId}
              instagram={artist.instagram}
              tiktok={artist.tiktok}
              twitter={artist.twitter}
              spotify={artist.spotify}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#39ff5a",
              marginBottom: "1rem",
            }}
          >
            No signals in this frequency
          </p>
          <button
            onClick={clearFilters}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#b0b0b0",
              background: "none",
              border: "1px solid #222",
              padding: "0.4rem 1rem",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#39ff5a";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#222";
              e.currentTarget.style.color = "#b0b0b0";
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
