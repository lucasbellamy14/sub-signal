import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Roster from "@/components/Roster";
import { getAllArtists } from "@/lib/artists";

export default function ArtistsPage() {
  const allArtists = getAllArtists().map((a) => a.data);

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
          Every artist we&apos;ve featured
        </p>

        <h1 className="hero-headline">
          The <span style={{ color: "#39ff5a" }}>Roster</span>
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
          }}
        >
          From day one. Every signal we&apos;ve picked up, searchable and
          filterable.
        </p>
      </section>

      {allArtists.length > 0 ? (
        <Roster artists={allArtists} />
      ) : (
        <section className="section-featured">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              color: "#555",
              textAlign: "center",
              padding: "4rem 0",
            }}
          >
            Artists coming soon. Check back.
          </p>
        </section>
      )}

      <Footer />
    </>
  );
}
