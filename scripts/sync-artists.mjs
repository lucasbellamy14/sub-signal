/**
 * Records, for every artist in src/data/artists.ts, the extra identifiers the
 * Listen player needs. Writes src/data/artist-meta.json:
 *
 *   { "mk-gee": { "deezerId": 10522875, "featuredTitle": "Are You Looking Up" }, ... }
 *
 *   npm run sync-artists
 *
 * - deezerId:      exact-name Deezer artist match (same rule as the photo script)
 * - featuredTitle: the title of the artist's featured Spotify track (read from
 *                  Spotify's oEmbed), so the player can put that song first.
 *
 * Re-run after adding an artist. Existing entries are kept unless --force.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src", "data", "artist-meta.json");
const force = process.argv.includes("--force");
const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");

const src = fs.readFileSync(path.join(ROOT, "src", "data", "artists.ts"), "utf8");
const blocks = src.split(/\n  \{\n    id:/).slice(1);
const artists = blocks.map((b) => ({
  slug: (b.match(/slug: "([^"]+)"/) || [])[1],
  name: (b.match(/name: "([^"]+)"/) || [])[1],
  track: (b.match(/spotifyTrackId: "([^"]+)"/) || [])[1],
}));

const meta = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};

for (const a of artists) {
  const cur = meta[a.slug] || {};
  if (cur.deezerId && (cur.featuredTitle || !a.track) && !force) {
    console.log(`  skip   ${a.name}`);
    continue;
  }
  const next = { ...cur };
  try {
    const res = await fetch(`https://api.deezer.com/search/artist?q=${encodeURIComponent(a.name)}&limit=10`);
    const hit = ((await res.json()).data || []).find((d) => norm(d.name) === norm(a.name));
    if (hit) next.deezerId = hit.id;
    else console.log(`  MISS   ${a.name} — no exact Deezer match`);

    if (a.track) {
      const o = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent("https://open.spotify.com/track/" + a.track)}`);
      if (o.ok) next.featuredTitle = (await o.json()).title;
      else console.log(`  WARN   ${a.name} — Spotify track ${a.track} not found`);
    }
    meta[a.slug] = next;
    console.log(`  ok     ${a.name}  deezer=${next.deezerId ?? "?"}  featured="${next.featuredTitle ?? "-"}"`);
  } catch (e) {
    console.log(`  ERROR  ${a.name} — ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 250));
}

fs.writeFileSync(OUT, JSON.stringify(meta, null, 2) + "\n");
console.log(`\nWrote ${path.relative(ROOT, OUT)} (${Object.keys(meta).length} artists)`);
