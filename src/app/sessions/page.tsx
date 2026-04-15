"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoEmbed, { VideoThumbnail } from "@/components/VideoEmbed";
import { SESSIONS } from "@/data/sessions";
import { ARTISTS } from "@/data/artists";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function SessionsPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null);

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
          Live &middot; Studio &middot; Performance
        </p>

        <h1 className="hero-headline">
          <span style={{ color: "#39ff5a" }}>Sessions</span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.95rem",
            color: "#b0b0b0",
            maxWidth: "420px",
            lineHeight: 1.7,
            marginTop: "2rem",
          }}
        >
          Live performances and studio sessions from the artists on our radar.
          Click any thumbnail to watch.
        </p>
      </section>

      <section
        style={{
          padding: "0 2.5rem 5rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {SESSIONS.map((session) => {
            const artist = ARTISTS.find((a) => a.slug === session.artistSlug);
            const isActive = activeSession === session.id;

            return (
              <div key={session.id}>
                {/* Video area — thumbnail or embed */}
                {isActive ? (
                  <VideoEmbed
                    url={session.videoUrl}
                    title={`${artist?.name ?? "Artist"} — ${session.songTitle}`}
                  />
                ) : (
                  <div
                    onClick={() => setActiveSession(session.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <VideoThumbnail
                      url={session.videoUrl}
                      alt={`${artist?.name ?? "Artist"} — ${session.songTitle}`}
                    />
                  </div>
                )}

                {/* Info below thumbnail */}
                <div style={{ padding: "1rem 0" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#e8e8e8",
                      }}
                    >
                      {artist?.name ?? "Unknown"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#39ff5a",
                      }}
                    >
                      {formatDate(session.recordingDate)}
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      color: "#b0b0b0",
                      marginBottom: "0.25rem",
                    }}
                  >
                    &ldquo;{session.songTitle}&rdquo;
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#333",
                    }}
                  >
                    {session.venue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}
