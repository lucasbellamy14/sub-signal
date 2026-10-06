"use client";

import { useState } from "react";
import { postForm, formsConfigured } from "@/lib/forms";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || sending) return;
    const honeypot = (new FormData(e.currentTarget).get("_gotcha") as string) || "";
    if (honeypot) return; // a bot filled the hidden field

    setSending(true);
    const result = await postForm("newsletter", { email });
    setSending(false);

    if (result.ok) {
      setSubmitted(true);
      setEmail("");
      setError("");
    } else {
      setError(result.error);
    }
  };

  return (
    <section
      id="newsletter"
      style={{
        borderTop: "1px solid #1a1a1a",
        background: "#0e0e0e",
        padding: "5rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#9a9a9a",
            marginBottom: "1.5rem",
          }}
        >
          Catch the Signal
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.85rem",
            color: "#b0b0b0",
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}
        >
          New artist drops every 2-3 days. Get them in your inbox before anyone
          else.
        </p>

        {submitted ? (
          <div
            style={{
              border: "1px solid #1e4a28",
              padding: "1rem 1.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#39ff5a",
              }}
            >
              You&apos;re locked in. First signal incoming soon.
            </p>
          </div>
        ) : !formsConfigured ? (
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#9a9a9a",
              border: "1px dashed #1a1a1a",
              padding: "1rem 1.5rem",
            }}
          >
            Newsletter signups open soon.
          </p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", gap: "1px", maxWidth: "400px", margin: "0 auto" }}
            >
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  padding: "0.75rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.8rem",
                  color: "#f0f0f0",
                  outline: "none",
                  borderRadius: 0,
                }}
              />
              <button
                type="submit"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "#39ff5a",
                  color: "#0a0a0a",
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                {sending ? "Sending…" : "Subscribe"}
              </button>
            </form>
            {error && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  color: "#ff5a5a",
                  marginTop: "0.75rem",
                }}
              >
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
