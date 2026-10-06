import { NextResponse } from "next/server";
import { ARTISTS } from "@/data/artists";
import meta from "@/data/artist-meta.json";

/**
 * GET /api/listen/{slug}
 *
 * Returns up to 8 playable 30-second previews for an artist, with their
 * featured song first (when Deezer has it) and then their top tracks.
 *
 * Why a server route: Deezer's API can't be called from the browser (no CORS),
 * and its preview links expire after ~15 minutes, so they must be fetched
 * fresh rather than stored in our data.
 */

type DeezerTrack = {
  id: number;
  title: string;
  preview?: string;
  artist?: { id: number; name: string };
  album?: { title: string; cover_medium?: string; cover_small?: string };
};

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");

/**
 * The same song is titled differently across regions and releases
 * ("Song - A COLORS SHOW", "Song (feat. X)", "Song - Remastered"), so compare
 * only the part before the first " - ", "(" or "[".
 */
const baseTitle = (s: string) => s.split(/ - | \(| \[/)[0].trim();
const sameSong = (a: string, b: string) => norm(baseTitle(a)) === norm(baseTitle(b));

async function deezer<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.error) return null;
    return json as T;
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const artist = ARTISTS.find((a) => a.slug === params.slug);
  const info = (meta as Record<string, { deezerId?: number; featuredTitle?: string }>)[params.slug];
  if (!artist || !info?.deezerId) {
    return NextResponse.json({ error: "No audio for this artist" }, { status: 404 });
  }

  const top = await deezer<{ data: DeezerTrack[] }>(
    `https://api.deezer.com/artist/${info.deezerId}/top?limit=15`,
  );
  let tracks = (top?.data ?? []).filter((t) => t.preview);

  // Put the featured song first, fetching it if it isn't in their top tracks.
  if (info.featuredTitle) {
    const wanted = info.featuredTitle;
    let featured = tracks.find((t) => sameSong(t.title, wanted));
    if (!featured) {
      // Try a strict search first, then a looser one (Deezer's catalog differs by region).
      const queries = [
        `artist:"${artist.name}" track:"${baseTitle(wanted)}"`,
        `${artist.name} ${baseTitle(wanted)}`,
      ];
      for (const q of queries) {
        const found = await deezer<{ data: DeezerTrack[] }>(
          `https://api.deezer.com/search/track?q=${encodeURIComponent(q)}&limit=15`,
        );
        featured = found?.data?.find(
          (t) => t.preview && t.artist?.id === info.deezerId && sameSong(t.title, wanted),
        );
        if (featured) break;
      }
    }
    if (featured) tracks = [featured, ...tracks.filter((t) => t.id !== featured!.id)];
  }

  if (!tracks.length) {
    return NextResponse.json({ error: "No previews available" }, { status: 404 });
  }

  return NextResponse.json(
    {
      slug: artist.slug,
      artist: artist.name,
      tracks: tracks.slice(0, 8).map((t) => ({
        id: String(t.id),
        title: t.title,
        preview: t.preview,
        cover: t.album?.cover_medium || t.album?.cover_small || "",
      })),
    },
    // Preview links last ~15 min; keep any cached copy well inside that.
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=240" } },
  );
}
