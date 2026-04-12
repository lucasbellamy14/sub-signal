import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Hero from "@/components/Hero";
import ArtistCard from "@/components/ArtistCard";
import { getAllArtists, getFeaturedArtist } from "@/lib/artists";
import DiscoverFeatured from "./DiscoverFeatured";

export default function DiscoverPage() {
  const featured = getFeaturedArtist();
  const allArtists = getAllArtists().map((a) => a.data);

  return (
    <>
      <Header />

      {featured ? (
        <Hero artist={featured.data} />
      ) : (
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
            Discover New <span style={{ color: "#39ff5a" }}>Sound</span>
          </h1>
        </section>
      )}

      {/* This Week's Picks — client component with timeline modal */}
      <DiscoverFeatured />

      {/* All Artists */}
      {allArtists.length > 0 && (
        <section className="section-featured">
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
              All Artists
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArtists.map((artist, i) => (
              <ArtistCard key={artist.slug} artist={artist} index={i} view="grid" />
            ))}
          </div>
        </section>
      )}

      <Newsletter />
      <Footer />
    </>
  );
}
