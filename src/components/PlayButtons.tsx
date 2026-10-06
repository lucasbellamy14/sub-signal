"use client";

import { useListen } from "@/context/ListenContext";
import meta from "@/data/artist-meta.json";

const hasAudio = (slug: string) => !!(meta as Record<string, { deezerId?: number }>)[slug]?.deezerId;

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
);
const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
);

/** Play / pause one artist's music. Hidden if we have no audio for them. */
export function PlayArtistButton({
  slug,
  name,
  ghost = false,
  label = "Listen",
}: {
  slug: string;
  name: string;
  ghost?: boolean;
  label?: string;
}) {
  const { current, playing, loading, playArtist, toggle } = useListen();
  if (!hasAudio(slug)) return null;
  const isThis = current?.artistSlug === slug;
  const active = isThis && playing;
  return (
    <button
      type="button"
      className={`play-chip${ghost ? " play-chip-ghost" : ""}`}
      aria-pressed={active}
      aria-label={active ? `Pause ${name}` : `Play ${name}`}
      onClick={(e) => {
        e.stopPropagation();
        if (isThis) toggle();
        else void playArtist(slug);
      }}
    >
      {active ? <PauseIcon /> : <PlayIcon />}
      {loading && !isThis ? "Loading" : active ? "Pause" : label}
    </button>
  );
}

/** Starts the rotating feed across all artists. */
export function PlayFeedButton({ children = "Play the feed", ghost = false }: { children?: React.ReactNode; ghost?: boolean }) {
  const { mode, playing, playFeed, toggle } = useListen();
  const active = mode === "feed" && playing;
  return (
    <button
      type="button"
      className={`play-chip${ghost ? " play-chip-ghost" : ""}`}
      aria-pressed={active}
      onClick={() => (mode === "feed" ? toggle() : void playFeed())}
    >
      {active ? <PauseIcon /> : <PlayIcon />}
      {active ? "Pause" : children}
    </button>
  );
}
