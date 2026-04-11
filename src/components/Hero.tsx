"use client";

import Link from "next/link";
import Image from "next/image";
import type { Artist } from "@/lib/artists";
import PlaceholderImage from "./PlaceholderImage";

interface HeroProps {
  artist: Artist;
}

/**
 * Hero section — the big featured artist spotlight at the top of the homepage.
 * Shows a large photo, the artist's name, role, and a "Read Their Story" button.
 */
export default function Hero({ artist }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        {artist.hasPhoto ? (
          <Image
            src={artist.photo}
            alt={artist.name}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        ) : (
          <PlaceholderImage name={artist.name} />
        )}
        {/* Dark gradient so text is readable over the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24">
        <div className="max-w-2xl animate-fade-in-up">
          {/* Week label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-glow" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Featured · {artist.week}
            </span>
          </div>

          {/* Artist name */}
          <h1 className="font-heading font-800 text-5xl sm:text-7xl lg:text-8xl text-text-primary mb-4 leading-[0.95]">
            {artist.name}
          </h1>

          {/* Role */}
          <p className="font-mono text-sm uppercase tracking-wider text-text-secondary mb-6">
            {artist.role}
          </p>

          {/* Notable moment */}
          <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-lg">
            {artist.notable}
          </p>

          {/* Stats */}
          <div className="flex gap-6 mb-10">
            <div className="bg-card/60 backdrop-blur border border-border rounded-lg px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Monthly Listeners
              </p>
              <p className="font-heading font-700 text-xl text-accent">
                {artist.monthlyListeners}
              </p>
            </div>
            <div className="bg-card/60 backdrop-blur border border-border rounded-lg px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                IG Followers
              </p>
              <p className="font-heading font-700 text-xl text-text-primary">
                {artist.igFollowers}
              </p>
            </div>
          </div>

          {/* CTA button */}
          <Link
            href={`/artist/${artist.slug}`}
            className="inline-flex items-center gap-2 bg-accent text-bg font-heading font-700 px-8 py-4 rounded-lg hover:shadow-[0_0_30px_#00e5a040] hover:scale-105 transition-all duration-300"
          >
            Read Their Story
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
