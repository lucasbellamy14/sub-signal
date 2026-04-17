"use client";

import Header from "@/components/Header";
import FeaturedCard from "@/components/FeaturedCard";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { ARTISTS, TICKER_ARTISTS } from "@/data/artists";

const HOMEPAGE_ARTISTS = ARTISTS.slice(0, 3);
const TRENDING_ARTISTS = [...ARTISTS]
  .sort((a, b) => b.featuredDate.localeCompare(a.featuredDate))
  .slice(0, 6);

export default function Home() {
  const tickerText = TICKER_ARTISTS.join(" \u00b7 ");

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <section className="section-hero">
        <p
          className="animate-fade-in-up stagger-1"
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

        <h1 className="hero-headline animate-fade-in-up stagger-2">
          Before The <span style={{ color: "#39ff5a" }}>World</span> Knows
        </h1>

        <p
          className="animate-fade-in-up stagger-3"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.95rem",
            color: "#b0b0b0",
            maxWidth: "420px",
            lineHeight: 1.7,
            marginTop: "2rem",
            marginBottom: "3rem",
          }}
        >
          Sub Signal surfaces artists at the edge of breaking. No algorithms. No
          playlists. Just the music that matters &mdash; found early.
        </p>

        <Link
          href="/discover"
          className="animate-fade-in-up stagger-4"
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
        </Link>
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

      {/* ── TRENDING NOW ── */}
      <section className="animate-fade-in-up stagger-5" style={{ padding: "3rem 2.5rem 2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #1a1a1a",
            paddingBottom: "1rem",
            marginBottom: "1.5rem",
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
            Trending Now
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
            {TRENDING_ARTISTS.length} Artists
          </span>
        </div>

        <div
          className="scroll-row"
          style={{
            display: "flex",
            gap: "1px",
            overflowX: "auto",
            paddingBottom: "0.75rem",
          }}
        >
          {TRENDING_ARTISTS.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              style={{
                flex: "0 0 180px",
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                padding: "1.5rem 1.25rem",
                textDecoration: "none",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#111";
                e.currentTarget.style.borderColor = "#222";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0a0a0a";
                e.currentTarget.style.borderColor = "#1a1a1a";
              }}
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                {/* Thumbnail */}
                <div style={{ width: "60px", height: "60px", flexShrink: 0, overflow: "hidden", borderRadius: "2px" }}>
                  <Image
                    src={`/images/artists/${artist.slug}.svg`}
                    alt={artist.name}
                    width={60}
                    height={60}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#e8e8e8",
                      lineHeight: 1.2,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {artist.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#9a9a9a",
                    }}
                  >
                    {artist.meta.split("·")[1]?.trim()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED CARDS ── */}
      <section id="discover" className="section-featured animate-fade-in-up stagger-7">
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
              slug={artist.slug}
              number={artist.cardNumber}
              tag={artist.cardTag}
              title={artist.cardTitle}
              body={artist.cardBody}
              image={`/images/artists/${artist.slug}.svg`}
              genres={artist.genres}
              spotifyTrackId={artist.spotifyTrackId}
              instagram={artist.instagram}
              tiktok={artist.tiktok}
              twitter={artist.twitter}
              spotify={artist.spotify}
            />
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </>
  );
}
