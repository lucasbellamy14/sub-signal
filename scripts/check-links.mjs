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
// Which artists cite each URL, so a cited page can be checked for the artist's name.
// Drafts are always name-checked (the editorial run's gate); --strict checks everyone.
const strict = process.argv.includes("--strict");
const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const citedBy = new Map();
for (const b of blocks) {
  const name = (b.match(/name: "([^"]+)"/) || [])[1];
  const draft = /draft:\s*true/.test(b);
  for (const m of b.matchAll(/sources: \[([^\]]*)\]/g)) for (const x of m[1].matchAll(/"([^"]+)"/g)) {
    if (!citedBy.has(x[1])) citedBy.set(x[1], []);
    citedBy.get(x[1]).push({ name, draft });
  }
}
let warned = 0;
for (const [u, who] of citedBy) {
  const label = u.replace(/^https?:\/\//, "").slice(0, 70);
  try {
    const res = await fetch(u, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (SubSignal link checker)" } });
    if (res.ok) {
      const toCheck = who.filter((w) => strict || w.draft);
      if (toCheck.length) {
        const text = norm((await res.text()).slice(0, 400000).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " "));
        for (const w of toCheck) {
          const found = text.includes(norm(w.name)) || norm(w.name).split(" ").filter((t) => t.length > 3).every((t) => text.includes(t));
          report(found, label, found ? `mentions ${w.name}` : `page does not mention "${w.name}" — wrong source or paywalled; cite a page that names the artist`);
        }
      } else report(true, label);
    }
    else if ([401, 402, 403, 429].includes(res.status)) { warned++; console.log(`  warn  ${label} — site blocks automated checks (HTTP ${res.status}); check by hand`); }
    else report(false, u, `HTTP ${res.status}`);
  } catch (e) {
    report(false, u, e.message);
  }
}
if (warned) console.log(`  (${warned} source link(s) could not be checked automatically)`);

console.log("\nPhotos (a local file, a recorded Deezer hotlink, or generative art for drafts that have neither)");
const photosMeta = JSON.parse(fs.existsSync(path.join(ROOT, "src", "data", "photos.json")) ? read("src/data/photos.json") : "{}");
for (const b of blocks) {
  const draft = /draft:\s*true/.test(b);
  const slug = (b.match(/slug: "([^"]+)"/) || [])[1];
  const local = fs.existsSync(path.join(ROOT, "public", "images", "artists", `${slug}.jpg`));
  const meta = photosMeta[slug];
  if (meta?.url) {
    const r = await fetch(meta.url, { method: "GET", redirect: "follow" }).catch(() => null);
    report(Boolean(r && r.ok), slug, r && r.ok ? "hotlink ok" : "hotlinked photo is unreachable");
  } else if (local) {
    if (meta?.source === "commons" && (!meta.license || !meta.sourceUrl)) report(false, slug, "Commons photo without a licence/credit in photos.json");
    else report(true, slug, meta?.source === "commons" ? `Commons, ${meta.license}` : "");
  } else if (draft) report(true, slug, "no photo: generative art will be used");
  else report(true, slug, "no photo: generative art");
}

console.log(bad ? `\n${bad} problem(s) found.` : "\nAll links and photos check out.");
process.exit(bad ? 1 : 0);
