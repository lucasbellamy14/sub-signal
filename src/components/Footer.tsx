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

          {/* Tagline */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              color: "#555",
              letterSpacing: "0.1em",
            }}
          >
            Spotlighting artists before they break through
          </p>

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
