/**
 * Builds the week's candidate pool: everyone in the Apple and Deezer charts,
 * the watchlist and recent candidates from the ledger, the published roster,
 * and Deezer's neighbours of last week's strongest small artists.
 */
import { norm } from "./lib/util.mjs";

export async function buildPool({ config, ledger, roster, src, log, week, limit = 0 }) {
  const entries = new Map(); // normName -> entry
  const health = { apple: { ok: 0, fail: 0 }, deezerChart: { ok: 0, fail: 0 }, neighbours: { ok: 0, fail: 0 } };

  const add = (name, patch = {}) => {
    const k = norm(name);
    if (!k) return null;
    const e = entries.get(k) || { name, tags: new Set(), charts: [], deezerId: null, appleArtistId: null, mbid: null, slug: null };
    if (patch.tag) e.tags.add(patch.tag);
    if (patch.chart) e.charts.push(patch.chart);
    if (patch.deezerId && !e.deezerId) e.deezerId = patch.deezerId;
    if (patch.appleArtistId && !e.appleArtistId) e.appleArtistId = patch.appleArtistId;
    if (patch.mbid && !e.mbid) e.mbid = patch.mbid;
    if (patch.slug) e.slug = patch.slug;
    entries.set(k, e);
    return e;
  };

  // 1. Published roster: tracked every week, never a candidate
  for (const r of roster) add(r.name, { tag: "roster", slug: r.slug, deezerId: r.deezerId });

  // 2. Apple most-played charts
  for (const country of config.appleCountries) {
    for (const kind of ["songs", "albums"]) {
      const list = await src.apple.mostPlayed(country, kind);
      if (list === undefined) {
        health.apple.fail++;
        log(`  apple  FAIL ${country} ${kind}`);
        continue;
      }
      health.apple.ok++;
      for (const x of list) {
        // "A & B" collaborations: credit the first named artist only
        const primary = x.artistName.split(/, | & | feat\.? | featuring | x | X /i)[0].trim();
        add(primary, { tag: "apple-chart", appleArtistId: x.artistId, chart: { source: "apple", country, kind, position: x.position, title: x.title, releaseDate: x.releaseDate, url: x.url, artistUrl: x.artistUrl, genres: x.genres } });
      }
    }
  }

  // 3. Deezer charts
  for (const genre of config.deezerGenres) {
    const chart = await src.deezer.chart(genre);
    if (chart === undefined) {
      health.deezerChart.fail++;
      log(`  deezer FAIL chart ${genre}`);
      continue;
    }
    health.deezerChart.ok++;
    for (const kind of ["tracks", "albums", "artists"]) {
      for (const x of chart[kind]) add(x.artist.name, { tag: "deezer-chart", deezerId: x.artist.id, chart: { source: "deezer", country: "global", kind, position: x.position, title: x.title, releaseDate: x.releaseDate, url: x.link } });
    }
  }

  // 4. Watchlist and recent candidates from the ledger
  for (const a of Object.values(ledger.artists)) {
    if (a.status === "watchlist" || a.status === "shortlisted") add(a.name, { tag: a.status, deezerId: a.deezerId, mbid: a.mbid });
    else if (a.status === "candidate" && a.lastSeen && weeksAgo(a.lastSeen, week) <= 2) add(a.name, { tag: "recent", deezerId: a.deezerId, mbid: a.mbid });
  }

  // 5. Neighbours: Deezer related artists of the strongest small artists we already track
  const seeds = Object.values(ledger.artists)
    .filter((a) => a.deezerId && a.lastScore != null && a.status !== "roster" && (a.band === "micro" || a.band === "small"))
    .sort((x, y) => y.lastScore - x.lastScore)
    .slice(0, config.neighbourSeeds);
  for (const s of seeds) {
    const rel = await src.deezer.related(s.deezerId, 20);
    if (rel === undefined) {
      health.neighbours.fail++;
      continue;
    }
    health.neighbours.ok++;
    for (const r of rel) if (r.fans != null && r.fans < config.sizeBands.mid) add(r.name, { tag: "neighbour", deezerId: r.id });
  }

  let list = [...entries.values()];
  if (limit > 0) {
    const rosterPart = list.filter((e) => e.tags.has("roster"));
    const rest = list.filter((e) => !e.tags.has("roster"));
    list = [...rosterPart, ...rest.slice(0, limit)];
  }
  const status = (h) => (h.ok + h.fail === 0 ? "skipped" : h.fail === 0 ? "ok" : h.ok === 0 ? "unavailable" : "partial");
  return {
    entries: list,
    stats: { total: list.length, roster: list.filter((e) => e.tags.has("roster")).length, appleChart: list.filter((e) => e.tags.has("apple-chart")).length, deezerChart: list.filter((e) => e.tags.has("deezer-chart")).length, carried: list.filter((e) => e.tags.has("watchlist") || e.tags.has("shortlisted") || e.tags.has("recent")).length, neighbours: list.filter((e) => e.tags.has("neighbour")).length },
    sources: { apple: status(health.apple), deezerChart: status(health.deezerChart), neighbours: status(health.neighbours) },
  };
}

function weeksAgo(fromWeek, toWeek) {
  const [y1, w1] = fromWeek.split("-W").map(Number);
  const [y2, w2] = toWeek.split("-W").map(Number);
  return (y2 - y1) * 52 + (w2 - w1);
}
