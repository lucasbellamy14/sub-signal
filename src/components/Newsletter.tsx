"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
        setEmail("");
        setError("");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      setError("Could not connect. Try again.");
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
            color: "#555",
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
            color: "#777",
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
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", gap: "1px", maxWidth: "400px", margin: "0 auto" }}
            >
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
                Subscribe
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
