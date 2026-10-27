/**
 * Failure drills: every source down, flaky, rate-limited, malformed or
 * partial. The run must finish, mark the source, and never invent a value.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
import { createHttp } from "../lib/http.mjs";
import { deezer } from "../sources/deezer.mjs";
import { lastfm } from "../sources/lastfm.mjs";
import { apple } from "../sources/apple.mjs";
import { press, parseFeed, matchPress } from "../sources/press.mjs";
import { musicbrainz } from "../sources/musicbrainz.mjs";
import { buildPool } from "../pool.mjs";
import { collect } from "../collect.mjs";
import { buildShortlist, renderReport } from "../shortlist.mjs";
import { readJson, DATA } from "../lib/util.mjs";

const config = { ...readJson(path.join(DATA, "config.json")), appleCountries: ["us"], pressFeeds: [{ outlet: "Feed A", url: "https://a.example/feed" }, { outlet: "Feed B", url: "https://b.example/feed" }] };
const res = (body, status = 200, json = true) => ({ ok: status < 400, status, json: async () => body, text: async () => (json ? JSON.stringify(body) : body) });
const fakeFetch = (routes) => async (url) => {
  for (const [re, handler] of routes) if (re.test(url)) return typeof handler === "function" ? handler(url) : handler;
  return res({ error: "no route" }, 404);
};
const http = (routes) => createHttp({ fetchImpl: fakeFetch(routes), baseDelayMs: 1, log: () => {} });

test("a source that keeps failing resolves undefined after retries, never a fake value", async () => {
  const h = http([[/api\.deezer\.com/, () => res({}, 503)]]);
  const dz = deezer(h);
  assert.equal(await dz.artist(1), undefined);
  assert.ok(h.stats["api.deezer.com"].retried >= 3);
});

test("429 then 200 recovers", async () => {
  let n = 0;
  const h = http([[/api\.deezer\.com\/artist\/1$/, () => (n++ === 0 ? res({}, 429) : res({ id: 1, name: "A", nb_fan: 10, link: "l" }))]]);
  const a = await deezer(h).artist(1);
  assert.equal(a.fans, 10);
});

test("Deezer quota body (code 4) is retried, 'not found' (code 800) is null", async () => {
  let n = 0;
  const h = http([
    [/artist\/1$/, () => (n++ === 0 ? res({ error: { code: 4, message: "Quota limit exceeded" } }) : res({ id: 1, name: "A", nb_fan: 5, link: "l" }))],
    [/artist\/2$/, () => res({ error: { code: 800, message: "no data" } })],
  ]);
  const dz = deezer(h, { quotaWaitMs: 1 });
  assert.equal((await dz.artist(1)).fans, 5);
  assert.equal(await dz.artist(2), null);
});

test("Deezer search accepts exact names only", async () => {
  const h = http([[/search\/artist/, () => res({ data: [{ id: 9, name: "Chalk Dinosaur", nb_fan: 1 }, { id: 3, name: "CHALK", nb_fan: 2 }] })]]);
  const a = await deezer(h).searchArtist("Chalk");
  assert.equal(a.id, 3);
  assert.equal(await deezer(h).searchArtist("Chalkboard"), null);
});

test("Last.fm without a key is disabled, with a key handles unknown artists and malformed bodies", async () => {
  assert.equal(lastfm(http([]), { apiKey: "" }).enabled, false);
  const h = http([
    [/mbid=unknown/, () => res({ error: 6, message: "The artist you supplied could not be found" })],
    [/artist=Nobody/, () => res({ error: 6 })],
    [/mbid=broken/, () => res("<html>oops</html>")],
    [/mbid=good/, () => res({ artist: { name: "Good", url: "u", stats: { listeners: "100", playcount: "2000" }, tags: { tag: [{ name: "pop" }] } } })],
  ]);
  const lf = lastfm(h, { apiKey: "k" });
  assert.equal(await lf.artistInfo({ mbid: "unknown", name: "Nobody" }), null);
  assert.equal(await lf.artistInfo({ mbid: "broken" }), null); // no artist object = not found, not a guess
  assert.deepEqual(await lf.artistInfo({ mbid: "good" }), { name: "Good", mbid: null, url: "u", listeners: 100, playcount: 2000, tags: ["pop"] });
});

test("Apple feed with a malformed body is unavailable", async () => {
  const h = http([[/apple\.com/, () => res({ feed: { results: "nope" } })]]);
  assert.equal(await apple(h).mostPlayed("us"), undefined);
});

test("RSS and Atom parse; CDATA and entities are decoded", () => {
  const rss = `<rss><channel><item><title><![CDATA[Nia Archives announces new EP &amp; tour]]></title><link>https://x/1</link><pubDate>Mon, 20 Oct 2026 10:00:00 GMT</pubDate></item></channel></rss>`;
  const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><entry><title type="html">Cola share &#8220;Keys&#8221;</title><link rel="alternate" href="https://x/2"/><published>2026-10-21T10:00:00Z</published></entry></feed>`;
  const a = parseFeed(rss), b = parseFeed(atom);
  assert.equal(a[0].title, "Nia Archives announces new EP & tour");
  assert.equal(a[0].url, "https://x/1");
  assert.equal(b[0].title, "Cola share “Keys”");
  assert.equal(b[0].url, "https://x/2");
});

test("press matching: whole words, weak names need a music word, common words never match", () => {
  const items = [
    { outlet: "A", title: "Nia Archives announces tour", url: "u", date: null },
    { outlet: "A", title: "Cola share new single", url: "u", date: null },
    { outlet: "A", title: "Coca-Cola sponsors festival", url: "u", date: null },
    { outlet: "A", title: "The Pill: our favourite indie band", url: "u", date: null },
    { outlet: "A", title: "Love is in the air", url: "u", date: null },
  ];
  const m = matchPress(items, ["Nia Archives", "Cola", "The Pill", "Love", "Nia"]);
  assert.equal(m.get("Nia Archives").length, 1);
  assert.equal(m.get("Cola").length, 1); // only the one with "single"
  assert.equal(m.get("The Pill").length, 1);
  assert.equal(m.has("Love"), false);
  assert.equal(m.has("Nia"), false); // contained in the longer matching name "Nia Archives"
});

test("press: one dead feed is partial, all dead is unavailable", async () => {
  const xml = `<rss><channel><item><title>Hello</title><link>https://x</link></item></channel></rss>`;
  const some = press(http([[/a\.example/, () => res(xml, 200, false)], [/b\.example/, () => res("", 500, false)]]), config.pressFeeds);
  const r = await some.items();
  assert.equal(r.feedsOk, 1);
  const none = press(http([[/example/, () => res("", 500, false)]]), config.pressFeeds);
  assert.equal(await none.items(), undefined);
});

test("MusicBrainz: confident exact match only, ambiguity flagged, links parsed", async () => {
  const h = http([
    [/artist\/\?query=artist%3A%22Chalk%22/, () => res({ artists: [{ id: "m1", name: "Chalk", score: 100, type: "Group" }, { id: "m2", name: "Chalk", score: 95, type: "Person" }] })],
    [/artist\/\?query=artist%3A%22Nobody%22/, () => res({ artists: [{ id: "m3", name: "Nobody Else", score: 60 }] })],
    [/artist\/m1\?inc=url-rels/, () => res({ relations: [{ type: "free streaming", url: { resource: "https://www.deezer.com/artist/123" } }, { type: "official homepage", url: { resource: "https://chalk.band" } }, { type: "wikidata", url: { resource: "https://www.wikidata.org/wiki/Q42" } }] })],
  ]);
  const mb = musicbrainz(h);
  const hit = await mb.search("Chalk");
  assert.equal(hit.mbid, "m1");
  assert.equal(hit.ambiguous, true);
  assert.equal(await mb.search("Nobody"), null);
  const links = await mb.links("m1");
  assert.equal(links.deezerId, 123);
  assert.equal(links.website, "https://chalk.band");
  assert.equal(links.wikidataId, "Q42");
});

/** A whole run with fake sources: Apple down, Last.fm disabled, one artist already on the roster. */
async function fakeRun({ appleDown = false, deezerDown = false } = {}) {
  const log = () => {};
  const dzArtists = { 1: { id: 1, name: "Roster One", nb_fan: 20000, link: "l" }, 2: { id: 2, name: "Newcomer", nb_fan: 3000, link: "l" } };
  const routes = [
    [/apple\.com/, () => (appleDown ? res({}, 503) : res({ feed: { results: [{ id: "s1", name: "Song", artistName: "Newcomer", artistId: "a2", artistUrl: "u", releaseDate: "2026-10-20", url: "u", genres: [{ name: "Pop" }] }, { id: "s2", name: "Hit", artistName: "Roster One", artistId: "a1", artistUrl: "u", releaseDate: "2020-01-01", url: "u", genres: [] }] } }))],
    [/api\.deezer\.com\/chart/, () => res({ data: [] })],
    [/api\.deezer\.com\/artist\/(\d+)\/top/, () => res({ data: [{ id: 7, title: "Song", rank: 400000, album: { title: "A" }, link: "l" }] })],
    [/api\.deezer\.com\/artist\/(\d+)$/, (url) => (deezerDown ? res({}, 503) : res(dzArtists[url.match(/artist\/(\d+)$/)[1]] || { error: { code: 800 } }))],
    [/api\.deezer\.com\/search\/artist/, (url) => (deezerDown ? res({}, 503) : res({ data: Object.values(dzArtists).filter((a) => url.includes(encodeURIComponent(a.name))) }))],
    [/musicbrainz\.org\/ws\/2\/artist\/\?query/, (url) => res({ artists: url.includes("Newcomer") ? [{ id: "mb-new", name: "Newcomer", score: 100 }] : [] })],
    [/musicbrainz\.org\/ws\/2\/artist\/mb-new/, () => res({ relations: [{ type: "free streaming", url: { resource: "https://www.deezer.com/artist/2" } }] })],
    [/example\/feed/, () => res(`<rss><channel><item><title>Newcomer shares debut single</title><link>https://p/1</link><pubDate>Fri, 24 Oct 2026 10:00:00 GMT</pubDate></item></channel></rss>`, 200, false)],
  ];
  const h = http(routes);
  const src = { deezer: deezer(h, { quotaWaitMs: 1 }), lastfm: lastfm(h, { apiKey: "" }), apple: apple(h), press: press(h, config.pressFeeds, { now: new Date("2026-10-27T00:00:00Z") }), musicbrainz: musicbrainz(h) };
  const ledger = { version: 1, artists: {}, names: {} };
  const roster = [{ slug: "roster-one", name: "Roster One", deezerId: 1, draft: false }];
  const week = "2026-W44";
  const pool = await buildPool({ config, ledger, roster, src, log, week });
  const snapshot = await collect({ pool, ledger, config, src, log, week, now: new Date("2026-10-27T00:00:00Z") });
  const shortlist = buildShortlist({ snapshot, history: [], ledger, config, now: new Date("2026-10-27T00:00:00Z") });
  return { pool, snapshot, shortlist, ledger, report: renderReport(shortlist, snapshot, config) };
}

test("end to end with fakes: duplicates collapse, roster never qualifies, sources reported, nothing invented", async () => {
  const { pool, snapshot, shortlist, ledger, report } = await fakeRun();
  assert.equal(pool.entries.length, 2); // "Roster One" appears in roster AND the chart → one entry
  const newcomer = snapshot.artists["mb:mb-new"];
  assert.ok(newcomer, "newcomer keyed by MusicBrainz id");
  assert.equal(newcomer.deezer.fans, 3000);
  assert.equal(newcomer.lastfm, null);
  assert.equal(newcomer.press.length, 2); // the same headline from both fake feeds = two outlets
  assert.equal(new Set(newcomer.press.map((p) => p.outlet)).size, 2);
  assert.equal(snapshot.sources.lastfm, "disabled");
  assert.equal(snapshot.sources.apple, "ok");
  const rosterKey = ledger.names["rosterone"];
  assert.equal(ledger.artists[rosterKey].status, "roster");
  assert.equal(shortlist.eligible.length, 0); // baseline week, nothing can reach 75
  assert.ok(shortlist.baseline);
  assert.ok(report.includes("Baseline week"));
  assert.ok(report.includes("Last.fm key not configured"));
  assert.ok(!shortlist.watch.some((w) => w.name === "Roster One"));
});

test("end to end: Apple down is reported as unavailable and the run still completes", async () => {
  const { snapshot, report } = await fakeRun({ appleDown: true });
  assert.equal(snapshot.sources.apple, "unavailable");
  assert.ok(report.includes("apple was unavailable"));
});

test("end to end: Deezer down leaves deezer null on every artist, never a number", async () => {
  const { snapshot } = await fakeRun({ deezerDown: true });
  assert.equal(snapshot.sources.deezer, "unavailable");
  for (const a of Object.values(snapshot.artists)) assert.equal(a.deezer, null);
});
