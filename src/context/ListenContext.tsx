"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ARTISTS } from "@/data/artists";
import meta from "@/data/artist-meta.json";

/**
 * The Listen player: one <audio> element that lives for the whole visit
 * (this provider sits above the page transition, so music keeps playing as
 * people move between pages). It plays 30-second Deezer previews fetched from
 * /api/listen/{slug}.
 *
 *  - playArtist(slug): that artist's featured song, then their top tracks
 *  - playFeed():       a rotating "radio" across every artist, two songs each
 */

export interface QueueTrack {
  id: string;
  title: string;
  preview: string;
  cover: string;
  artistSlug: string;
  artistName: string;
}

interface ListenState {
  current: QueueTrack | null;
  playing: boolean;
  loading: boolean;
  progress: number; // 0..1
  position: number; // seconds
  duration: number; // seconds
  mode: "artist" | "feed" | null;
  error: string | null;
  playArtist: (slug: string) => Promise<void>;
  playFeed: () => Promise<void>;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (fraction: number) => void;
  close: () => void;
}

const noop = async () => {};
const Ctx = createContext<ListenState>({
  current: null, playing: false, loading: false, progress: 0, position: 0, duration: 30,
  mode: null, error: null, playArtist: noop, playFeed: noop, toggle: () => {}, next: () => {},
  prev: () => {}, seek: () => {}, close: () => {},
});

export const useListen = () => useContext(Ctx);

const AUDIO_SLUGS = () =>
  ARTISTS.filter((a) => (meta as Record<string, { deezerId?: number }>)[a.slug]?.deezerId).map((a) => a.slug);

async function loadArtist(slug: string, limit: number): Promise<QueueTrack[]> {
  const res = await fetch(`/api/listen/${slug}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.tracks as { id: string; title: string; preview: string; cover: string }[])
    .slice(0, limit)
    .map((t) => ({ ...t, artistSlug: data.slug, artistName: data.artist }));
}

export function ListenProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<QueueTrack[]>([]);
  const indexRef = useRef(0);
  const pendingRef = useRef<string[]>([]); // feed: artists not loaded yet
  const modeRef = useRef<"artist" | "feed" | null>(null);
  const retriedRef = useRef<string | null>(null);

  const [current, setCurrent] = useState<QueueTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(30);
  const [mode, setMode] = useState<"artist" | "feed" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startAt = useCallback(async (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    // Feed: if we've run off the loaded queue, pull in the next artist.
    while (index >= queueRef.current.length && modeRef.current === "feed" && pendingRef.current.length) {
      const slug = pendingRef.current.shift()!;
      setLoading(true);
      const more = await loadArtist(slug, 2);
      setLoading(false);
      queueRef.current = [...queueRef.current, ...more];
    }
    const track = queueRef.current[index];
    if (!track) {
      setPlaying(false);
      return; // end of the queue
    }
    indexRef.current = index;
    setCurrent(track);
    setError(null);
    setPosition(0);
    audio.src = track.preview;
    try {
      await audio.play();
    } catch {
      /* the 'error' / 'pause' events below handle the UI */
    }
    // Warm the next artist in the feed so there's no gap.
    if (modeRef.current === "feed" && indexRef.current >= queueRef.current.length - 2 && pendingRef.current.length) {
      const slug = pendingRef.current.shift()!;
      loadArtist(slug, 2).then((more) => {
        queueRef.current = [...queueRef.current, ...more];
      });
    }
  }, []);

  const next = useCallback(() => { void startAt(indexRef.current + 1); }, [startAt]);
  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return; }
    void startAt(Math.max(0, indexRef.current - 1));
  }, [startAt]);

  // Create the audio element once, and wire its events.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onTime = () => setPosition(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30);
    const onPlay = () => { setPlaying(true); setLoading(false); };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onEnded = () => { void startAt(indexRef.current + 1); };
    const onError = async () => {
      // Preview links expire after ~15 minutes: refresh this artist once, then retry.
      const track = queueRef.current[indexRef.current];
      if (!track) return;
      if (retriedRef.current !== track.id) {
        retriedRef.current = track.id;
        const fresh = await loadArtist(track.artistSlug, 8);
        const match = fresh.find((t) => t.id === track.id);
        if (match) {
          queueRef.current = queueRef.current.map((t) => (t.id === track.id ? match : t));
          void startAt(indexRef.current);
          return;
        }
      }
      setError("That preview couldn't load. Skipping.");
      void startAt(indexRef.current + 1);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("playing", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("playing", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [startAt]);

  const playArtist = useCallback(async (slug: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    // Same artist already loaded: just resume instead of restarting.
    if (modeRef.current === "artist" && queueRef.current[indexRef.current]?.artistSlug === slug && audio.paused) {
      void audio.play();
      return;
    }
    setLoading(true);
    setError(null);
    const tracks = await loadArtist(slug, 6);
    setLoading(false);
    if (!tracks.length) { setError("No preview available for this artist yet."); return; }
    modeRef.current = "artist";
    setMode("artist");
    pendingRef.current = [];
    queueRef.current = tracks;
    retriedRef.current = null;
    await startAt(0);
  }, [startAt]);

  const playFeed = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (modeRef.current === "feed" && audio.paused && queueRef.current.length) { void audio.play(); return; }
    // Shuffle a little so the feed doesn't always open with the same artist.
    const slugs = AUDIO_SLUGS().sort(() => Math.random() - 0.5);
    if (!slugs.length) return;
    modeRef.current = "feed";
    setMode("feed");
    pendingRef.current = slugs.slice(1);
    setLoading(true);
    const first = await loadArtist(slugs[0], 2);
    setLoading(false);
    queueRef.current = first;
    retriedRef.current = null;
    await startAt(0);
  }, [startAt]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }, [current]);

  const seek = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(Math.max(fraction, 0), 1) * audio.duration;
  }, []);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); }
    queueRef.current = [];
    pendingRef.current = [];
    modeRef.current = null;
    setMode(null);
    setCurrent(null);
    setPlaying(false);
    setPosition(0);
  }, []);

  // Lock-screen / headphone / keyboard media keys.
  useEffect(() => {
    if (!current || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artistName,
      album: "Sub Signal",
      artwork: current.cover ? [{ src: current.cover, sizes: "250x250", type: "image/jpeg" }] : [],
    });
    navigator.mediaSession.setActionHandler("play", () => void audioRef.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
    navigator.mediaSession.setActionHandler("nexttrack", next);
    navigator.mediaSession.setActionHandler("previoustrack", prev);
  }, [current, next, prev]);

  const value = useMemo<ListenState>(
    () => ({
      current, playing, loading, position, duration,
      progress: duration ? Math.min(position / duration, 1) : 0,
      mode, error, playArtist, playFeed, toggle, next, prev, seek, close,
    }),
    [current, playing, loading, position, duration, mode, error, playArtist, playFeed, toggle, next, prev, seek, close],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
