"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FIELDS = [
  { name: "artistName", label: "Artist Name", type: "text" },
  { name: "genre", label: "Genre", type: "text" },
  { name: "streamingLink", label: "Streaming Link", type: "url" },
  { name: "bio", label: "Short Bio", type: "textarea" },
  { name: "email", label: "Contact Email", type: "email" },
] as const;

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-display)",
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#555",
  marginBottom: "0.5rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#111",
  border: "1px solid #1a1a1a",
  color: "#f0f0f0",
  fontFamily: "var(--font-body)",
  fontWeight: 300,
  fontSize: "0.9rem",
  padding: "0.75rem 1rem",
  borderRadius: 0,
  outline: "none",
  transition: "border-color 0.2s",
};

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#39ff5a";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#1a1a1a";
  };

  return (
    <>
      <Header />

      <section className="section-hero">
        <h1 className="hero-headline" style={{ marginBottom: "1rem" }}>
          Submit Your <span style={{ color: "#39ff5a" }}>Music</span>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "1rem",
            color: "#777",
            margin: 0,
          }}
        >
          We listen to everything. We feature what moves us.
        </p>
      </section>

      <section className="section-featured">
        {submitted ? (
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              color: "#39ff5a",
              margin: 0,
            }}
          >
            We got it. We&apos;ll be in touch.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {FIELDS.map((field) => (
              <div key={field.name}>
                <label style={labelStyle}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={4}
                    required
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                )}
              </div>
            ))}

            <div>
              <button
                type="submit"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  background: "#39ff5a",
                  color: "#0a0a0a",
                  padding: "0.75rem 2rem",
                  border: "none",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </section>

      <Footer />
    </>
  );
}
