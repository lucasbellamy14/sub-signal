"use client";

import { useState } from "react";

/**
 * Newsletter signup section.
 * Right now it doesn't actually send emails — it just shows a success message.
 * Later you can connect it to Mailchimp, ConvertKit, etc.
 */
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
      className="border-t border-border bg-card/30 py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-xl mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.788m13.788 0c3.808 3.808 3.808 9.98 0 13.788M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="font-heading font-700 text-3xl text-text-primary mb-3">
            Catch the Signal
          </h2>
          <p className="font-mono text-sm text-text-secondary mb-8">
            New artist drops every 2-3 days. Get them in your inbox before
            anyone else.
          </p>

          {submitted ? (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-6 py-4 animate-fade-in">
              <p className="font-mono text-sm text-accent">
                You&apos;re locked in. First signal incoming soon.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="bg-accent text-bg font-heading font-700 px-6 py-3 rounded-lg hover:shadow-[0_0_20px_#00e5a040] hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              {error && (
                <p className="font-mono text-xs text-red-400 mt-3">{error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
