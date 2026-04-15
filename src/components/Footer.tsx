export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#777",
            }}
          >
            SUB SIGNAL
          </span>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <a
              href="/discover"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#555",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Discover
            </a>
            <a
              href="/read"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#555",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Read
            </a>
            <a
              href="/sessions"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#555",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Sessions
            </a>
            <a
              href="/saved"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#555",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Saved
            </a>
            <a
              href="/contact"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#555",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              color: "#333",
            }}
          >
            &copy; {new Date().getFullYear()} Sub Signal
          </p>
        </div>
      </div>
    </footer>
  );
}
