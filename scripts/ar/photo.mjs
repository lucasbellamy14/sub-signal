/**
 * Rights-aware artist photos.
 *
 *   npm run ar:photo -- <slug>                  Commons photo for one artist (via Wikidata), else report
 *   npm run ar:photo -- <slug> --hotlink        ...and fall back to displaying Deezer's image from Deezer's CDN
 *   npm run ar:photo -- --migrate               every published artist: Commons where possible, Deezer hotlink otherwise
 *   npm run ar:photo -- <slug> --qid Q123       force a Wikidata item
 *   add --json for machine-readable output, --keep-local to leave an existing jpg when hotlinking
 *
 * Accepts only CC0, public domain, CC BY and CC BY-SA files from Wikimedia
 * Commons (we crop, so no-derivative licences are out; the site is
 * non-commercial but NC licences are refused anyway to keep the rule simple).
 * Writes public/images/artists/{slug}.jpg (1000×1000, attention crop) and the
 * credit into src/data/photos.json. Nothing with uncertain rights is written.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { ROOT, DATA, norm, readJson, writeJson, readRoster } from "./lib/util.mjs";
import { createHttp } from "./lib/http.mjs";

const OK_LICENSE = /^(cc0|public domain|pd|cc[ -]by(?!-nc)(?!-nd)[ -]?(sa[ -]?)?\d?(\.\d)?)/i;
const BAD_LICENSE = /-nc|-nd|non-?commercial|no ?deriv|all rights reserved|fair use/i;
const UA_HEADERS = {};

export async function findCommonsPhoto(http, { name, qid, mbid, ledger }) {
  // 1. Wikidata item: from the ledger's MusicBrainz links, else a name search filtered to musicians
  let id = qid || null;
  if (!id && ledger) {
    const L = Object.values(ledger.artists).find((a) => norm(a.name) === norm(name) || (mbid && a.mbid === mbid));
    id = L?.links?.wikidataId || null;
  }
  if (!id) {
    const r = await http.json(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&limit=5&format=json`, { minGap: 300 });
    if (!r.ok) return { status: "error", why: "wikidata search failed" };
    const hits = (r.body?.search || []).filter((h) => /musician|singer|band|rapper|producer|\bdj\b|duo|group|songwriter|artist|composer|vocalist/i.test(h.description || "") && norm(h.label) === norm(name));
    if (hits.length !== 1) return { status: "none", why: hits.length ? "ambiguous Wikidata match" : "no Wikidata item" };
    id = hits[0].id;
  }
  // 2. P18 image claim
  const c = await http.json(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${id}&property=P18&format=json`, { minGap: 300 });
  if (!c.ok) return { status: "error", why: "wikidata claims failed" };
  const file = c.body?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!file) return { status: "none", why: `no image on Wikidata ${id}`, qid: id };
  // 3. Commons licence metadata
  const m = await http.json(`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json&titles=${encodeURIComponent("File:" + file)}`, { minGap: 300 });
  if (!m.ok) return { status: "error", why: "commons query failed" };
  const page = Object.values(m.body?.query?.pages || {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) return { status: "none", why: "commons file missing", qid: id };
  const em = ii.extmetadata || {};
  const val = (k) => (em[k]?.value || "").toString();
  const license = val("LicenseShortName") || val("License");
  if (!license || !OK_LICENSE.test(license) || BAD_LICENSE.test(license) || BAD_LICENSE.test(val("Restrictions"))) {
    return { status: "rejected", why: `licence "${license || "unknown"}" not accepted`, qid: id, file };
  }
  if (Math.min(ii.width || 0, ii.height || 0) < 600) return { status: "rejected", why: `too small (${ii.width}×${ii.height})`, qid: id, file };
  const author = val("Artist").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 80) || "Wikimedia Commons contributor";
  return {
    status: "ok",
    qid: id,
    file,
    url: (ii.thumburl || ii.url).split("?")[0],
    width: ii.width,
    height: ii.height,
    credit: { source: "commons", author, license, licenseUrl: val("LicenseUrl") || null, sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}` },
  };
}

export async function saveSquare(http, url, outFile) {
  const r = await fetch(url, { headers: { "User-Agent": "SubSignal-AR/0.1 (https://sub-signal.vercel.app; lucasbellamy14@gmail.com)" } });
  if (!r.ok) throw new Error(`download failed (${r.status})`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  await sharp(buf).rotate().resize(1000, 1000, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toFile(outFile);
  return fs.statSync(outFile).size;
}

export async function deezerHotlink(http, deezerId) {
  if (!deezerId) return null;
  const url = `https://api.deezer.com/artist/${deezerId}/image?size=xl`;
  const r = await fetch(url, { method: "GET", redirect: "follow" });
  if (!r.ok || !/image\//.test(r.headers.get("content-type") || "")) return null;
  // Deezer serves a grey silhouette for artists without a photo; its CDN path carries an empty hash
  if (/\/artist\/\/|d41d8cd98f00b204e9800998ecf8427e/.test(r.url)) return null;
  return { source: "deezer", url, sourceUrl: `https://www.deezer.com/artist/${deezerId}` };
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (n) => {
    const i = args.indexOf(`--${n}`);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const has = (n) => args.includes(`--${n}`);
  const slugArg = args.find((a) => !a.startsWith("--") && !args[args.indexOf(a) - 1]?.startsWith("--"));
  const photosFile = path.join(ROOT, "src", "data", "photos.json");
  const photos = readJson(photosFile, {});
  const ledger = readJson(path.join(DATA, "artists.json"), { artists: {} });
  const http = createHttp({ log: () => {} });
  const roster = readRoster();
  const targets = has("migrate") ? roster.filter((r) => !r.draft) : roster.filter((r) => r.slug === slugArg);
  if (!targets.length) {
    if (slugArg && flag("name")) targets.push({ slug: slugArg, name: flag("name"), deezerId: Number(flag("deezer")) || undefined });
    else {
      console.error("Usage: npm run ar:photo -- <slug> [--hotlink] [--qid Q..] [--name \"...\" --deezer ID] | --migrate");
      process.exit(1);
    }
  }
  const results = [];
  for (const t of targets) {
    const out = path.join(ROOT, "public", "images", "artists", `${t.slug}.jpg`);
    const res = await findCommonsPhoto(http, { name: t.name, qid: flag("qid"), ledger });
    let row = { slug: t.slug, name: t.name, commons: res.status, why: res.why || "" };
    if (res.status === "ok") {
      try {
        const bytes = await saveSquare(http, res.url, out);
        photos[t.slug] = { ...res.credit };
        row.result = `commons ${res.credit.license} by ${res.credit.author} (${Math.round(bytes / 1024)} KB)`;
      } catch (e) {
        row.commons = "error";
        row.why = e.message;
      }
    }
    if (row.commons !== "ok" && (has("hotlink") || has("migrate"))) {
      const hl = await deezerHotlink(http, t.deezerId);
      if (hl) {
        photos[t.slug] = hl;
        if (!has("keep-local") && fs.existsSync(out)) fs.unlinkSync(out);
        row.result = `deezer hotlink (${hl.url})`;
      } else row.result = "no photo: generative art";
    } else if (row.commons !== "ok") row.result = fs.existsSync(out) ? "unchanged (local file kept)" : "no photo: generative art";
    results.push(row);
    if (!has("json")) console.log(`  ${row.commons.padEnd(8)} ${t.slug.padEnd(22)} ${row.result}${row.why && row.commons !== "ok" ? `  (${row.why})` : ""}`);
  }
  writeJson(photosFile, Object.fromEntries(Object.entries(photos).sort()));
  if (has("json")) console.log(JSON.stringify(results, null, 2));
  else {
    const n = (k) => results.filter((r) => r.commons === k).length;
    console.log(`\n${results.length} artist(s): ${n("ok")} Commons, ${results.filter((r) => /hotlink/.test(r.result)).length} Deezer hotlink, ${results.filter((r) => /generative/.test(r.result)).length} generative, ${n("rejected")} rejected licence, ${n("error")} errors`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
