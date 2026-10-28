import signal from "@/data/signal.json";
import photos from "@/data/photos.json";

/**
 * The weekly A&R run's verdict on an artist, keyed by slug in
 * src/data/signal.json. Numbers come only from data/ar snapshots; the prose
 * ("whyWatching") is written by the editorial run from cited evidence.
 */
export type Category = "Early Signal" | "Breakout Track" | "Rising Momentum" | "Second Wave";

export interface ArtistSignal {
  category: Category;
  score: {
    total: number;
    /** Share of the data-driven points that could be measured (0–1). */
    coverage: number;
    components: Record<string, { pts: number; max: number }>;
    week: string;
    computedAt: string;
  };
  band?: "micro" | "small" | "mid" | "established" | "unknown";
  featuredRelease?: { title: string; released?: string | null };
  evidence: { label: string; source?: string; date?: string | null }[];
  whyWatching: string;
  links?: Record<string, string>;
  momentum?: "accelerating" | "stable" | "declining" | "new";
}

/** Where an artist's photo comes from and how to credit it (src/data/photos.json). */
export interface ArtistPhoto {
  source: "commons" | "deezer";
  /** Remote image to display instead of /images/artists/{slug}.jpg (Deezer hotlink). */
  url?: string;
  author?: string;
  license?: string;
  licenseUrl?: string;
  /** The page the image came from (Commons file page or Deezer artist page). */
  sourceUrl: string;
}

export const SIGNALS = signal as Record<string, ArtistSignal>;
export const PHOTOS = photos as Record<string, ArtistPhoto>;

export const getSignal = (slug: string): ArtistSignal | undefined => SIGNALS[slug];
export const getPhoto = (slug: string): ArtistPhoto | undefined => PHOTOS[slug];
