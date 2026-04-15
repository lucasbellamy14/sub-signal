"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCard from "@/components/FeaturedCard";
import ArtistTimeline from "@/components/ArtistTimeline";
import { ARTISTS } from "@/data/artists";
import { useSavedArtists } from "@/context/SavedArtistsContext";

export default function SavedPage() {
  const { savedSlugs } = useSavedArtists();
  const [selectedArtist, setSelectedArtist] = useState<typeof ARTISTS[number] | null>(null);

  const savedArtists = ARTISTS.filter((a) => savedSlugs.includes(a.slug));

  return (
    <>
      <Header />

      <section className="section-hero">
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#39ff5a",
            marginBottom: "1.5rem",
          }}
        >
          Your Collection
        </p>

        <h1 className="hero-headline">
          Saved <span style={{ color: "#39ff5a" }}>Signals</span>
        </h1>
      </section>

      <section className="section-featured">
        {savedArtists.length > 0 ? (
          <div className="featured-grid">
            {savedArtists.map((artist) => (
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
                fontWeight: 700,
                fontSize: "1.2rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#9a9a9a",
                marginBottom: "1.5rem",
              }}
            >
              No signals caught yet
            </p>
            <a
              href="/discover"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#39ff5a",
                textDecoration: "none",
                borderBottom: "1px solid #1e4a28",
                paddingBottom: "0.25rem",
              }}
            >
              Start Discovering
            </a>
          </div>
        )}
      </section>

      <Footer />

      <ArtistTimeline
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
      />
    </>
  );
}
