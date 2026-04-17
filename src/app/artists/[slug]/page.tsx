import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTISTS } from "@/data/artists";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import SaveButton from "@/components/SaveButton";

export function generateStaticParams() {
  return ARTISTS.map((artist) => ({ slug: artist.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const artist = ARTISTS.find((a) => a.slug === params.slug);
  if (!artist) return { title: "Artist Not Found — Sub Signal" };
  return {
    title: `${artist.name} — Sub Signal`,
    openGraph: {
      title: `${artist.name} — Sub Signal`,
      description: artist.cardBody,
      type: "article",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${artist.name} — Sub Signal`,
      description: artist.cardBody,
    },
  };
}

export default function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = ARTISTS.find((a) => a.slug === params.slug);
  if (!artist) notFound();

  return (
    <>
      <Header />

      {/* Hero Image */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "6rem 2rem 0" }}>
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            position: "relative",
            overflow: "hidden",
            marginBottom: "0",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/artists/${artist.slug}.svg`}
            alt={artist.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>
        <div style={{ height: "1px", background: "rgba(57,255,90,0.15)", marginBottom: "2rem" }} />
      </div>

      {/* Hero */}
      <section
        style={{
          padding: "0 2rem 3rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#39ff5a",
            marginBottom: "1rem",
          }}
        >
          {artist.cardTag}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "0 0 1.5rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              textTransform: "uppercase",
              color: "#f0f0f0",
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            {artist.name}
          </h1>
          <SaveButton slug={artist.slug} size={24} />
        </div>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9a9a9a",
            marginBottom: "1rem",
          }}
        >
          {artist.meta}
        </p>

        {/* Genre Tags */}
        {artist.genres && artist.genres.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "2rem" }}>
            {artist.genres.map((genre) => (
              <span
                key={genre}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#b0b0b0",
                  border: "1px solid #222",
                  padding: "0.3rem 0.7rem",
                }}
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginBottom: "2rem" }}>
          <SocialLinks
            instagram={artist.instagram}
            tiktok={artist.tiktok}
            twitter={artist.twitter}
            spotify={artist.spotify}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "1rem",
            color: "#b8b8b8",
            lineHeight: 1.7,
            maxWidth: "600px",
            marginBottom: "3rem",
          }}
        >
          {artist.cardBody}
        </p>

        {/* Spotify Player */}
        {artist.spotifyTrackId && (
          <div style={{ marginBottom: "3rem" }}>
            <iframe
              src={`https://open.spotify.com/embed/track/${artist.spotifyTrackId}?utm_source=generator&theme=0`}
              width="100%"
              height={352}
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{
                borderRadius: "12px",
                border: "none",
                background: "transparent",
                display: "block",
              }}
            />
          </div>
        )}
      </section>

      {/* Timeline */}
      <section
        style={{
          padding: "0 2rem 4rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#9a9a9a",
            borderBottom: "1px solid #1a1a1a",
            paddingBottom: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          Timeline
        </div>

        {artist.timeline.map((entry, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "2rem",
              marginBottom: "2.5rem",
              alignItems: "flex-start",
            }}
          >
            {/* Year */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "#39ff5a",
                minWidth: "60px",
                paddingTop: "0.15rem",
              }}
            >
              {entry.year}
            </div>

            {/* Dot + line */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "0.3rem",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#39ff5a",
                  flexShrink: 0,
                }}
              />
              {i < artist.timeline.length - 1 && (
                <div
                  style={{
                    width: "1px",
                    flex: 1,
                    background: "#39ff5a",
                    opacity: 0.2,
                    minHeight: "40px",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  color: "#e8e8e8",
                  margin: "0 0 0.5rem",
                }}
              >
                {entry.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.85rem",
                  color: "#666",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {entry.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Back link */}
      <div
        style={{
          padding: "0 2rem 4rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Link
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
          &larr; Back to Discover
        </Link>
      </div>

      <Footer />
    </>
  );
}
