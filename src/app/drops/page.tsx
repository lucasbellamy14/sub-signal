import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DROPS } from "@/data/drops";

export const metadata = {
  title: "Drops",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DropsPage() {
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
          Archive
        </p>

        <h1 className="hero-headline">
          Past <span style={{ color: "#39ff5a" }}>Drops</span>
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
          Every edition of Sub Signal, collected. Each drop spotlights a handful
          of artists we believe in.
        </p>
      </section>

      <section
        style={{
          padding: "0 2.5rem 5rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {DROPS.map((drop, i) => (
          <Link
            key={drop.id}
            href={`/drops/${drop.id}`}
            style={{
              display: "block",
              textDecoration: "none",
              borderTop: i === 0 ? "1px solid #1a1a1a" : "none",
              borderBottom: "1px solid #1a1a1a",
              padding: "2rem 0",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "0.75rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#e8e8e8",
                }}
              >
                {drop.title}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#39ff5a",
                }}
              >
                {formatDate(drop.date)}
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.85rem",
                color: "#555",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {drop.summary}
            </p>
          </Link>
        ))}
      </section>

      <Footer />
    </>
  );
}
