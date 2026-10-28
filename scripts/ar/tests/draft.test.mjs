import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStub, insertStub, buildSignal, upsertOrigin, upsertDrop } from "../draft.mjs";
import { project } from "../lib/project.mjs";

test("map projection reproduces the existing pins", () => {
  const close = (a, b) => Math.abs(a - b) <= 0.15;
  const linwood = project(39.34, -74.57);
  assert.ok(close(linwood.x, 308.4) && close(linwood.y, 160.2), JSON.stringify(linwood));
  const leeds = project(53.8, -1.55);
  assert.ok(close(leeds.x, 496.3) && close(leeds.y, 114.7), JSON.stringify(leeds));
  const la = project(34.05, -118.24);
  assert.ok(close(la.x, 189.8) && close(la.y, 177.2), JSON.stringify(la));
});

test("stub matches the artists.ts shape, is a draft, and inserts before the export", () => {
  const stub = buildStub({ name: "New Act", slug: "new-act", number: "50", category: "Early Signal", area: "Leeds, England", genres: ["jungle", "electronic"], links: { spotify: "https://open.spotify.com/artist/x", instagram: "https://instagram.com/newact" }, featuredDate: "2026-11-02" });
  assert.match(stub, /slug: "new-act"/);
  assert.match(stub, /cardTag: "Early Signal"/);
  assert.match(stub, /draft: true/);
  assert.match(stub, /genres: \["Jungle","Electronic"\]/);
  assert.match(stub, /location: "Leeds, England"/);
  assert.match(stub, /featuredDate: "2026-11-02"/);
  const src = `const ALL_ARTISTS = [\n  {\n    id: "a",\n    slug: "a",\n  },\n];\n\nexport const ARTISTS = ALL_ARTISTS;\n`;
  const out = insertStub(src, stub, "new-act");
  assert.ok(out.indexOf('slug: "new-act"') < out.indexOf("export const ARTISTS"));
  assert.throws(() => insertStub(out, stub, "new-act"), /already exists/);
});

test("signal entry carries only data-run numbers and leaves prose as TODO", () => {
  const sl = { key: "mb:1", total: 81, coverage: 0.85, band: "small", category: "Breakout Track", components: { streaming: { pts: 20, max: 25 } }, evidence: ["Deezer fans 10,000 → 14,000 (+40.0%/wk)", "Press: NME"] };
  const snap = { recordedAt: "2026-11-02T15:10:00Z", deezer: { fans: 14000, topTracks: [{ id: 1, title: "Low", rank: 300000 }, { id: 2, title: "High", rank: 700000, releaseDate: "2026-10-20" }] }, charts: [{ source: "apple", country: "gb", kind: "songs", position: 70, title: "High", url: "https://music.apple.com/x" }], press: [{ outlet: "NME", title: "New Act shares High", url: "https://nme.com/x", date: "2026-10-30T00:00:00Z" }] };
  const s = buildSignal({ shortlistEntry: sl, snapshotArtist: snap, week: "2026-W45", computedAt: snap.recordedAt, links: { spotify: "s", instagram: "i", deezer: "d" } });
  assert.equal(s.score.total, 81);
  assert.equal(s.category, "Breakout Track");
  assert.deepEqual(s.featuredRelease, { title: "High", released: "2026-10-20" });
  assert.equal(s.evidence[0].source, "https://music.apple.com/x");
  assert.ok(s.evidence.some((e) => e.label.startsWith("NME:")));
  assert.ok(s.evidence.some((e) => e.label.startsWith("Deezer fans")));
  assert.match(s.whyWatching, /^TODO/);
  assert.deepEqual(Object.keys(s.links), ["spotify", "deezer"]); // instagram is not a listening link
});

test("origins upsert appends a pin and replaces an existing one", () => {
  const src = `export const ORIGINS: Origin[] = [\n {\n  "slug": "a",\n  "label": "A",\n  "precision": "city",\n  "x": 1,\n  "y": 2\n }\n];\nexport const VIEWS = {};\n`;
  const one = upsertOrigin(src, { slug: "b", label: "B", precision: "city", x: 3, y: 4 });
  assert.match(one, /"slug": "a"[\s\S]*"slug": "b"/);
  const two = upsertOrigin(one, { slug: "b", label: "B2", precision: "region", x: 5, y: 6 });
  assert.equal((two.match(/"slug": "b"/g) || []).length, 1);
  assert.match(two, /"label": "B2"/);
  assert.match(two, /\];\nexport const VIEWS/);
});

test("drops upsert creates this week's edition once and adds slugs to it", () => {
  const src = `export const DROPS: Drop[] = [\n  {\n    id: "003",\n    date: "2026-03-31",\n    title: "Vol. 003",\n    summary: "x",\n    featuredArtistSlugs: ["mk-gee"],\n  },\n];\n`;
  const a = upsertDrop(src, { week: "2026-W45", slug: "new-act", date: "2026-11-02" });
  assert.match(a, /id: "004"/);
  assert.match(a, /Vol\. 004 — Week 45/);
  const b = upsertDrop(a, { week: "2026-W45", slug: "other-act", date: "2026-11-02" });
  assert.equal((b.match(/id: "004"/g) || []).length, 1);
  assert.match(b, /featuredArtistSlugs: \["new-act", "other-act"\]/);
  assert.equal(upsertDrop(b, { week: "2026-W45", slug: "other-act", date: "2026-11-02" }), b);
});
