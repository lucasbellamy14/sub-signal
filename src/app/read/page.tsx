"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { POSTS } from "@/data/interviews";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Filter = "all" | "interview" | "article";

export default function ReadPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? POSTS : POSTS.filter((p) => p.type === filter);

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Interviews", value: "interview" },
    { label: "Articles", value: "article" },
  ];

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
          Stories &middot; Interviews &middot; Features
        </p>

        <h1 className="hero-headline">
          <span style={{ color: "#39ff5a" }}>Read</span>
        </h1>

        <p
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
          Long-form features, interviews, and deep dives into the artists we
          believe in.
        </p>
      </section>

      <section
        style={{
          padding: "0 2.5rem 5rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            borderBottom: "1px solid #1a1a1a",
            paddingBottom: "1rem",
            marginBottom: "2rem",
          }}
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: filter === f.value ? "#39ff5a" : "#555",
                cursor: "pointer",
                padding: "0.25rem 0",
                borderBottom:
                  filter === f.value ? "2px solid #39ff5a" : "2px solid transparent",
                transition: "color 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Post list */}
        {filtered.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#333",
              textAlign: "center",
              padding: "3rem 0",
            }}
          >
            No posts yet
          </p>
        ) : (
          filtered.map((post, i) => (
            <Link
              key={post.id}
              href={`/read/${post.id}`}
              style={{
                display: "block",
                textDecoration: "none",
                borderTop: i === 0 ? "1px solid #1a1a1a" : "none",
                borderBottom: "1px solid #1a1a1a",
                padding: "2rem 0",
                transition: "background 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Type badge */}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: post.type === "interview" ? "#39ff5a" : "#777",
                    border: `1px solid ${post.type === "interview" ? "#1e4a28" : "#222"}`,
                    padding: "0.2rem 0.5rem",
                  }}
                >
                  {post.type}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#39ff5a",
                  }}
                >
                  {formatDate(post.date)}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#e8e8e8",
                  margin: "0 0 0.5rem",
                }}
              >
                {post.title}
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.85rem",
                  color: "#9a9a9a",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {post.summary}
              </p>
            </Link>
          ))
        )}
      </section>

      <Footer />
    </>
  );
}
