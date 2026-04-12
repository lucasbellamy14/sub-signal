"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FeaturedCard from "@/components/FeaturedCard";
import ArtistModal from "@/components/ArtistModal";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const TICKER_ARTISTS = [
  "Mk.gee",
  "Nia Archives",
  "Jean Dawson",
  "Amaarae",
  "Paris Texas",
  "Raveena",
  "Bladee",
  "Emotional Oranges",
  "Odunsi",
];

const FEATURED_CARDS = [
  {
    number: "01",
    tag: "Discovery",
    title: "Mk.gee Is Building Cathedrals",
    body: "A deep dive into the sonic architecture of one of indie\u2019s most meticulous producers \u2014 layering feedback, tape hiss, and devotion into something transcendent.",
  },
  {
    number: "02",
    tag: "Profile",
    title: "Nia Archives and the New London Sound",
    body: "From jungle to jazz, Nia Archives is rewriting the rules of UK dance music with a fearless, genre-defying approach that honors the past while sprinting forward.",
  },
  {
    number: "03",
    tag: "Mix",
    title: "90 Minutes with Paris Texas",
    body: "An exclusive mixtape session blending hip-hop, noise rock, and internet-age absurdism \u2014 a snapshot of two artists who refuse to be categorized.",
  },
];

const ARTIST_PROFILES = [
  {
    name: "Mk.gee",
    genre: "Indie / Experimental",
    bio: "Michael Gordon makes music that sounds like a half-remembered dream broadcast through a broken radio. Working out of his bedroom in New Jersey, he layers warped guitars over pillowy production, creating songs that feel both deeply personal and impossibly vast. His debut album has been called a masterclass in restrained maximalism \u2014 every sound placed with surgical precision, every silence left to breathe. He doesn\u2019t chase trends. He builds cathedrals.",
  },
  {
    name: "Nia Archives",
    genre: "Jungle / Electronic",
    bio: "Born in Bradford and raised on her grandmother\u2019s reggae collection, Nia Archives is the 23-year-old producer rewriting the DNA of UK dance music. She fuses breakbeat-era jungle with jazzy vocal runs and lo-fi textures, creating a sound that feels both nostalgic and entirely new. Her sets have become legendary \u2014 sweaty rooms packed with people moving to rhythms they can\u2019t quite place but instantly understand. London\u2019s new sound has a name, and it\u2019s hers.",
  },
  {
    name: "Paris Texas",
    genre: "Hip-Hop / Noise",
    bio: "Louie Pastel and Felix make music that refuses to sit still. One moment it\u2019s hardcore punk, the next it\u2019s syrupy Southern rap, and then suddenly it\u2019s something that doesn\u2019t have a name yet. The LA duo has built a cult following through chaotic live shows and a relentless DIY output that treats genre boundaries as suggestions to be ignored. Their sound is the internet made flesh \u2014 referential, irreverent, and completely unpredictable.",
  },
];

export default function Home() {
  const [activeArtist, setActiveArtist] = useState<number | null>(null);
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
          href="#discover"
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
          {FEATURED_CARDS.map((card, i) => (
            <FeaturedCard
              key={card.number}
              {...card}
              onClick={() => setActiveArtist(i)}
            />
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />

      {activeArtist !== null && (
        <ArtistModal
          artist={ARTIST_PROFILES[activeArtist]}
          onClose={() => setActiveArtist(null)}
        />
      )}
    </>
  );
}
