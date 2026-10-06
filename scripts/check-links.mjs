/**
 * Checks every video and Spotify link in the site's data files.
 *
 *   npm run check-links
 *
 * - YouTube videos (src/data/sessions.ts): must exist AND allow embedding
 *   (YouTube's oEmbed returns 404 for missing/private, 403 for embedding off)
 * - Spotify tracks and artist pages (src/data/artists.ts): must resolve
 * - Photos: every artist needs public/images/artists/{slug}.jpg
 *
 * Exits with an error if anything is broken, so it can gate a deploy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

async function oembed(endpoint, url) {
  const res = await fetch(`${endpoint}${encodeURIComponent(url)}`);
  if (!res.ok) {
    const why = res.status === 403 ? "embedding disabled" : res.status === 404 ? "not found" : `HTTP ${res.status}`;
    return { ok: false, why };
  }
  const d = await res.json();
  return { ok: true, title: d.title, author: d.author_name };
}

let bad = 0;
const report = (ok, label, detail) => {
  if (!ok) bad++;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);
};

console.log("YouTube videos");
for (const m of read("src/data/sessions.ts").matchAll(/id: "([^"]+)"[\s\S]*?videoUrl: "([^"]+)"/g)) {
  const r = await oembed("https://www.youtube.com/oembed?format=json&url=", m[2]);
  report(r.ok, m[1], r.ok ? `${r.title} (${r.author})` : r.why);
}

const artists = read("src/data/artists.ts");
const blocks = artists.split(/\n  \{\n    id:/).slice(1);

console.log("\nSpotify");
for (const b of blocks) {
  const name = (b.match(/name: "([^"]+)"/) || [])[1];
  const track = (b.match(/spotifyTrackId: "([^"]+)"/) || [])[1];
  const artist = (b.match(/\n    spotify: "([^"]+)"/) || [])[1];
  if (track) {
    const r = await oembed("https://open.spotify.com/oembed?url=", `https://open.spotify.com/track/${track}`);
    report(r.ok, `${name} track`, r.ok ? r.title : r.why);
  }
  if (artist) {
    const r = await oembed("https://open.spotify.com/oembed?url=", artist);
    report(r.ok, `${name} artist page`, r.ok ? r.title : r.why);
  }
}

console.log("\nSource links (every URL cited in a timeline)");
const urls = [...new Set([...artists.matchAll(/sources: \[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])))];
let warned = 0;
for (const u of urls) {
  try {
    const res = await fetch(u, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (SubSignal link checker)" } });
    if (res.ok) report(true, u.replace(/^https?:\/\//, "").slice(0, 70));
    else if ([401, 402, 403, 429].includes(res.status)) { warned++; console.log(`  warn  ${u.replace(/^https?:\/\//, "").slice(0, 70)} — site blocks automated checks (HTTP ${res.status}); check by hand`); }
    else report(false, u, `HTTP ${res.status}`);
  } catch (e) {
    report(false, u, e.message);
  }
}
if (warned) console.log(`  (${warned} source link(s) could not be checked automatically)`);

console.log("\nPhotos");
for (const b of blocks) {
  if (/draft:\s*true/.test(b)) continue;
  const slug = (b.match(/slug: "([^"]+)"/) || [])[1];
  const ok = fs.existsSync(path.join(ROOT, "public", "images", "artists", `${slug}.jpg`));
  report(ok, slug, ok ? "" : "no photo — run `npm run photos`");
}

console.log(bad ? `\n${bad} problem(s) found.` : "\nAll links and photos check out.");
process.exit(bad ? 1 : 0);
