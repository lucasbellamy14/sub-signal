"use client";

import Link from "next/link";
import Image from "next/image";
import type { Artist } from "@/lib/artists";
import PlaceholderImage from "./PlaceholderImage";

interface ArtistCardProps {
  artist: Artist;
  index: number;
  view: "grid" | "feed";
}

/**
 * ArtistCard — each artist in the roster grid gets one of these.
 * Shows their photo, name, role, genre tags, and key stats.
 * Clicking it takes you to their full profile page.
 *
 * Has two layouts:
 * - "grid": compact card (used in the grid view)
 * - "feed": wider horizontal card (used in the list/feed view)
 */
export default function ArtistCard({ artist, index, view }: ArtistCardProps) {
  if (view === "feed") {
    return (
      <Link
        href={`/artist/${artist.slug}`}
        className={`group block bg-card border border-border rounded-xl overflow-hidden hover:border-accent/40 hover:shadow-[0_0_30px_#00e5a010] transition-all duration-300 animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 9)}`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Photo */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
            {artist.hasPhoto ? (
              <Image
                src={artist.photo}
                alt={artist.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            ) : (
              <PlaceholderImage name={artist.name} className="group-hover:scale-105 transition-transform duration-500" />
            )}
          </div>
          {/* Info */}
          <div className="p-5 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              {artist.featured && (
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              )}
              <h3 className="font-heading font-700 text-xl text-text-primary group-hover:text-accent transition-colors">
                {artist.name}
              </h3>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-text-secondary mb-3">
              {artist.role}
            </p>
            <p className="text-sm text-text-secondary mb-3 line-clamp-2">
              {artist.notable}
            </p>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-accent">
                {artist.monthlyListeners} listeners
              </span>
              <div className="flex gap-1.5">
                {artist.genre.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-border text-text-secondary"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link
      href={`/artist/${artist.slug}`}
      className={`group block bg-card border border-border rounded-xl overflow-hidden hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_#00e5a015] transition-all duration-300 animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 9)}`}
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {artist.hasPhoto ? (
          <Image
            src={artist.photo}
            alt={artist.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <PlaceholderImage name={artist.name} className="group-hover:scale-105 transition-transform duration-500" />
        )}
        {/* Gradient at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Featured badge */}
        {artist.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-bg/70 backdrop-blur px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Info area below photo */}
      <div className="p-4">
        <h3 className="font-heading font-700 text-lg text-text-primary group-hover:text-accent transition-colors mb-1">
          {artist.name}
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-secondary mb-3">
          {artist.role}
        </p>

        {/* Genre tags */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {artist.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-border text-text-secondary"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="font-mono text-[10px] text-text-secondary">
            <span className="text-accent">{artist.monthlyListeners}</span>{" "}
            listeners
          </span>
          <span className="font-mono text-[10px] text-text-secondary">
            {artist.igFollowers} IG
          </span>
        </div>
      </div>
    </Link>
  );
}
