/**
 * Turns the pool into this week's snapshot: resolves each artist's identity
 * (Deezer exact match, MusicBrainz id and links), pulls the numbers, attaches
 * chart positions and press mentions. A source that fails is recorded as
 * unavailable for that artist; nothing is ever filled in by guesswork.
 */
import { norm } from "./lib/util.mjs";
import { matchPress } from "./sources/press.mjs";

export async function collect({ pool, ledger, config, src, log, week, now = new Date() }) {
  const health = { deezer: { ok: 0, fail: 0 }, lastfm: { ok: 0, fail: 0 }, musicbrainz: { ok: 0, fail: 0 } };
  const mark = (s, r) => (r === undefined ? health[s].fail++ : health[s].ok++);

  // Press once for the whole pool
  let pressItems = [];
  let pressStatus = "unavailable";
  const pressRes = await src.press.items();
  if (pressRes !== undefined) {
    pressItems = pressRes.items;
    pressStatus = pressRes.feedsOk === pressRes.feedsTotal ? "ok" : "partial";
    log(`  press  ${pressRes.feedsOk}/${pressRes.feedsTotal} feeds, ${pressItems.length} headlines`);
  } else log("  press  FAIL all feeds");
  const pressMatches = matchPress(pressItems, pool.entries.map((e) => e.name));

  const artists = {};
  let mbBudget = config.musicbrainzPerRun;
  let n = 0;
  for (const e of pool.entries) {
    n++;
    if (n % 25 === 0) log(`  …${n}/${pool.entries.length}`);
    let key = ledger.names[norm(e.name)];
    let L = key ? ledger.artists[key] : null;

    // --- Deezer identity + fans
    let dz;
    const dzId = L?.deezerId || e.deezerId;
    if (dzId) {
      dz = await src.deezer.artist(dzId);
      mark("deezer", dz);
    }
    if (dz == null) {
      const found = await src.deezer.searchArtist(e.name);
      mark("deezer", found);
      if (found) dz = found;
    }

    // --- MusicBrainz identity + links (budgeted per run; cached in the ledger)
    let mb = null;
    let links = {};
    if ((!L || !L.mbid) && mbBudget > 0) {
      mbBudget--;
      const hit = await src.musicbrainz.search(e.name);
      mark("musicbrainz", hit);
      if (hit) {
        mb = hit;
        const l = await src.musicbrainz.links(hit.mbid);
        mark("musicbrainz", l);
        if (l) links = l;
      }
    }

    // --- Ledger entry
    const mbid = L?.mbid || mb?.mbid || e.mbid || null;
    const deezerId = dz?.id || dzId || links.deezerId || null;
    if (!L) {
      key = mbid ? `mb:${mbid}` : deezerId ? `dz:${deezerId}` : `nm:${norm(e.name)}`;
      L = ledger.artists[key] || { key, name: e.name, mbid: null, deezerId: null, links: {}, genres: [], area: null, status: e.tags.has("roster") ? "roster" : "candidate", firstSeen: week, history: [] };
      ledger.artists[key] = L;
    } else if (!L.mbid && mbid) {
      // upgrade a Deezer-only key to a MusicBrainz key, keeping history
      const newKey = `mb:${mbid}`;
      if (!ledger.artists[newKey]) {
        delete ledger.artists[key];
        L.key = newKey;
        ledger.artists[newKey] = L;
        key = newKey;
      }
    }
    ledger.names[norm(e.name)] = key;
    L.name = L.name || e.name;
    L.mbid = L.mbid || mbid;
    L.deezerId = L.deezerId || deezerId;
    L.links = { ...(L.links || {}), ...links, ...(dz?.link ? { deezer: dz.link } : {}) };
    if (mb?.area && !L.area) L.area = mb.area;
    if (e.slug) {
      L.slug = e.slug;
      L.status = "roster";
    }
    L.lastSeen = week;
    L.identity = L.mbid && L.deezerId ? "strong" : L.mbid ? "musicbrainz" : L.deezerId ? "deezer" : "weak";
    const identityConflict = Boolean(links.deezerId && dz?.id && links.deezerId !== dz.id);
    if (identityConflict) L.identityConflict = true;

    // --- Metrics
    let topTracks = null;
    if (dz?.id) {
      topTracks = await src.deezer.topTracks(dz.id, 5);
      mark("deezer", topTracks);
      if (topTracks?.length) {
        const top = topTracks.reduce((a, t) => ((t.rank || 0) > (a.rank || 0) ? t : a));
        const tr = await src.deezer.track(top.id);
        mark("deezer", tr);
        if (tr?.releaseDate) top.releaseDate = tr.releaseDate;
      }
    }
    let lf = null;
    if (src.lastfm.enabled) {
      lf = await src.lastfm.artistInfo({ mbid: L.mbid, name: e.name });
      mark("lastfm", lf);
    }
    const appleGenres = [...new Set(e.charts.flatMap((c) => c.genres || []))];
    const genres = [...new Set([...(lf?.tags || []).slice(0, 3), ...appleGenres])].slice(0, 5);
    if (genres.length) L.genres = genres;

    artists[key] = {
      name: e.name,
      slug: e.slug || L.slug || null,
      mbid: L.mbid,
      deezerId: dz?.id || L.deezerId || null,
      identity: L.identity,
      identityConflict: Boolean(L.identityConflict),
      pool: [...e.tags],
      deezer: dz ? { fans: dz.fans, topTracks: topTracks === undefined ? null : topTracks || [] } : null,
      lastfm: lf ? { listeners: lf.listeners, playcount: lf.playcount, url: lf.url } : null,
      charts: e.charts,
      press: pressMatches.get(e.name) || [],
      links: L.links,
      genres: L.genres || [],
      area: L.area,
    };
  }

  const status = (h, disabled) => (disabled ? "disabled" : h.ok + h.fail === 0 ? "skipped" : h.fail === 0 ? "ok" : h.fail / (h.ok + h.fail) > 0.5 ? "unavailable" : "partial");
  return {
    week,
    recordedAt: now.toISOString(),
    sources: { ...pool.sources, deezer: status(health.deezer), lastfm: status(health.lastfm, !src.lastfm.enabled), musicbrainz: status(health.musicbrainz), press: pressStatus },
    pool: pool.stats,
    press: { headlines: pressItems.length, matched: [...pressMatches.keys()].length },
    artists,
  };
}
