"use client";

import { useState, useMemo } from "react";
import type { Artist } from "@/lib/artists";
import ArtistCard from "./ArtistCard";
import FilterBar from "./FilterBar";

interface RosterProps {
  artists: Artist[];
}

/**
 * Roster section — the main grid of all artist cards.
 * Includes the filter bar and a toggle to switch between grid and feed view.
 *
 * "useMemo" is just a performance trick — it avoids re-filtering every time
 * something unrelated changes on the page.
 */
export default function Roster({ artists }: RosterProps) {
  const [view, setView] = useState<"grid" | "feed">("grid");
  const [filters, setFilters] = useState({ genre: "All", mood: "All" });
  const [search, setSearch] = useState("");

  // Filter artists based on search, genre, and mood
  const filtered = useMemo(() => {
    return artists.filter((artist) => {
      const searchMatch =
        search === "" ||
        artist.name.toLowerCase().includes(search.toLowerCase()) ||
        artist.role.toLowerCase().includes(search.toLowerCase());
      const genreMatch =
        filters.genre === "All" || artist.genre.includes(filters.genre);
      const moodMatch =
        filters.mood === "All" || artist.mood.includes(filters.mood);
      return searchMatch && genreMatch && moodMatch;
    });
  }, [artists, filters, search]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header + view toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-heading font-700 text-3xl text-text-primary mb-2">
              The Roster
            </h2>
            <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
              {filtered.length} artist{filtered.length !== 1 ? "s" : ""} on the
              radar
            </p>
          </div>

          {/* Grid / Feed toggle buttons */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded transition-colors ${
                view === "grid"
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setView("feed")}
              className={`p-2 rounded transition-colors ${
                view === "feed"
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Feed view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="14" height="4" rx="1" />
                <rect x="1" y="7" width="14" height="4" rx="1" />
                <rect x="1" y="13" width="14" height="2" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artists..."
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-10">
          <FilterBar
            onFilterChange={setFilters}
            activeGenre={filters.genre}
            activeMood={filters.mood}
          />
        </div>

        {/* Artist cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-border flex items-center justify-center">
              <svg className="w-7 h-7 text-text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546" />
              </svg>
            </div>
            <p className="font-heading font-700 text-lg text-text-primary mb-2">
              No signal found
            </p>
            <p className="font-mono text-sm text-text-secondary mb-6">
              {search
                ? `No artists matching "${search}"`
                : "No artists match those filters yet."}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setFilters({ genre: "All", mood: "All" });
              }}
              className="font-mono text-xs text-accent hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((artist, i) => (
              <ArtistCard
                key={artist.slug}
                artist={artist}
                index={i}
                view="grid"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((artist, i) => (
              <ArtistCard
                key={artist.slug}
                artist={artist}
                index={i}
                view="feed"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
