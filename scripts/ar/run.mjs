/**
 * The weekly A&R data run.
 *
 *   npm run ar:run                 full run for the current ISO week
 *   npm run ar:run -- --limit 40   roster + 40 pool artists (local testing)
 *   npm run ar:run -- --week 2026-W44
 *
 * Writes:  data/ar/snapshots/<week>.json   every artist's numbers this week
 *          data/ar/artists.json            the ledger (identities, statuses, score history)
 *          data/ar/shortlists/<week>.json  scored shortlist + watchlist
 *          data/ar/reports/<week>.md       the weekly report
 *
 * Exit code 1 only when nothing could be measured (Deezer down and Last.fm
 * down or disabled), so a scheduled run fails loudly instead of writing an
 * empty snapshot.
 */
import fs from "fs";
import path from "path";
import { DATA, isoWeek, readJson, writeJson, readRoster } from "./lib/util.mjs";
import { createHttp } from "./lib/http.mjs";
import { deezer } from "./sources/deezer.mjs";
import { lastfm } from "./sources/lastfm.mjs";
import { apple } from "./sources/apple.mjs";
import { press } from "./sources/press.mjs";
import { musicbrainz } from "./sources/musicbrainz.mjs";
import { buildPool } from "./pool.mjs";
import { collect } from "./collect.mjs";
import { buildShortlist, renderReport } from "./shortlist.mjs";

const args = process.argv.slice(2);
const flag = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const limit = Number(flag("limit") || 0);
const week = flag("week") || isoWeek();
const log = (m) => console.error(m);

const config = readJson(path.join(DATA, "config.json"));
const ledgerFile = path.join(DATA, "artists.json");
const ledger = readJson(ledgerFile, { version: 1, artists: {}, names: {} });
const roster = readRoster().filter((r) => !r.draft);

const http = createHttp({ log });
const src = { deezer: deezer(http), lastfm: lastfm(http), apple: apple(http), press: press(http, config.pressFeeds), musicbrainz: musicbrainz(http) };

const t0 = Date.now();
log(`A&R data run · week ${week} · roster ${roster.length} · Last.fm ${src.lastfm.enabled ? "on" : "OFF (no LASTFM_API_KEY)"}${limit ? ` · limit ${limit}` : ""}`);

log("Pool");
const pool = await buildPool({ config, ledger, roster, src, log, week, limit });
log(`  ${pool.stats.total} artists (${JSON.stringify(pool.stats)})`);

log("Collect");
const snapshot = await collect({ pool, ledger, config, src, log, week });

const snapDir = path.join(DATA, "snapshots");
const history = fs.existsSync(snapDir)
  ? fs
      .readdirSync(snapDir)
      .filter((f) => f.endsWith(".json") && f !== `${week}.json`)
      .sort()
      .reverse()
      .slice(0, config.historyWeeks)
      .map((f) => readJson(path.join(snapDir, f)))
  : [];

log(`Score (${history.length} earlier snapshot${history.length === 1 ? "" : "s"})`);
const shortlist = buildShortlist({ snapshot, history, ledger, config });
const report = renderReport(shortlist, snapshot, config);

writeJson(path.join(snapDir, `${week}.json`), snapshot);
writeJson(ledgerFile, ledger);
writeJson(path.join(DATA, "shortlists", `${week}.json`), shortlist);
fs.mkdirSync(path.join(DATA, "reports"), { recursive: true });
fs.writeFileSync(path.join(DATA, "reports", `${week}.md`), report);

log(`Done in ${Math.round((Date.now() - t0) / 1000)}s · sources ${JSON.stringify(snapshot.sources)} · eligible ${shortlist.eligible.length} · watch ${shortlist.watch.length}`);
log(`  http ${JSON.stringify(http.stats)}`);
process.stdout.write(report);

const measured = snapshot.sources.deezer !== "unavailable" || snapshot.sources.lastfm === "ok" || snapshot.sources.lastfm === "partial";
if (!measured) {
  log("FATAL: no metric source answered; snapshot written but the run is marked failed");
  process.exit(1);
}
