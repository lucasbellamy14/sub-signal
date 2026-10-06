"use client";

import { useState } from "react";
import { postForm, formsConfigured } from "@/lib/forms";

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
};

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  if (!formsConfigured) {
    return (
      <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "#b0b0b0", margin: 0 }}>
        Our contact form is being set up. Please check back soon.
      </p>
    );
  }

  if (status === "done") {
    return (
      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#39ff5a", margin: 0 }}>
        Message sent. We&apos;ll get back to you.
      </p>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (data._gotcha) return; // a bot filled the hidden field
    delete data._gotcha;

    setStatus("sending");
    setError("");
    const result = await postForm("contact", data);
    if (result.ok) setStatus("done");
    else {
      setStatus("idle");
      setError(result.error);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "left" }}>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />
      <div>
        <label htmlFor="c-name" style={labelStyle}>Name</label>
        <input id="c-name" name="name" type="text" required style={inputStyle} />
      </div>
      <div>
        <label htmlFor="c-email" style={labelStyle}>Email</label>
        <input id="c-email" name="email" type="email" required style={inputStyle} />
      </div>
      <div>
        <label htmlFor="c-message" style={labelStyle}>Message</label>
        <textarea id="c-message" name="message" rows={5} required style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div>
        <button
          type="submit"
          disabled={status === "sending"}
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
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        {error && (
          <p role="alert" style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#ff5a5a", marginTop: "1rem" }}>
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
