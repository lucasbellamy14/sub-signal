"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FeaturedCard from "@/components/FeaturedCard";
import ArtistTimeline from "@/components/ArtistTimeline";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { ARTISTS, TICKER_ARTISTS } from "@/data/artists";

const HOMEPAGE_ARTISTS = ARTISTS.slice(0, 3);

export default function Home() {
  const [selectedArtist, setSelectedArtist] = useState<typeof ARTISTS[number] | null>(null);
  const tickerText = TICKER_ARTISTS.join(" \u00b7 ");

  return (
    <>
      <Header />

      {/* ── HERO ── */}
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
          Music Discovery &middot; Underground &middot; Pre-Mainstream
        </p>

        <h1 className="hero-headline">
          Before The <span style={{ color: "#39ff5a" }}>World</span> Knows
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.95rem",
            color: "#777",
            maxWidth: "420px",
            lineHeight: 1.7,
            marginTop: "2rem",
            marginBottom: "3rem",
          }}
        >
          Sub Signal surfaces artists at the edge of breaking. No algorithms. No
          playlists. Just the music that matters &mdash; found early.
        </p>

        <a
          href="/discover"
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
          Start Listening
        </a>
      </section>

      {/* ── TICKER STRIP ── */}
      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          borderBottom: "1px solid #1a1a1a",
          padding: "0.85rem 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          className="animate-marquee"
          style={{ display: "inline-flex", width: "max-content" }}
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#39ff5a",
                  marginRight: "1.5rem",
                  fontWeight: 700,
                }}
              >
                NOW LISTENING
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#f0f0f0",
                  marginRight: "1.5rem",
                }}
              >
                {tickerText}
                <span style={{ color: "#39ff5a", margin: "0 0.75rem" }}>
                  &middot;
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED CARDS ── */}
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
              color: "#555",
            }}
          >
            Featured This Week
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
          {HOMEPAGE_ARTISTS.map((artist) => (
            <FeaturedCard
              key={artist.id}
              number={artist.cardNumber}
              tag={artist.cardTag}
              title={artist.cardTitle}
              body={artist.cardBody}
              onClick={() => setSelectedArtist(artist)}
            />
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />

      <ArtistTimeline
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
      />
    </>
  );
}
