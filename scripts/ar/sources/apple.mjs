/**
 * Apple's marketing-tools feeds: top 100 most-played songs and albums per
 * storefront. No key. Apple offers these to promote Apple Music content, so
 * every entry we keep carries its Apple Music URL.
 *
 * `undefined` = feed failed.
 */
const BASE = "https://rss.marketingtools.apple.com/api/v2";

export function apple(http) {
  return {
    name: "apple",
    async mostPlayed(country, kind = "songs", limit = 100) {
      const r = await http.json(`${BASE}/${country}/music/most-played/${limit}/${kind}.json`, { minGap: 250 });
      if (!r.ok) return undefined;
      const results = r.body?.feed?.results;
      if (!Array.isArray(results)) return undefined;
      return results.map((e, i) => ({
        source: "apple",
        country,
        kind,
        position: i + 1,
        id: e.id,
        title: e.name,
        artistName: e.artistName,
        artistId: e.artistId || null,
        artistUrl: e.artistUrl || null,
        releaseDate: e.releaseDate || null,
        url: e.url,
        genres: (e.genres || []).map((g) => g.name).filter((g) => g !== "Music"),
      }));
    },
  };
}
