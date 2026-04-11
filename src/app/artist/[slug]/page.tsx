import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllArtists, getArtistBySlug } from "@/lib/artists";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaceholderImage from "@/components/PlaceholderImage";
import PageTransition from "@/components/PageTransition";

/**
 * This tells Next.js all the possible artist page URLs ahead of time.
 * For example, if you have artists with slugs "kaia-luna" and "jordi-waves",
 * it creates /artist/kaia-luna and /artist/jordi-waves as real pages.
 */
export function generateStaticParams() {
  const artists = getAllArtists();
  return artists.map((a) => ({ slug: a.data.slug }));
}

/**
 * Sets the page title to the artist's name (shown in the browser tab).
 */
export function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = getArtistBySlug(params.slug);
  if (!entry) return { title: "Artist Not Found" };
  const { data: artist } = entry;
  const description = `${artist.name} — ${artist.role}. ${artist.notable}`;
  return {
    title: artist.name,
    description,
    openGraph: {
      title: `${artist.name} — Sub Signal`,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${artist.name} — Sub Signal`,
      description,
    },
  };
}

/**
 * The full artist profile page.
 *
 * Sections:
 * 1. Hero image with gradient overlay
 * 2. Name, role, date, stats, tags
 * 3. "Who They Are" bio
 * 4. "Before The Signal" origin story (the heart of the site)
 * 5. Timeline
 * 6. Spotify embed
 * 7. Social links
 * 8. Back button
 */
export default function ArtistPage({ params }: { params: { slug: string } }) {
  const entry = getArtistBySlug(params.slug);
  if (!entry) notFound();

  const { data: artist, content } = entry;

  // Parse the MDX content into sections
  // Split on ## headings to get "Who They Are" and "Before The Signal"
  const sections = content.split(/^## /m).filter(Boolean);
  const whoTheyAre = sections.find((s) => s.startsWith("Who They Are"));
  const beforeTheSignal = sections.find((s) =>
    s.startsWith("Before The Signal")
  );

  return (
    <PageTransition>
      <Header />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-4 sm:left-6 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors bg-bg/40 backdrop-blur px-3 py-2 rounded-lg"
          >
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
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Roster
          </Link>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-10 pb-20">
        <div className="animate-fade-in-up">
          {/* Featured date */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Featured · {artist.featuredDate}
            </span>
          </div>

          {/* Name */}
          <h1 className="font-heading font-800 text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-3 leading-[0.95]">
            {artist.name}
          </h1>

          {/* Role */}
          <p className="font-mono text-sm uppercase tracking-wider text-text-secondary mb-8">
            {artist.role}
          </p>

          {/* Stats boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Monthly Listeners
              </p>
              <p className="font-heading font-700 text-2xl text-accent">
                {artist.monthlyListeners}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                IG Followers
              </p>
              <p className="font-heading font-700 text-2xl text-text-primary">
                {artist.igFollowers}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 col-span-2 sm:col-span-1">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Notable
              </p>
              <p className="font-mono text-xs text-text-primary leading-relaxed">
                {artist.notable}
              </p>
            </div>
          </div>

          {/* Genre + Mood tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {artist.genre.map((g) => (
              <span
                key={g}
                className="font-mono text-[11px] px-3 py-1 rounded-full border border-accent/30 text-accent"
              >
                {g}
              </span>
            ))}
            {artist.mood.map((m) => (
              <span
                key={m}
                className="font-mono text-[11px] px-3 py-1 rounded-full border border-border text-text-secondary"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Who They Are */}
          {whoTheyAre && (
            <div className="mb-12">
              <h2 className="font-heading font-700 text-2xl text-text-primary mb-4">
                Who They Are
              </h2>
              <p className="text-text-secondary leading-relaxed text-lg">
                {whoTheyAre.replace("Who They Are\n", "").trim()}
              </p>
            </div>
          )}

          {/* Before The Signal — the heart of the site */}
          {beforeTheSignal && (
            <div className="mb-12">
              <h2 className="font-heading font-700 text-2xl text-text-primary mb-4">
                Before The Signal
              </h2>
              <div className="before-the-signal">
                <p className="text-lg leading-relaxed">
                  {beforeTheSignal
                    .replace("Before The Signal\n", "")
                    .trim()}
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          {artist.timeline && artist.timeline.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading font-700 text-2xl text-text-primary mb-6">
                Timeline
              </h2>
              <div className="relative pl-8 border-l-2 border-border">
                {artist.timeline.map((item, i) => {
                  const isLast = i === artist.timeline.length - 1;
                  return (
                    <div key={i} className="relative mb-8 last:mb-0">
                      {/* Hollow dot for past events, filled dot for most recent */}
                      <div
                        className={`absolute -left-[calc(2rem+5px)] w-3 h-3 rounded-full border-2 border-accent ${
                          isLast
                            ? "bg-accent shadow-[0_0_8px_#00e5a060]"
                            : "bg-bg"
                        }`}
                      />
                      <span className={`font-mono text-xs uppercase tracking-wider ${isLast ? "text-accent" : "text-accent/70"}`}>
                        {item.year}
                      </span>
                      <p className={`mt-1 leading-relaxed ${isLast ? "text-text-primary" : "text-text-secondary"}`}>
                        {item.event}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spotify Embed */}
          {artist.spotifyId && (
            <div className="mb-12">
              <h2 className="font-heading font-700 text-2xl text-text-primary mb-4">
                Listen
              </h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <iframe
                  src={`https://open.spotify.com/embed/artist/${artist.spotifyId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Social Links */}
          {artist.social && (
            <div className="mb-12">
              <h2 className="font-heading font-700 text-2xl text-text-primary mb-4">
                Connect
              </h2>
              <div className="flex flex-wrap gap-3">
                {artist.social.spotify && (
                  <a
                    href={artist.social.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2.5 bg-card border border-border rounded-lg text-text-secondary hover:text-accent hover:border-accent/40 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Spotify
                  </a>
                )}
                {artist.social.instagram && (
                  <a
                    href={artist.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2.5 bg-card border border-border rounded-lg text-text-secondary hover:text-accent hover:border-accent/40 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Instagram
                  </a>
                )}
                {artist.social.tiktok && (
                  <a
                    href={artist.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2.5 bg-card border border-border rounded-lg text-text-secondary hover:text-accent hover:border-accent/40 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.15a8.16 8.16 0 005.58 2.2v-3.4a4.85 4.85 0 01-1-.09z" />
                    </svg>
                    TikTok
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Back to roster */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors"
          >
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
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Roster
          </Link>
        </div>
      </div>

      <Footer />
    </PageTransition>
  );
}
