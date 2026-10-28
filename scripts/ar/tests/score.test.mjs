import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
import { scoreArtist, gate, bandOf } from "../score.mjs";
import { readJson, DATA } from "../lib/util.mjs";

const config = readJson(path.join(DATA, "config.json"));
const week = { id: "2026-W45", now: new Date("2026-11-02T15:10:00Z") };
const ctx = { bandMedianRank: { micro: 350000, small: 460000, mid: 900000, established: 825000, unknown: 400000 } };
const artist = (o = {}) => ({ name: "Test Artist", mbid: "mb-1", deezerId: 1, identity: "strong", pool: ["apple-chart"], deezer: { fans: 1000, topTracks: [] }, lastfm: null, charts: [], press: [], ...o });

test("size bands follow config", () => {
  assert.equal(bandOf(10, config.sizeBands), "micro");
  assert.equal(bandOf(5000, config.sizeBands), "small");
  assert.equal(bandOf(50000, config.sizeBands), "mid");
  assert.equal(bandOf(250000, config.sizeBands), "established");
  assert.equal(bandOf(null, config.sizeBands), "unknown");
});

test("baseline week: growth components are unavailable, coverage reflects it, nothing is estimated", () => {
  const s = scoreArtist({ current: artist(), previous: [], week, config, context: ctx });
  assert.equal(s.components.streaming.available, false);
  assert.equal(s.components.audience.available, false);
  assert.equal(s.components.sustained.available, false);
  assert.equal(s.components.validation.available, true);
  assert.equal(s.components.breakout.available, true);
  assert.equal(s.dataMax, 25);
  assert.equal(s.coverage, 0.3);
  assert.equal(s.total, 0);
  assert.equal(gate(s, config).pass, false);
});

test("one week of strong growth on a micro artist earns audience and streaming points", () => {
  const prev = { week: "2026-W44", weeksBefore: 1, artist: artist({ deezer: { fans: 1000, topTracks: [] }, lastfm: { listeners: 2000, playcount: 10000 } }) };
  const cur = artist({ deezer: { fans: 1300, topTracks: [] }, lastfm: { listeners: 2600, playcount: 12000 } });
  const s = scoreArtist({ current: cur, previous: [prev], week, config, context: ctx });
  assert.equal(s.band, "micro");
  assert.equal(s.components.audience.pts, 20);
  assert.equal(s.components.streaming.pts, 25); // play-count rate 20% ≥ hi; rank part unavailable (no top tracks)
  assert.equal(s.components.streaming.max, 25);
  assert.equal(s.components.sustained.max, 5); // two snapshots
  assert.equal(s.components.sustained.pts, 5);
  assert.equal(s.coverage, Math.round(((25 + 20 + 5 + 15 + 10) / 95) * 10) / 10);
  assert.ok(s.evidence.some((e) => e.startsWith("Deezer fans 1,000 → 1,300")));
  assert.equal(s.flags.length, 0);
});

test("absolute floors stop tiny bases from scoring", () => {
  const prev = { week: "2026-W44", weeksBefore: 1, artist: artist({ deezer: { fans: 40, topTracks: [] } }) };
  const cur = artist({ deezer: { fans: 80, topTracks: [] } }); // +100% but only +40 fans
  const s = scoreArtist({ current: cur, previous: [prev], week, config });
  assert.equal(s.components.audience.pts, 0);
});

test("band-adjusted thresholds: the same +0.5% is nothing for a mid artist", () => {
  const prev = { week: "2026-W44", weeksBefore: 1, artist: artist({ deezer: { fans: 100000, topTracks: [] } }) };
  const cur = artist({ deezer: { fans: 100500, topTracks: [] } });
  const s = scoreArtist({ current: cur, previous: [prev], week, config });
  assert.equal(s.band, "mid");
  assert.equal(s.components.audience.pts, 0);
});

test("growth over two weeks is normalised to a weekly rate", () => {
  const prev = { week: "2026-W43", weeksBefore: 2, artist: artist({ deezer: { fans: 1000, topTracks: [] } }) };
  const cur = artist({ deezer: { fans: 1300, topTracks: [] } }); // +30% over 2 weeks = 15%/wk
  const s = scoreArtist({ current: cur, previous: [prev], week, config });
  assert.ok(Math.abs(s.components.audience.inputs.deezerFans - 0.15) < 1e-9);
  assert.ok(s.components.audience.pts > 0 && s.components.audience.pts < 20);
});

test("a fan jump with no corroboration is flagged suspicious and fails the gate", () => {
  const prev = { week: "2026-W44", weeksBefore: 1, artist: artist({ deezer: { fans: 1000, topTracks: [] } }) };
  const cur = artist({ deezer: { fans: 2500, topTracks: [] } });
  const s = scoreArtist({ current: cur, previous: [prev], week, config });
  assert.ok(s.flags.some((f) => f.startsWith("suspicious")));
  assert.equal(gate(s, config).pass, false);
});

test("a fresh chart entry on a micro artist is a Breakout Track with full breakout points", () => {
  const cur = artist({ charts: [{ source: "apple", country: "gb", kind: "songs", position: 78, title: "New Song", releaseDate: "2026-10-20", url: "https://music.apple.com/x" }] });
  const s = scoreArtist({ current: cur, previous: [], week, config });
  assert.equal(s.components.breakout.pts, 10);
  assert.equal(s.category, "Breakout Track");
  assert.ok(s.evidence.some((e) => e.includes("Apple Music GB songs #78")));
});

test("the same chart entry a week later counts half; an old release counts less", () => {
  const entry = { source: "apple", country: "gb", kind: "songs", position: 78, title: "New Song", releaseDate: "2024-01-01", url: "u" };
  const prev = { week: "2026-W44", weeksBefore: 1, artist: artist({ charts: [entry] }) };
  const s = scoreArtist({ current: artist({ charts: [entry] }), previous: [prev], week, config });
  assert.equal(s.components.breakout.pts, 3); // 10 × 0.5 (holder) × 0.6 (old release)
  assert.equal(s.category, "Early Signal");
});

test("validation counts distinct outlets within 28 days and multi-country charting", () => {
  const cur = artist({
    press: [
      { outlet: "NME", title: "x", url: "u", date: "2026-10-30T00:00:00Z" },
      { outlet: "NME", title: "y", url: "u", date: "2026-10-29T00:00:00Z" },
      { outlet: "DIY", title: "z", url: "u", date: "2026-09-01T00:00:00Z" }, // too old
    ],
    charts: [
      { source: "apple", country: "gb", kind: "songs", position: 90, title: "t", releaseDate: "2026-10-20" },
      { source: "apple", country: "au", kind: "songs", position: 95, title: "t", releaseDate: "2026-10-20" },
    ],
  });
  const s = scoreArtist({ current: cur, previous: [], week, config });
  assert.deepEqual(s.components.validation.inputs.outlets, ["NME"]);
  assert.equal(s.components.validation.pts, 6 + 3);
});

test("three consecutive growth weeks earn full sustained points and Rising Momentum", () => {
  const mk = (fans, weeksBefore, w) => ({ week: w, weeksBefore, artist: artist({ deezer: { fans, topTracks: [] } }) });
  const previous = [mk(9000, 1, "2026-W44"), mk(8000, 2, "2026-W43"), mk(7000, 3, "2026-W42")];
  const cur = artist({ deezer: { fans: 10000, topTracks: [] } });
  const s = scoreArtist({ current: cur, previous, week, config });
  assert.equal(s.components.sustained.inputs.weeksPositive, 3);
  assert.equal(s.components.sustained.pts, 20);
  assert.equal(s.category, "Rising Momentum");
});

test("a dip breaks the streak", () => {
  const mk = (fans, weeksBefore, w) => ({ week: w, weeksBefore, artist: artist({ deezer: { fans, topTracks: [] } }) });
  const previous = [mk(9000, 1, "2026-W44"), mk(9500, 2, "2026-W43"), mk(7000, 3, "2026-W42")];
  const s = scoreArtist({ current: artist({ deezer: { fans: 10000, topTracks: [] } }), previous, week, config });
  assert.equal(s.components.sustained.inputs.weeksPositive, 1);
});

test("established artists are Second Wave and need 85", () => {
  const prev = { week: "2026-W44", weeksBefore: 1, artist: artist({ deezer: { fans: 1000000, topTracks: [] }, lastfm: { listeners: 500000, playcount: 9000000 } }) };
  const cur = artist({ deezer: { fans: 1100000, topTracks: [] }, lastfm: { listeners: 560000, playcount: 11000000 }, press: [{ outlet: "NME", title: "x", url: "u", date: "2026-10-30T00:00:00Z" }, { outlet: "DIY", title: "x", url: "u", date: "2026-10-30T00:00:00Z" }] });
  const s = scoreArtist({ current: cur, previous: [prev], week, config });
  assert.equal(s.category, "Second Wave");
  assert.ok(s.total < 85);
  assert.ok(gate(s, config).reasons.some((r) => r.includes("< 85")));
});

test("roster members never pass the gate; missing MusicBrainz identity is flagged", () => {
  const s1 = scoreArtist({ current: artist(), previous: [], week, config, rosterMember: true });
  assert.ok(gate(s1, config).reasons.includes("already on Sub Signal or in draft"));
  const s2 = scoreArtist({ current: artist({ mbid: null }), previous: [], week, config });
  assert.ok(s2.flags.some((f) => f.startsWith("identity")));
});

test("editorial relevance is never scored by the data run", () => {
  const s = scoreArtist({ current: artist(), previous: [], week, config });
  assert.equal(s.components.editorial.pts, 0);
  assert.equal(s.components.editorial.available, false);
});

test("breakout ratio is relative to the band median and halves for an old release", () => {
  const context = { bandMedianRank: { micro: 350000 } };
  const fresh = artist({ deezer: { fans: 1000, topTracks: [{ id: 1, title: "New", rank: 700000, releaseDate: "2026-10-20" }] } });
  const s1 = scoreArtist({ current: fresh, previous: [], week, config, context });
  assert.equal(s1.components.breakout.pts, 6);
  const old = artist({ deezer: { fans: 1000, topTracks: [{ id: 1, title: "Old", rank: 700000, releaseDate: "2021-01-01" }] } });
  const s2 = scoreArtist({ current: old, previous: [], week, config, context });
  assert.equal(s2.components.breakout.pts, 3);
  const typical = artist({ deezer: { fans: 1000, topTracks: [{ id: 1, title: "Meh", rank: 360000, releaseDate: "2026-10-20" }] } });
  assert.equal(scoreArtist({ current: typical, previous: [], week, config, context }).components.breakout.pts, 0);
  // no median for the band (too few artists) → component unavailable, never guessed
  const s4 = scoreArtist({ current: fresh, previous: [], week, config, context: { bandMedianRank: {} } });
  assert.equal(s4.components.breakout.available, false);
});

test("a Deezer/MusicBrainz link mismatch is a note for the editorial run, not a gate failure", () => {
  const s = scoreArtist({ current: artist({ identityConflict: true }), previous: [], week, config });
  assert.equal(s.flags.length, 0);
  assert.equal(s.notes.length, 1);
});
