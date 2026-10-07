import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import OriginMap from "./OriginMap";

export const metadata: Metadata = {
  title: "Origin Map",
  description: "Where every artist on Sub Signal is from. Tap a pin to meet the artists who started there.",
};

export default function MapPage() {
  return (
    <>
      <Header />

      <section className="section-hero" style={{ paddingBottom: "2.5rem" }}>
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
          Origin Map &middot; Where It Starts
        </p>

        <h1 className="hero-headline animate-fade-in-up stagger-2">
          Where it <span style={{ color: "#39ff5a" }}>starts</span>
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
          Every artist, pinned to the place their story begins. Tap a pin, meet who came from there.
        </p>
      </section>

      <OriginMap />

      <Newsletter />
      <Footer />
    </>
  );
}
