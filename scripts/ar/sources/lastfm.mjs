/**
 * Last.fm API. Needs a free key (LASTFM_API_KEY). Non-commercial use only;
 * listener and play counts are used for scoring and never shown on the site
 * without a credit and a link to the Last.fm artist page.
 *
 * `undefined` = source failed, `null` = artist unknown to Last.fm.
 */
const BASE = "https://ws.audioscrobbler.com/2.0/";
const GAP = 1100; // Last.fm suspends keys that make "several calls per second"

export function lastfm(http, { apiKey = process.env.LASTFM_API_KEY } = {}) {
  const enabled = Boolean(apiKey);

  async function info(params) {
    const q = new URLSearchParams({ method: "artist.getinfo", api_key: apiKey, format: "json", autocorrect: "0", ...params });
    const r = await http.json(`${BASE}?${q}`, { minGap: GAP });
    if (!r.ok) return undefined;
    const b = r.body;
    if (b?.error === 6) return null; // "The artist you supplied could not be found"
    if (b?.error) return undefined;
    const a = b?.artist;
    if (!a) return null;
    return {
      name: a.name,
      mbid: a.mbid || null,
      url: a.url,
      listeners: Number(a.stats?.listeners ?? NaN) || null,
      playcount: Number(a.stats?.playcount ?? NaN) || null,
      tags: (a.tags?.tag || []).map((t) => t.name).slice(0, 5),
    };
  }

  return {
    name: "lastfm",
    enabled,
    /** Looks up by MusicBrainz id when we have one, otherwise by exact name. */
    async artistInfo({ mbid, name }) {
      if (!enabled) return undefined;
      if (mbid) {
        const byId = await info({ mbid });
        if (byId !== null) return byId; // undefined (failed) or a hit
      }
      return name ? info({ artist: name }) : null;
    },
  };
}
