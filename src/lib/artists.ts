/**
 * This file reads all the MDX files in /src/content/artists/
 * and extracts the artist data (name, genre, stats, etc.) from them.
 * Think of it as the "database" for the site — except instead of a
 * real database, we just read from text files.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// This defines the shape of an artist's data
export interface Artist {
  name: string;
  slug: string;
  role: string;
  genre: string[];
  mood: string[];
  monthlyListeners: string;
  igFollowers: string;
  photo: string;
  spotifyId: string;
  featured: boolean;
  featuredDate: string;
  week: string;
  notable: string;
  social: {
    spotify?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    soundcloud?: string;
  };
  timeline: { year: string; event: string }[];
  hasPhoto: boolean;
  originHook: string;
}

// This is the folder where all artist MDX files live
const contentDir = path.join(process.cwd(), "src/content/artists");

/**
 * Get all artists from the MDX files.
 * It reads each .mdx file, pulls out the frontmatter (the data between --- marks),
 * and returns it as a nice clean array.
 */
export function getAllArtists(): { data: Artist; content: string }[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

  return files
    .map((filename) => {
      const filePath = path.join(contentDir, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      // Check if the photo file actually exists in /public
      const photoPath = data.photo
        ? path.join(process.cwd(), "public", data.photo)
        : "";
      const hasPhoto = photoPath ? fs.existsSync(photoPath) : false;
      // Extract the first sentence of "Before The Signal" as the origin hook
      const btsMatch = content.match(/## Before The Signal\n+([\s\S]*?)(?:\n##|$)/);
      const btsText = btsMatch ? btsMatch[1].trim() : "";
      const originHook = btsText.split(/\.\s/)[0] + (btsText.includes(".") ? "." : "");
      return { data: { ...(data as Artist), hasPhoto, originHook }, content };
    })
    .sort((a, b) => {
      // Featured artists come first, then sort by date
      if (a.data.featured && !b.data.featured) return -1;
      if (!a.data.featured && b.data.featured) return 1;
      return 0;
    });
}

/**
 * Get a single artist by their URL slug (e.g., "oliver-malcolm").
 */
export function getArtistBySlug(
  slug: string
): { data: Artist; content: string } | null {
  const all = getAllArtists();
  return all.find((a) => a.data.slug === slug) || null;
}

/**
 * Get the currently featured artist (the one shown big on the homepage).
 */
export function getFeaturedArtist(): {
  data: Artist;
  content: string;
} | null {
  const all = getAllArtists();
  return all.find((a) => a.data.featured) || null;
}
