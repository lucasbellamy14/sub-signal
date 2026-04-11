"use client";

import Link from "next/link";

/**
 * Signal bars icon — the little animated bars next to the logo.
 * These pulse to give a "receiving signal" vibe.
 */
function SignalBars() {
  return (
    <div className="flex items-end gap-[3px] h-5">
      <div className="w-[3px] h-[6px] bg-accent rounded-sm animate-signal-pulse" />
      <div
        className="w-[3px] h-[10px] bg-accent rounded-sm animate-signal-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-[3px] h-[14px] bg-accent rounded-sm animate-signal-pulse"
        style={{ animationDelay: "0.4s" }}
      />
      <div
        className="w-[3px] h-[18px] bg-accent rounded-sm animate-signal-pulse"
        style={{ animationDelay: "0.6s" }}
      />
    </div>
  );
}

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo area */}
        <Link href="/" className="flex items-center gap-3 group">
          <SignalBars />
          <span className="font-heading font-800 text-xl tracking-tight text-text-primary group-hover:text-accent transition-colors">
            Sub Signal
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
          >
            Roster
          </Link>
          <a
            href="#newsletter"
            className="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
          >
            Subscribe
          </a>
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="font-mono text-[10px] uppercase text-accent tracking-wider">
              Live
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
