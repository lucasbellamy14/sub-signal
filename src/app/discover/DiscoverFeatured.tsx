"use client";

import { useState } from "react";
import FeaturedCard from "@/components/FeaturedCard";
import ArtistTimeline from "@/components/ArtistTimeline";
import { ARTISTS } from "@/data/artists";

export default function DiscoverFeatured() {
  const [selectedArtist, setSelectedArtist] = useState<typeof ARTISTS[number] | null>(null);

  return (
    <>
      <section id="discover" className="section-featured">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #1a1a1a",
            paddingBottom: "1rem",
            marginBottom: "2rem",
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

        <div className="featured-grid">
          {ARTISTS.map((artist) => (
            <FeaturedCard
              key={artist.id}
              slug={artist.slug}
              number={artist.cardNumber}
              tag={artist.cardTag}
              title={artist.cardTitle}
              body={artist.cardBody}
              spotifyTrackId={artist.spotifyTrackId}
              instagram={artist.instagram}
              tiktok={artist.tiktok}
              twitter={artist.twitter}
              spotify={artist.spotify}
              onClick={() => setSelectedArtist(artist)}
            />
          ))}
        </div>
      </section>

      <ArtistTimeline
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
      />
    </>
  );
}
