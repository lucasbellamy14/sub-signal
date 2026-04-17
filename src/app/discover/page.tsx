import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import DiscoverFeatured from "./DiscoverFeatured";

export default function DiscoverPage() {
  return (
    <>
      <Header />

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
          Discover New <span style={{ color: "#39ff5a" }}>Sound</span>
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
          }}
        >
          Origin stories of artists at the edge of breaking. Click any card to
          explore their timeline.
        </p>
      </section>

      <DiscoverFeatured />

      <Newsletter />
      <Footer />
    </>
  );
}
