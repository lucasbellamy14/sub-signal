/**
 * The Sub Signal A&R score. Pure functions: a snapshot entry, its earlier
 * snapshots and the config in, a scored object out. No network, no I/O, so
 * the tests can pin every rule.
 *
 * Every component reports `available` (could it be measured at all) and
 * `max` (the points it could have earned). Missing data is never estimated:
 * it lowers `coverage`, and the publish gate needs coverage >= 70%.
 *
 * Thresholds live in data/ar/config.json so they can be tuned without
 * touching code once there are outcomes to calibrate against.
 */
import { curve, pct, daysAgo } from "./lib/util.mjs";

export function bandOf(fans, bands) {
  if (fans == null) return "unknown";
  if (fans < bands.micro) return "micro";
  if (fans < bands.small) return "small";
  if (fans < bands.mid) return "mid";
  return "established";
}

/** Weekly growth rate between two values, normalised by the weeks between them. */
function weeklyRate(now, prev, weeks, absFloor) {
  if (now == null || prev == null || !(weeks > 0)) return null;
  if (now - prev < absFloor) return 0;
  const g = pct(now, prev);
  return g == null ? null : g / weeks;
}

function audienceFraction(cur, prev, weeks, band, cfg) {
  const t = cfg.audience[band] || cfg.audience.unknown;
  const parts = [];
  const fans = weeklyRate(cur.deezer?.fans, prev?.deezer?.fans, weeks, t.absFloor);
  if (fans != null) parts.push({ metric: "deezerFans", rate: fans, f: curve(fans, t.lo, t.hi, 1) });
  const lis = weeklyRate(cur.lastfm?.listeners, prev?.lastfm?.listeners, weeks, Math.round(t.absFloor / 2));
  if (lis != null) parts.push({ metric: "lastfmListeners", rate: lis, f: curve(lis, t.lo, t.hi, 1) });
  return parts;
}

export function scoreArtist({ current, previous = [], week, config, rosterMember = false, context = {} }) {
  const cfg = config.scoring;
  const bands = config.sizeBands;
  const band = bandOf(current.deezer?.fans, bands);
  const prev0 = previous[0] || null;
  const weeks0 = prev0 ? Math.max(1, prev0.weeksBefore) : null;
  const flags = [];
  const evidence = [];
  const c = {};

  // --- Streaming growth (30): Last.fm play count rate (25) + Deezer top-track rank movement (5)
  {
    const s = cfg.streaming;
    const play = weeklyRate(current.lastfm?.playcount, prev0?.artist.lastfm?.playcount, weeks0, s.absFloor);
    const playAvail = play != null;
    const sumRank = (a) => (a?.deezer?.topTracks || []).slice(0, 3).reduce((n, t) => n + (t.rank || 0), 0) || null;
    const rank = weeklyRate(sumRank(current), sumRank(prev0?.artist), weeks0, 1);
    const rankAvail = rank != null;
    const max = (playAvail ? 25 : 0) + (rankAvail ? 5 : 0);
    const pts = (playAvail ? curve(play, s.lo, s.hi, 25) : 0) + (rankAvail ? curve(rank, s.rankLo, s.rankHi, 5) : 0);
    c.streaming = { pts: round(pts), max, available: max > 0, inputs: { playcountRate: play, rankRate: rank }, note: max ? "" : prev0 ? "no Last.fm or Deezer history" : "baseline: first snapshot" };
    if (playAvail) evidence.push(`Last.fm plays ${fmt(prev0.artist.lastfm.playcount)} → ${fmt(current.lastfm.playcount)} (${pctFmt(play)}/wk)`);
  }

  // --- Audience growth (20): Deezer fans and Last.fm listeners, band-adjusted
  {
    const parts = prev0 ? audienceFraction(current, prev0.artist, weeks0, band, cfg) : [];
    const max = parts.length ? 20 : 0;
    const pts = parts.length ? (parts.reduce((n, p) => n + p.f, 0) / parts.length) * 20 : 0;
    c.audience = { pts: round(pts), max, available: max > 0, inputs: Object.fromEntries(parts.map((p) => [p.metric, p.rate])), note: max ? "" : prev0 ? "no audience history" : "baseline: first snapshot" };
    for (const p of parts) {
      if (p.metric === "deezerFans") evidence.push(`Deezer fans ${fmt(prev0.artist.deezer.fans)} → ${fmt(current.deezer.fans)} (${pctFmt(p.rate)}/wk)`);
      if (p.metric === "lastfmListeners") evidence.push(`Last.fm listeners ${fmt(prev0.artist.lastfm.listeners)} → ${fmt(current.lastfm.listeners)} (${pctFmt(p.rate)}/wk)`);
    }
    const fansRate = parts.find((p) => p.metric === "deezerFans")?.rate;
    const corroborated = (current.press || []).length || (current.charts || []).length || (c.streaming.inputs.playcountRate ?? 0) > 0.02;
    if (fansRate != null && fansRate > cfg.suspiciousFanRate && !corroborated) flags.push("suspicious: fan jump with no press, chart or listening movement");
  }

  // --- Sustained momentum (20): consecutive weeks of positive audience growth
  {
    const snapshots = 1 + previous.length;
    const max = snapshots >= 3 ? 20 : snapshots === 2 ? 5 : 0;
    let positive = 0;
    const chain = [{ artist: current }, ...previous];
    for (let i = 0; i + 1 < chain.length && i < 4; i++) {
      const w = Math.max(1, chain[i + 1].weeksBefore - (chain[i].weeksBefore || 0));
      const parts = audienceFraction(chain[i].artist, chain[i + 1].artist, w, band, cfg);
      if (parts.length && parts.every((p) => p.rate > (cfg.audience[band] || cfg.audience.unknown).lo)) positive++;
      else break;
    }
    const table = [0, 5, 10, 20];
    const pts = Math.min(max, table[Math.min(positive, 3)]);
    c.sustained = { pts, max, available: max > 0, inputs: { weeksPositive: positive, snapshots }, note: max ? "" : "needs two or more snapshots" };
    if (positive >= 2) evidence.push(`${positive} consecutive weeks of audience growth`);
  }

  // --- Independent validation (15): distinct outlets in 28 days, multi-country charts
  {
    const recent = (current.press || []).filter((p) => !p.date || daysAgo(p.date, new Date(week.now || Date.now())) <= 28);
    const outlets = [...new Set(recent.map((p) => p.outlet))];
    const table = cfg.validation.outlets;
    let pts = table[Math.min(outlets.length, table.length - 1)];
    const countries = new Set((current.charts || []).filter((x) => x.source === "apple").map((x) => x.country));
    if (countries.size >= 2) pts = Math.min(15, pts + cfg.validation.multiCountryBonus);
    c.validation = { pts, max: 15, available: true, inputs: { outlets, chartCountries: [...countries] }, note: "" };
    if (outlets.length) evidence.push(`Press: ${outlets.join(", ")}`);
    if (countries.size >= 2) evidence.push(`Charting in ${countries.size} Apple Music storefronts`);
  }

  // --- Breakout significance (10): chart reach relative to the artist's size, release-age aware
  {
    const b = cfg.breakout;
    const charts = current.charts || [];
    const prevCharts = new Set((prev0?.artist.charts || []).map((x) => `${x.source}:${x.country}:${x.kind}:${x.title}`));
    let pts = 0;
    let recentRelease = false;
    if (charts.length) {
      const best = charts.reduce((a, x) => (x.position < a.position ? x : a));
      const isNew = !prevCharts.has(`${best.source}:${best.country}:${best.kind}:${best.title}`);
      recentRelease = best.releaseDate ? daysAgo(best.releaseDate, new Date(week.now || Date.now())) <= b.recentDays : false;
      pts = (b.chartByBand[band] ?? b.chartByBand.unknown) * (isNew ? 1 : 0.5) * (recentRelease ? 1 : 0.6);
      evidence.push(`${best.source === "apple" ? "Apple Music " + best.country.toUpperCase() : "Deezer global"} ${best.kind} #${best.position}: "${best.title}"${isNew ? " (new entry)" : ""}`);
    } else if (current.deezer?.fans != null && current.deezer.topTracks?.length && context.bandMedianRank?.[band] != null) {
      // Deezer's track rank is a popularity index (~0–1,000,000). "Out of proportion" means well above the
      // median top-track rank of artists the same size in this week's pool, not a raw ratio to fan count.
      const topTrack = current.deezer.topTracks.reduce((a, t) => ((t.rank || 0) > (a.rank || 0) ? t : a));
      const top = topTrack.rank || 0;
      const ratio = top / context.bandMedianRank[band];
      const small = band === "micro" || band === "small";
      recentRelease = topTrack.releaseDate ? daysAgo(topTrack.releaseDate, new Date(week.now || Date.now())) <= b.recentDays : false;
      if (ratio >= b.ratio.strong) pts = small ? 6 : 3;
      else if (ratio >= b.ratio.mild) pts = small ? 3 : 1;
      if (pts && !recentRelease) pts = pts / 2;
      if (pts) evidence.push(`Top track "${topTrack.title}" rank ${fmt(top)}, ${ratio.toFixed(1)}× the ${band}-band median${topTrack.releaseDate ? ` (released ${topTrack.releaseDate})` : ""}`);
    }
    const available = charts.length > 0 || (current.deezer?.fans != null && context.bandMedianRank?.[band] != null);
    c.breakout = { pts: round(pts), max: available ? 10 : 0, available, inputs: { chartEntries: charts.length, recentRelease }, note: available ? "" : "no chart or Deezer data" };
  }

  // --- Editorial relevance (5): set by the editorial run, never by the data run
  c.editorial = { pts: 0, max: 5, available: false, inputs: {}, note: "assigned in the editorial run" };

  const dataComponents = ["streaming", "audience", "sustained", "validation", "breakout"];
  const total = round(dataComponents.reduce((n, k) => n + c[k].pts, 0));
  const dataMax = dataComponents.reduce((n, k) => n + c[k].max, 0);
  const coverage = round(dataMax / 95);
  const sources = ["deezer", "lastfm"].filter((k) => current[k]).length + (current.charts?.length ? 1 : 0) + (current.press?.length ? 1 : 0);

  let category;
  if (band === "established") category = "Second Wave";
  else if (c.breakout.pts >= 6 && c.breakout.inputs.recentRelease) category = "Breakout Track";
  else if (c.sustained.pts >= 10) category = "Rising Momentum";
  else if (band === "micro" || band === "small") category = "Early Signal";
  else category = "Rising Momentum";

  if (!current.mbid) flags.push("identity: no MusicBrainz match yet");
  const notes = [];
  if (current.identityConflict) notes.push("MusicBrainz links a different Deezer artist; editorial run must confirm identity");

  return { total, coverage, dataMax, band, category, components: c, sources, flags, notes, evidence, rosterMember };
}

export function gate(score, config) {
  const t = config.thresholds;
  const need = score.category === "Second Wave" ? t.secondWave : t.publish;
  const reasons = [];
  if (score.total < need) reasons.push(`score ${score.total} < ${need}`);
  if (score.coverage < t.minCoverage) reasons.push(`coverage ${Math.round(score.coverage * 100)}% < ${Math.round(t.minCoverage * 100)}%`);
  if (score.sources < t.minSources) reasons.push(`${score.sources} source(s) < ${t.minSources}`);
  if (score.flags.length) reasons.push(...score.flags);
  if (score.rosterMember) reasons.push("already on Sub Signal");
  return { pass: reasons.length === 0, reasons };
}

const round = (n) => Math.round(n * 10) / 10;
const fmt = (n) => (n == null ? "n/a" : Number(n).toLocaleString("en-US"));
const pctFmt = (r) => (r == null ? "n/a" : `${r >= 0 ? "+" : ""}${(r * 100).toFixed(1)}%`);
