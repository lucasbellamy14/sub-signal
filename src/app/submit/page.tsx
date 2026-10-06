"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { postForm, formsConfigured, NOT_CONNECTED_MESSAGE } from "@/lib/forms";

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
  color: "#9a9a9a",
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (data._gotcha) return; // a bot filled the hidden field
    delete data._gotcha;

    setSending(true);
    setError("");
    const result = await postForm("submit", data);
    setSending(false);
    if (result.ok) setSubmitted(true);
    else setError(result.error === "not-configured" ? NOT_CONNECTED_MESSAGE : result.error);
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
            color: "#b0b0b0",
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
        ) : !formsConfigured ? (
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "#b0b0b0", maxWidth: "600px", margin: 0 }}>
            Submissions aren&apos;t open just yet. Check back soon.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />
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
                {sending ? "Sending…" : "Submit"}
              </button>
              {error && (
                <p role="alert" style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#ff5a5a", marginTop: "1rem" }}>
                  {error}
                </p>
              )}
            </div>
          </form>
        )}
      </section>

      <Footer />
    </>
  );
}
