import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DROPS } from "@/data/drops";
import { ARTISTS } from "@/data/artists";

export function generateStaticParams() {
  return DROPS.map((drop) => ({ id: drop.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const drop = DROPS.find((d) => d.id === params.id);
  if (!drop) return { title: "Drop Not Found — Sub Signal" };
  return {
    title: drop.title,
    openGraph: {
      title: `${drop.title} — Sub Signal`,
      description: drop.summary,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DropDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const drop = DROPS.find((d) => d.id === params.id);
  if (!drop) notFound();

  const featuredArtists = drop.featuredArtistSlugs
    .map((slug) => ARTISTS.find((a) => a.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Header />

      {/* Hero */}
      <section
        style={{
          padding: "6rem 2rem 3rem",
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
          {formatDate(drop.date)}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            textTransform: "uppercase",
            color: "#f0f0f0",
            lineHeight: 0.95,
            margin: "0 0 1.5rem",
          }}
        >
          {drop.title}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "1rem",
            color: "#888",
            lineHeight: 1.7,
            maxWidth: "600px",
            marginBottom: "3rem",
          }}
        >
          {drop.summary}
        </p>
      </section>

      {/* Featured Artists Grid */}
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
            color: "#555",
            borderBottom: "1px solid #1a1a1a",
            paddingBottom: "1rem",
            marginBottom: "2rem",
          }}
        >
          Featured Artists
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1px",
            background: "#1a1a1a",
          }}
        >
          {featuredArtists.map((artist) =>
            artist ? (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                style={{
                  display: "block",
                  background: "#0a0a0a",
                  padding: "2rem",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: "#333",
                    marginBottom: "1rem",
                  }}
                >
                  {artist.cardNumber}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    textTransform: "uppercase",
                    color: "#e8e8e8",
                    lineHeight: 1.1,
                    margin: "0 0 0.5rem",
                  }}
                >
                  {artist.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#555",
                    margin: 0,
                  }}
                >
                  {artist.meta.split("·")[1]?.trim()}
                </p>
              </Link>
            ) : null
          )}
        </div>
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
          href="/drops"
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
          &larr; All Drops
        </Link>
      </div>

      <Footer />
    </>
  );
}
