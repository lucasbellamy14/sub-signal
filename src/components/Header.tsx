"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Discover", href: "/discover" },
  { label: "Submit", href: "/submit" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header-nav">
      <div className="header-inner">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "#f0f0f0",
            }}
          >
            SUB SIGNAL
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                color: "#777",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#39ff5a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger button */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="nav-mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                textTransform: "uppercase" as const,
                letterSpacing: "0.18em",
                color: "#777",
                textDecoration: "none",
                display: "block",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#39ff5a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
