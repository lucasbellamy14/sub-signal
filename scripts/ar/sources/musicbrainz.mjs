/**
 * MusicBrainz: the stable identity for every tracked artist, plus the links
 * it knows (Spotify, Deezer, Bandcamp, Last.fm, Wikidata, homepage).
 * One request per second with a descriptive User-Agent, as its docs require.
 *
 * `undefined` = source failed, `null` = no confident match.
 */
import { norm } from "../lib/util.mjs";

const BASE = "https://musicbrainz.org/ws/2";
const GAP = 1100;

const LINK_RULES = [
  ["spotify", /open\.spotify\.com\/artist\//],
  ["deezer", /deezer\.com\/artist\/(\d+)/],
  ["appleMusic", /music\.apple\.com\//],
  ["bandcamp", /bandcamp\.com/],
  ["youtube", /youtube\.com\//],
  ["lastfm", /last\.fm\/music\//],
  ["instagram", /instagram\.com\//],
  ["wikidata", /wikidata\.org\/wiki\/(Q\d+)/],
  ["wikipedia", /wikipedia\.org\/wiki\//],
];

export function musicbrainz(http) {
  return {
    name: "musicbrainz",

    async search(name) {
      const q = `artist:"${name.replace(/"/g, "")}"`;
      const r = await http.json(`${BASE}/artist/?query=${encodeURIComponent(q)}&fmt=json&limit=5`, { minGap: GAP });
      if (!r.ok) return undefined;
      const hits = r.body?.artists || [];
      const hit = hits.find((a) => Number(a.score) >= 90 && norm(a.name) === norm(name));
      if (!hit) return null;
      return {
        mbid: hit.id,
        name: hit.name,
        type: hit.type || null,
        disambiguation: hit.disambiguation || "",
        area: hit["begin-area"]?.name || hit.area?.name || null,
        country: hit.country || null,
        score: Number(hit.score),
        ambiguous: hits.filter((a) => Number(a.score) >= 90 && norm(a.name) === norm(name)).length > 1,
      };
    },

    /** Links MusicBrainz holds for the artist, keyed by service. */
    async links(mbid) {
      const r = await http.json(`${BASE}/artist/${mbid}?inc=url-rels&fmt=json`, { minGap: GAP });
      if (!r.ok) return undefined;
      const out = {};
      for (const rel of r.body?.relations || []) {
        const url = rel.url?.resource;
        if (!url) continue;
        if (rel.type === "official homepage" && !out.website) out.website = url;
        for (const [key, re] of LINK_RULES) {
          const m = url.match(re);
          if (m && !out[key]) {
            out[key] = url;
            if (key === "deezer") out.deezerId = Number(m[1]);
            if (key === "wikidata") out.wikidataId = m[1];
          }
        }
      }
      return out;
    },
  };
}
