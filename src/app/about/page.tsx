import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import SocialLinks from "@/components/SocialLinks";
import { TICKER_ARTISTS } from "@/data/artists";

export const metadata = {
  title: "About",
  description:
    "Sub Signal is built for people who want to hear it first. Music obsessive Lucas Bellamy on why 3 to 5 artists a month beats 50.",
};

const LABEL_STYLE = {
  fontFamily: "var(--font-display)",
  fontSize: "0.7rem",
  letterSpacing: "0.25em",
  textTransform: "uppercase" as const,
  color: "#555",
  marginBottom: "1.25rem",
  marginTop: 0,
};

const PROSE_STYLE = {
  fontFamily: "var(--font-body)",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "#f0f0f0",
  margin: "0 0 1rem",
};

export default function AboutPage() {
  const tickerText = TICKER_ARTISTS.join(" \u00b7 ");

  return (
    <>
      <Header />

      {/* 1. HERO with animated ticker background */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "6rem 2.5rem 5rem",
        }}
      >
        {/* Dimmed ticker background */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            opacity: 0.15,
            pointerEvents: "none",
            zIndex: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <div
            className="animate-marquee"
            style={{ display: "inline-flex", width: "max-content" }}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#f0f0f0",
                  marginRight: "2rem",
                }}
              >
                {tickerText}
                <span style={{ color: "#39ff5a", margin: "0 1rem" }}>
                  &middot;
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Foreground */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.75rem, 6vw, 4rem)",
              textTransform: "uppercase",
              color: "#f0f0f0",
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            About Sub Signal
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.375rem",
              fontWeight: 400,
              color: "#39ff5a",
              letterSpacing: "0.03em",
              marginTop: "1rem",
              marginBottom: 0,
            }}
          >
            Before the world knows.
          </p>
        </div>
      </section>

      {/* 2. WHAT THIS IS */}
      <section
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "3rem 2rem 0",
        }}
      >
        <p style={LABEL_STYLE}>What This Is</p>
        <p style={PROSE_STYLE}>
          Sub Signal is built for people who want to hear it first.
        </p>
        <p style={PROSE_STYLE}>
          We don&apos;t follow charts. We listen — to demos, to SoundCloud links
          sent at 2am, to the friend-of-a-friend who swears their cousin is
          going to blow up. Then we feature what actually moves us.
        </p>
      </section>

      {/* 3. HOW WE PICK */}
      <section
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "2.5rem 2rem 0",
        }}
      >
        <p style={LABEL_STYLE}>How We Pick</p>
        <p style={PROSE_STYLE}>
          We feature 3 to 5 artists a month, not 50. Each one gets real depth —
          a profile, a story, the timeline. If an artist is on Sub Signal,
          it&apos;s because we believe in them. Full stop.
        </p>
      </section>

      {/* 4. FOUNDER */}
      <section
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "2.5rem 2rem 0",
        }}
      >
        <p style={LABEL_STYLE}>Founder</p>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Placeholder portrait */}
          <div
            style={{
              width: 120,
              height: 120,
              background: "#1a1a1a",
              borderRadius: 8,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#555",
              letterSpacing: "0.15em",
            }}
          >
            LB
          </div>
          {/* Text column */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#f0f0f0",
                lineHeight: 1.2,
              }}
            >
              Lucas Bellamy
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "#777",
                marginTop: "0.35rem",
                marginBottom: "0.75rem",
              }}
            >
              Music obsessive based in Los Angeles.
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "#f0f0f0",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Sub Signal started because the music I was finding wasn&apos;t
              being written about anywhere worth reading. So I built somewhere
              worth reading.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SUBMIT CTA */}
      <section
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "2.5rem 2rem 0",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "#f0f0f0",
            marginTop: 0,
            marginBottom: "1.25rem",
          }}
        >
          Got an artist we should hear?
        </p>
        <Link
          href="/submit"
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
          Submit an artist
        </Link>
      </section>

      {/* 6. PERSONAL NOTE */}
      <section
        style={{
          maxWidth: "520px",
          margin: "3rem auto 0",
          padding: "2rem 2rem 0",
          textAlign: "center",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "#888",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          I&apos;m doing this in real time, in public. Some weeks the picks
          will surprise you. Some weeks they&apos;ll be obvious. But every
          artist on here is one I believed in early — and I&apos;d rather be
          right early than safe late.
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            color: "#39ff5a",
            marginTop: "1rem",
            marginBottom: 0,
            letterSpacing: "0.05em",
          }}
        >
          — Lucas
        </p>
      </section>

      {/* 7. SOCIAL ICON ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <SocialLinks
          instagram="https://instagram.com/subsignal"
          twitter="https://x.com/subsignal"
          tiktok="https://tiktok.com/@subsignal"
        />
      </div>

      {/* 8. EST. LINE */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          color: "#555",
          textAlign: "center",
          marginTop: "1.5rem",
          marginBottom: "2rem",
          textTransform: "uppercase",
        }}
      >
        Sub Signal &middot; Independent &middot; Est. 2026
      </div>

      {/* 9. NEWSLETTER (below the fold) */}
      <div style={{ height: 80 }} />
      <Newsletter />

      <Footer />
    </>
  );
}
