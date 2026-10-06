import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";

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
            color: "#9a9a9a",
            marginBottom: "1.5rem",
          }}
        >
          Press, partnerships, and artist inquiries.
        </p>

        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <ContactForm />
        </div>

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
