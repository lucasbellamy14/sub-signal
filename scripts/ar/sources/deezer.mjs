/**
 * Deezer public API (no key). Non-commercial use only; we display Deezer data
 * through its API and never copy its images into the repo.
 *
 * Convention for every source module: a function resolves `undefined` when
 * the source failed (network, quota, bad body) and `null` when the source
 * answered "no such thing". Callers must tell the two apart.
 */
import { norm, sleep } from "../lib/util.mjs";

const BASE = "https://api.deezer.com";
const GAP = 120; // ms between calls: ~8/s, inside Deezer's 50 per 5 s

export function deezer(http, { quotaWaitMs = 5500 } = {}) {
  async function call(path) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await http.json(BASE + path, { minGap: GAP });
      if (!r.ok) return undefined;
      const b = r.body;
      if (b && b.error) {
        // code 4 = quota exceeded, 700 = service busy: both are temporary
        if (b.error.code === 4 || b.error.code === 700) {
          await sleep(quotaWaitMs);
          continue;
        }
        if (b.error.code === 800) return null; // no data / not found
        return undefined;
      }
      return b;
    }
    return undefined;
  }

  const pic = (a) => (a?.picture_xl || a?.picture_big || "") || "";
  const artistShape = (a) => ({ id: a.id, name: a.name, fans: a.nb_fan ?? null, link: a.link, picture: pic(a) });

  return {
    name: "deezer",

    /** Exact-name match only, same rule as scripts/fetch-artist-photos.mjs. */
    async searchArtist(name) {
      const b = await call(`/search/artist?q=${encodeURIComponent(name)}&limit=10`);
      if (b === undefined) return undefined;
      const hit = (b?.data || []).find((a) => norm(a.name) === norm(name));
      return hit ? artistShape(hit) : null;
    },

    async artist(id) {
      const b = await call(`/artist/${id}`);
      if (b === undefined) return undefined;
      return b && b.id ? artistShape(b) : null;
    },

    async topTracks(id, limit = 5) {
      const b = await call(`/artist/${id}/top?limit=${limit}`);
      if (b === undefined) return undefined;
      return (b?.data || []).map((t) => ({ id: t.id, title: t.title, rank: t.rank, album: t.album?.title || "", link: t.link }));
    },

    /** Release date of one track (the top endpoint doesn't carry it). */
    async track(id) {
      const b = await call(`/track/${id}`);
      if (b === undefined) return undefined;
      return b && b.id ? { id: b.id, title: b.title, releaseDate: b.release_date || null, album: b.album?.title || "" } : null;
    },

    async related(id, limit = 20) {
      const b = await call(`/artist/${id}/related?limit=${limit}`);
      if (b === undefined) return undefined;
      return (b?.data || []).map(artistShape);
    },

    /** Global chart (genre 0) or a genre chart: positions for tracks, albums and artists. */
    async chart(genre = 0, limit = 100) {
      const out = { tracks: [], albums: [], artists: [] };
      for (const kind of ["tracks", "albums", "artists"]) {
        const b = await call(`/chart/${genre}/${kind}?limit=${limit}`);
        if (b === undefined) return undefined;
        out[kind] = (b?.data || []).map((x, i) => ({
          position: x.position ?? i + 1,
          id: x.id,
          title: x.title || x.name,
          artist: x.artist ? { id: x.artist.id, name: x.artist.name } : { id: x.id, name: x.name },
          link: x.link,
          releaseDate: x.release_date || null,
        }));
      }
      return out;
    },
  };
}
