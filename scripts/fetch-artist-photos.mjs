/**
 * Fetch artist photos from Deezer's public API (no key required).
 *
 *   npm run photos              fetch photos for artists that don't have one yet
 *   npm run photos -- --force   re-download everything
 *   npm run photos -- mk-gee    only this slug
 *
 * Reads every { slug, name } from src/data/artists.ts and writes
 * public/images/artists/{slug}.jpg. The site finds the file by that naming
 * convention, and falls back to generative art when a photo is missing.
 *
 * A match is accepted only when Deezer's artist name equals ours (ignoring
 * case/punctuation) so a lookalike artist never sneaks in. Anything that
 * doesn't match exactly is reported so you can drop in a photo by hand.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "images", "artists");
const force = process.argv.includes("--force");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");

export function readArtists() {
  const src = fs.readFileSync(path.join(ROOT, "src", "data", "artists.ts"), "utf8");
  const out = [];
  const re = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) out.push({ slug: m[1], name: m[2] });
  return out;
}

export async function findPhoto(name) {
  const res = await fetch(`https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=10`);
  if (!res.ok) throw new Error(`Deezer search failed (${res.status})`);
  const { data } = await res.json();
  const hit = (data || []).find((a) => norm(a.name) === norm(name));
  if (!hit) return null;
  // Deezer serves a generic grey silhouette when it has no real photo
  const url = hit.picture_xl || hit.picture_big;
  if (!url || /\/images\/artist\/\/|d41d8cd98f00b204e9800998ecf8427e/.test(url)) return null;
  return { url, fans: hit.nb_fan };
}

export async function downloadPhoto(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  const artists = readArtists().filter((a) => !only.length || only.includes(a.slug));
  const missing = [];
  for (const a of artists) {
    const file = path.join(OUT, `${a.slug}.jpg`);
    if (fs.existsSync(file) && !force) {
      console.log(`  skip   ${a.name} (already have a photo)`);
      continue;
    }
    try {
      const photo = await findPhoto(a.name);
      if (!photo) {
        console.log(`  MISS   ${a.name} — no exact match on Deezer`);
        missing.push(a.name);
        continue;
      }
      await downloadPhoto(photo.url, file);
      console.log(`  ok     ${a.name}  (${photo.fans.toLocaleString()} Deezer fans)`);
    } catch (e) {
      console.log(`  ERROR  ${a.name} — ${e.message}`);
      missing.push(a.name);
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  if (missing.length) {
    console.log(`\nNo photo for: ${missing.join(", ")}`);
    console.log("Drop one in by hand as public/images/artists/{slug}.jpg — the site will pick it up.");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
