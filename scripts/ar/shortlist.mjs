/**
 * Scores everyone in the snapshot against earlier snapshots, applies the
 * publish gate, updates ledger statuses, and renders the weekly report.
 */
import { weeksBetween } from "./lib/util.mjs";
import { scoreArtist, gate, bandOf } from "./score.mjs";

export function buildShortlist({ snapshot, history = [], ledger, config, now = new Date() }) {
  const week = snapshot.week;
  const t = config.thresholds;
  const scored = [];
  const context = { bandMedianRank: bandMedians(snapshot, config) };

  for (const [key, cur] of Object.entries(snapshot.artists)) {
    const previous = history
      .filter((h) => h.artists[key])
      .map((h) => ({ week: h.week, weeksBefore: weeksBetween(h.week, week), artist: h.artists[key] }))
      .filter((p) => p.weeksBefore > 0)
      .sort((a, b) => a.weeksBefore - b.weeksBefore);
    const L = ledger.artists[key];
    const rosterMember = cur.pool.includes("roster") || L?.status === "roster";
    const inProgress = L?.status === "drafted" || L?.status === "published";
    const score = scoreArtist({ current: cur, previous, week: { id: week, now }, config, rosterMember: rosterMember || inProgress, context });
    const g = gate(score, config);
    scored.push({ key, name: cur.name, slug: cur.slug, score, gate: g });

    if (L) {
      L.band = score.band;
      L.lastScore = score.total;
      L.lastCategory = score.category;
      L.history = [...(L.history || []).filter((h) => h.week !== week), { week, total: score.total, coverage: score.coverage, category: score.category, band: score.band }].slice(-26);
      if (!rosterMember && !inProgress) {
        if (g.pass) L.status = "shortlisted";
        else if (score.total >= t.watch || (score.total >= t.publish && !g.pass)) {
          if (L.status !== "watchlist") L.watchSince = week;
          L.status = "watchlist";
        } else if (L.status === "watchlist") {
          const best = Math.max(...L.history.map((h) => h.total));
          if (weeksBetween(L.watchSince || week, week) >= config.watchlistExpiryWeeks && score.total < best) L.status = "dropped";
        } else L.status = L.status === "shortlisted" ? "watchlist" : "candidate";
      }
    }
  }

  const byScore = (a, b) => b.score.total - a.score.total;
  const candidates = scored.filter((s) => !s.score.rosterMember);
  const eligible = candidates.filter((s) => s.gate.pass).sort(byScore);
  const watch = candidates.filter((s) => !s.gate.pass && s.score.total >= t.watch).sort(byScore);
  const roster = scored.filter((s) => s.score.rosterMember);
  const rosterMomentum = roster.filter((s) => s.score.components.audience.pts >= 10 || s.score.components.breakout.pts >= 5 || s.score.components.validation.pts >= 6).sort(byScore);
  const excluded = candidates.filter((s) => s.score.total >= t.publish && !s.gate.pass).map((s) => ({ name: s.name, total: s.score.total, reasons: s.gate.reasons }));

  return {
    week,
    baseline: history.length === 0,
    cap: config.weeklyCap,
    eligible: eligible.slice(0, config.weeklyCap).map(pick),
    overflow: eligible.slice(config.weeklyCap).map(pick),
    watch: watch.map(pick),
    rosterMomentum: rosterMomentum.map(pick),
    excluded,
    scored: scored.sort(byScore).map(pick),
    stats: { scored: scored.length, candidates: candidates.length, roster: roster.length, eligible: eligible.length, watch: watch.length, meanCoverage: round(scored.reduce((n, s) => n + s.score.coverage, 0) / Math.max(1, scored.length)) },
  };
}

const pick = (s) => ({ key: s.key, name: s.name, slug: s.slug, total: s.score.total, coverage: s.score.coverage, band: s.score.band, category: s.score.category, components: Object.fromEntries(Object.entries(s.score.components).map(([k, v]) => [k, { pts: v.pts, max: v.max }])), evidence: s.score.evidence, flags: s.score.flags, notes: s.score.notes, gate: s.gate.reasons });
const round = (n) => Math.round(n * 100) / 100;

/** Median top-track rank per size band across this week's pool; null for bands too small to be meaningful. */
export function bandMedians(snapshot, config) {
  const by = {};
  for (const a of Object.values(snapshot.artists)) {
    if (!a.deezer?.topTracks?.length) continue;
    const band = bandOf(a.deezer.fans, config.sizeBands);
    (by[band] ??= []).push(Math.max(...a.deezer.topTracks.map((t) => t.rank || 0)));
  }
  const out = {};
  for (const [band, v] of Object.entries(by)) {
    v.sort((x, y) => x - y);
    out[band] = v.length >= config.scoring.breakout.ratio.minBandSize ? v[Math.floor(v.length / 2)] : null;
  }
  return out;
}

export function renderReport(sl, snapshot, config) {
  const L = [];
  const src = Object.entries(snapshot.sources).map(([k, v]) => `${k} ${v}`).join(" · ");
  L.push(`# SUB SIGNAL WEEKLY A&R REPORT`, ``, `**Week ${sl.week}** · data run only (editorial run not yet enabled)`, ``);
  if (sl.baseline) L.push(`> **Baseline week.** This is the first snapshot, so growth and sustained-momentum components could not be scored (mean coverage ${Math.round(sl.stats.meanCoverage * 100)}%). Only chart, press and breakout-ratio evidence counted. Expect the shortlist to fill in from the second week.`, ``);
  L.push(`**Candidates that clear the publish gate:** ${sl.eligible.length}${sl.overflow.length ? ` (+${sl.overflow.length} over the cap of ${sl.cap})` : ""}`);
  if (sl.eligible.length) {
    L.push(``, `**Top discovery:** ${sl.eligible[0].name}`, `**Why:** ${sl.eligible[0].evidence.slice(0, 2).join(". ") || "see components"}.`, ``, `**Shortlist:**`);
    sl.eligible.forEach((a, i) => L.push(`${i + 1}. **${a.name}** — ${a.category}, ${a.total}/100 (coverage ${Math.round(a.coverage * 100)}%, ${a.band})${a.notes?.length ? ` ⚠ ${a.notes.join("; ")}` : ""}${a.evidence.length ? `\n   - ${a.evidence.join("\n   - ")}` : ""}`));
  }
  L.push(``, `**Watchlist:** ${sl.watch.length} artists under observation`);
  sl.watch.slice(0, 15).forEach((a) => L.push(`- ${a.name} — ${a.total}/100, ${a.category}, ${a.band}${a.gate.length ? ` (${a.gate.join("; ")})` : ""}`));
  if (sl.watch.length > 15) L.push(`- …and ${sl.watch.length - 15} more in the shortlist file`);
  L.push(``, `**Existing artists:** ${sl.rosterMomentum.length} of ${sl.stats.roster} showed renewed momentum`);
  sl.rosterMomentum.slice(0, 10).forEach((a) => L.push(`- ${a.name}${a.slug ? ` (/artists/${a.slug})` : ""} — ${a.evidence.join("; ")}`));
  if (sl.excluded.length) {
    L.push(``, `**Scored high but held back:**`);
    sl.excluded.slice(0, 10).forEach((x) => L.push(`- ${x.name} (${x.total}) — ${x.reasons.join("; ")}`));
  }
  L.push(``, `**Pool:** ${snapshot.pool.total} artists (${snapshot.pool.roster} roster, ${snapshot.pool.appleChart} Apple charts, ${snapshot.pool.deezerChart} Deezer charts, ${snapshot.pool.carried} carried over, ${snapshot.pool.neighbours} neighbours) · ${snapshot.press.headlines} headlines read, ${snapshot.press.matched} artists mentioned`);
  L.push(`**System status:** ${src}`);
  const issues = [];
  for (const [k, v] of Object.entries(snapshot.sources)) if (v === "unavailable" || v === "partial") issues.push(`${k} was ${v}`);
  if (snapshot.sources.lastfm === "disabled") issues.push("Last.fm key not configured, so streaming growth and listener growth cannot be scored");
  L.push(`**Issues:** ${issues.length ? issues.join("; ") : "none"}`, ``, `Thresholds: publish ${config.thresholds.publish} (Second Wave ${config.thresholds.secondWave}), watch ${config.thresholds.watch}, min coverage ${Math.round(config.thresholds.minCoverage * 100)}%, min sources ${config.thresholds.minSources}, cap ${config.weeklyCap}/week.`);
  return L.join("\n") + "\n";
}
