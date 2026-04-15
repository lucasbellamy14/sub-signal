"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ARTISTS } from "@/data/artists";

const NAV_LINKS = [
  { label: "Discover", href: "/discover" },
  { label: "Submit", href: "/submit" },
];

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#777"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchFocused(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Filter artists by name or meta (genre/location)
  const results = searchQuery.trim()
    ? ARTISTS.filter((a) => {
        const q = searchQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.meta.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const showDropdown = searchFocused && results.length > 0;

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
        <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Search */}
          <div ref={searchRef} style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: searchFocused ? "#111" : "transparent",
                border: searchFocused ? "1px solid #222" : "1px solid transparent",
                borderRadius: "4px",
                padding: "0.35rem 0.5rem",
                transition: "all 0.3s ease",
                width: searchFocused ? "240px" : "30px",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => {
                setSearchFocused(true);
                inputRef.current?.focus();
              }}
            >
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  if (!searchQuery) {
                    setTimeout(() => setSearchFocused(false), 200);
                  }
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f0f0f0",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  width: searchFocused ? "100%" : "0",
                  opacity: searchFocused ? 1 : 0,
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: "4px",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                {results.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    onClick={() => {
                      setSearchQuery("");
                      setSearchFocused(false);
                    }}
                    style={{
                      display: "block",
                      padding: "0.6rem 0.75rem",
                      textDecoration: "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1a1a1a";
                      const name = e.currentTarget.querySelector(".search-name") as HTMLElement;
                      if (name) name.style.color = "#39ff5a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      const name = e.currentTarget.querySelector(".search-name") as HTMLElement;
                      if (name) name.style.color = "#f0f0f0";
                    }}
                  >
                    <span
                      className="search-name"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#f0f0f0",
                        transition: "color 0.15s",
                      }}
                    >
                      {artist.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.1em",
                        color: "#555",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {artist.meta.split("·")[1]?.trim()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

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
