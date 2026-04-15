"use client";

interface SocialLinksProps {
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  spotify?: string;
  size?: number;
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.48a8.14 8.14 0 0 0 4.76 1.52V7.56a4.84 4.84 0 0 1-1-.87z" />
    </svg>
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SpotifyIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function SocialLinks({
  instagram,
  tiktok,
  twitter,
  spotify,
  size = 18,
}: SocialLinksProps) {
  const hasAny = instagram || tiktok || twitter || spotify;
  if (!hasAny) return null;

  const links: { href: string; icon: React.ReactNode; label: string }[] = [];

  if (instagram) {
    links.push({ href: instagram, icon: <InstagramIcon size={size} />, label: "Instagram" });
  }
  if (tiktok) {
    links.push({ href: tiktok, icon: <TikTokIcon size={size} />, label: "TikTok" });
  }
  if (twitter) {
    links.push({ href: twitter, icon: <XIcon size={size} />, label: "X" });
  }
  if (spotify) {
    links.push({ href: spotify, icon: <SpotifyIcon size={size} />, label: "Spotify" });
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          style={{
            color: "#aaa",
            transition: "color 0.2s",
            cursor: "pointer",
            display: "inline-flex",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#39ff5a")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
