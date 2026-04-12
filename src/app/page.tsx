"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FeaturedCard from "@/components/FeaturedCard";
import ArtistTimeline from "@/components/ArtistTimeline";
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

const ARTISTS = [
  {
    name: "Mk.gee",
    meta: "Los Angeles \u00b7 Alt-R&B \u00b7 b. 1998",
    photos: ["/images/mkgee-early.jpg", "/images/mkgee-recent.jpg"] as [string, string],
    photoLabels: ["New Jersey \u00b7 Early Days", "Los Angeles \u00b7 2024"] as [string, string],
    timeline: [
      { year: "1998", title: "Jersey Suburbs, Quiet Kid", body: "Grew up in suburban New Jersey in a Lebanese-American household. His father played oud and classic Arabic pop around the house. He was a quiet kid who spent most of his time alone in his room, drawing and listening to music on an iPod he wasn\u2019t supposed to have yet." },
      { year: "2012", title: "Guitar First. Then Obsession.", body: "Got his first guitar at fourteen and taught himself entirely by ear. No lessons, no tabs \u2014 just slowing songs down and figuring them out alone. Within a year he was recording straight into GarageBand on a family MacBook, layering guitars over drum loops at 1am." },
      { year: "2017", title: "Berklee, Then Gone.", body: "Enrolled at Berklee College of Music in Boston but left within a year. The structure didn\u2019t fit what he was hearing in his head. Moved to Los Angeles with almost nothing and started building a studio setup in a rented room in Silver Lake." },
      { year: "2020", title: "Two EP Drops. Silence.", body: "Released two self-produced EPs quietly with no label, no PR, no rollout. A few thousand plays. Some blog pickups. He kept making music anyway, refining a guitar tone that sounded like nothing else \u2014 wet, spectral, distinctly his own." },
      { year: "2023", title: "Internet Finds Him.", body: "A single clip of him performing live circulates on music Twitter and Reddit overnight. Tens of thousands of shares in 48 hours. Suddenly everyone is asking who he is. Labels reach out within the week. He takes his time responding." },
      { year: "Now", title: "Ascent. On His Terms.", body: "Critically acclaimed debut. Tours selling out. Production credits stacking up with artists he admired growing up. Still records everything himself first. Still sounds like no one else." },
    ],
  },
  {
    name: "Nia Archives",
    meta: "London \u00b7 Jungle \u00b7 b. 2000",
    photos: ["/images/nia-early.jpg", "/images/nia-recent.jpg"] as [string, string],
    photoLabels: ["Tottenham, UK \u00b7 Early Days", "East London \u00b7 2024"] as [string, string],
    timeline: [
      { year: "2000", title: "Gospel, Funk, Law School", body: "Her mother played gospel every Sunday without fail. Her father kept crates of West African funk stacked against the living room wall. She absorbed all of it without knowing why. The plan back then was law school. Music was not even part of the conversation." },
      { year: "2014", title: "One Tape. Everything Shifts.", body: "Fourteen years old on a drive back from a family thing. A cousin plays a 90s jungle mixtape through blown car speakers and something cracks open. She finds Goldie\u2019s Timeless at a car boot sale for fifty pence. She still has it." },
      { year: "2017", title: "Retail Days. Secret Nights.", body: "College during the week. Primark in Wood Green on weekends. She saves enough for a secondhand laptop, downloads a cracked Ableton, and figures it out entirely alone after her parents fall asleep. No tutorials. Nobody to ask. Nobody in her life even knows she is doing it." },
      { year: "2020", title: "Lockdown. Fake Name. Strangers.", body: "COVID locks London down and she has nothing but time and a laptop. Posts her first track under a name that is not hers. Two hundred plays in week one from people she has never met. She emails a blogger and gets ignored. Emails again. Posts another track anyway." },
      { year: "2022", title: "80 People. 400K Views.", body: "East London warehouse, maybe eighty people in person \u2014 sweaty, close, true believers. Someone films it. By morning four hundred thousand people have watched. Managers, labels, journalists and fans all arrive at once. Her phone is unusable for three straight days." },
      { year: "Now", title: "Signed. Touring. Still Creating.", body: "Label deals, world stages, festival slots. The whole machine kicked in fast and loud. She still makes music alone at night when the world goes quiet. Still has the Goldie record. Some things do not change when they were never about the deal in the first place." },
    ],
  },
  {
    name: "Paris Texas",
    meta: "Los Angeles \u00b7 Alt-Rap \u00b7 Est. 2020",
    photos: ["/images/paristexas-early.jpg", "/images/paristexas-recent.jpg"] as [string, string],
    photoLabels: ["Compton, CA \u00b7 Early Days", "Los Angeles \u00b7 2024"] as [string, string],
    timeline: [
      { year: "2000s", title: "Compton Raised. Separately.", body: "Boylan and Houston grew up in Compton but didn\u2019t know each other. Both were deep into music from early \u2014 one through church choir, one through his older brother\u2019s rap tapes. Their paths crossed years later through a mutual friend at a house party in 2019." },
      { year: "2019", title: "One Session. Everything Clicks.", body: "First studio session together runs six hours. They record four songs in one night. Neither of them had ever made something that felt that effortless with anyone else. They don\u2019t talk about it much afterward \u2014 they just keep showing up." },
      { year: "2020", title: "Dropped Online. No Context.", body: "Posted their first project with no bio, no photos, no social media presence. Just music and a name. Music blogs scrambled to figure out who they were. The mystery made people listen harder." },
      { year: "2022", title: "Coachella. Then Quiet Again.", body: "Booked for Coachella before most people had heard of them. Played to a packed tent. Walked off stage and went dark for six months. No posts, no interviews. Let the set speak." },
      { year: "Now", title: "Built Different. Staying That Way.", body: "One of the most talked-about acts in independent rap without ever chasing the spotlight. Debut album landed on dozens of year-end lists. They still answer to no one." },
    ],
  },
];

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
              onClick={() => setSelectedArtist(ARTISTS[i])}
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
