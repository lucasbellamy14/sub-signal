/**
 * Add a new artist stub and fetch their photo.
 *
 *   npm run add-artist -- "Artist Name" --city "London" --genres "Jungle,Electronic" --born 1999
 *   npm run add-artist -- "Artist Name" --spotify-track 7wLHg91FTqYc2aZKpWmG9r
 *
 * What it does:
 *   1. Appends a stub to src/data/artists.ts marked `draft: true`
 *      (drafts are hidden everywhere on the site, so nothing half-finished goes live)
 *   2. Downloads their photo from Deezer to public/images/artists/{slug}.jpg
 *
 * Then YOU write the story: fill in cardTitle, cardBody, timeline and links in
 * artists.ts, check every fact against a real source, and delete the
 * `draft: true` line to publish.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { findPhoto, downloadPhoto, readArtists } from "./fetch-artist-photos.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "src", "data", "artists.ts");

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const name = args.find((a, i) => !a.startsWith("--") && !(args[i - 1] || "").startsWith("--"));

if (!name) {
  console.log('Usage: npm run add-artist -- "Artist Name" [--city "London"] [--genres "A,B"] [--born 1999] [--spotify-track ID]');
  process.exit(1);
}

const slug = name
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

if (readArtists().some((a) => a.slug === slug)) {
  console.log(`"${slug}" already exists in artists.ts — nothing changed.`);
  process.exit(1);
}

const city = flag("city") || "City";
const genres = (flag("genres") || "Genre").split(",").map((g) => g.trim());
const born = flag("born");
const track = flag("spotify-track");
const number = String(readArtists().length + 1).padStart(2, "0");
const today = new Date().toISOString().slice(0, 10);
const q = (s) => JSON.stringify(s);

const stub = `  {
    id: ${q(slug)},
    slug: ${q(slug)},
    name: ${q(name)},
    meta: ${q(`${city} · ${genres[0]}${born ? ` · b. ${born}` : ""}`)},
    photos: ["", ""],
    photoLabels: ["", ""],
    cardNumber: ${q(number)},
    cardTag: "Discovery",
    cardTitle: "TODO: headline",
    cardBody: "TODO: two-sentence hook.",
    genres: ${JSON.stringify(genres)},${track ? `\n    spotifyTrackId: ${q(track)},` : ""}
    featuredDate: ${q(today)},
    draft: true, // delete this line to publish
    timeline: [
      { year: "TODO", title: "TODO", body: "TODO — verify every fact against a real source." },
    ],
  },
`;

const src = fs.readFileSync(FILE, "utf8");
const marker = "];\n\nexport const ARTISTS";
if (!src.includes(marker)) {
  console.log("Couldn't find the end of the artist list in artists.ts — add the stub by hand.");
  console.log(stub);
  process.exit(1);
}
fs.writeFileSync(FILE, src.replace(marker, stub + marker));
console.log(`Added draft "${name}" (${slug}) to src/data/artists.ts`);

try {
  const photo = await findPhoto(name);
  if (photo) {
    await downloadPhoto(photo.url, path.join(ROOT, "public", "images", "artists", `${slug}.jpg`));
    console.log(`Photo saved: public/images/artists/${slug}.jpg  (Deezer match, ${photo.fans.toLocaleString()} fans)`);
    console.log("Open it and make sure it's actually the right artist before publishing.");
  } else {
    console.log("No exact Deezer match — drop a photo in by hand as public/images/artists/" + slug + ".jpg");
  }
} catch (e) {
  console.log("Photo lookup failed: " + e.message);
}
console.log("\nNext: fill in the TODOs in src/data/artists.ts, then remove `draft: true`.");
