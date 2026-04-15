import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <section
        style={{
          padding: "8rem 2rem 6rem",
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center" as const,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            textTransform: "uppercase",
            color: "#f0f0f0",
            lineHeight: 0.95,
            margin: "0 0 2rem",
          }}
        >
          Contact
        </h1>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#555",
            marginBottom: "1.5rem",
          }}
        >
          Press, partnerships, and artist inquiries.
        </p>

        <a
          href="mailto:hello@subsignal.fm"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(1.2rem, 4vw, 2rem)",
            letterSpacing: "0.1em",
            color: "#39ff5a",
            textDecoration: "none",
            borderBottom: "2px solid #1e4a28",
            paddingBottom: "0.25rem",
            transition: "border-color 0.2s",
          }}
        >
          hello@subsignal.fm
        </a>

        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SocialLinks
            instagram="https://instagram.com/subsignal"
            twitter="https://x.com/subsignal"
            tiktok="https://tiktok.com/@subsignal"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
