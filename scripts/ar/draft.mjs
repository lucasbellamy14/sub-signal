/**
 * Turns a shortlisted artist into a DRAFT profile the editorial run fills in.
 *
 *   npm run ar:draft -- --key mb:<mbid> [--week 2026-W45] [--drop]
 *   npm run ar:draft -- --name "Artist Name" --week 2026-W45
 *
 * Writes, all reversible with git:
 *   src/data/artists.ts     a stub entry (draft: true, cardTag = category, TODO copy and timeline)
 *   src/data/signal.json    category, score, evidence, featured release, links; whyWatching = TODO
 *   src/data/origins.ts     a map pin, when the artist's origin can be geocoded
 *   src/data/drops.ts       with --drop: this week's edition, listing the slug
 *
 * Numbers come only from data/ar; nothing here writes a fact about the
 * artist's life. Run `npm run sync-artists` and `npm run ar:photo -- <slug>`
 * afterwards, then fill the TODOs with sourced copy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ROOT, DATA, norm, slugify, isoWeek, weekMonday, readJson, writeJson, readRoster } from "./lib/util.mjs";
import { createHttp } from "./lib/http.mjs";
import { project, geocode } from "./lib/project.mjs";

const q = (s) => JSON.stringify(s);
const titleCase = (s) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase()).replace(/\bR&b\b/, "R&B").replace(/\bDj\b/, "DJ").replace(/\bUk\b/, "UK");

/** The artists.ts entry text for a shortlisted artist. Pure. */
export function buildStub({ name, slug, number, category, area, genres, links, featuredDate }) {
  const g = (genres || []).slice(0, 3).map(titleCase);
  const lines = [
    `  {`,
    `    id: ${q(slug)},`,
    `    slug: ${q(slug)},`,
    `    name: ${q(name)},`,
    `    meta: ${q(`${area || "TODO: origin"} · ${g[0] || "TODO: genre"}`)},`,
    area ? `    location: ${q(area)},` : `    // location: "TODO: where they're from, as sourced",`,
    `    photos: ["", ""],`,
    `    photoLabels: ["", ""],`,
    `    cardNumber: ${q(number)},`,
    `    cardTag: ${q(category)},`,
    `    cardTitle: "TODO: headline (artist: what happened)",`,
    `    cardBody: "TODO: two or three sourced sentences on who they are and what just happened.",`,
    `    genres: ${JSON.stringify(g.length ? g : ["TODO"])},`,
    `    // spotifyTrackId: "TODO: the featured track's Spotify ID",`,
    links?.instagram ? `    instagram: ${q(links.instagram)},` : null,
    links?.spotify ? `    spotify: ${q(links.spotify)},` : `    // spotify: "TODO: Spotify artist URL",`,
    links?.website ? `    website: ${q(links.website)},` : null,
    `    featuredDate: ${q(featuredDate)},`,
    `    draft: true, // the editorial run removes this once every gate passes`,
    `    timeline: [`,
    `      { year: "TODO", title: "TODO", body: "TODO: one sourced fact per entry; at least three entries.", sources: ["TODO: URL you have read"] },`,
    `    ],`,
    `  },`,
  ].filter((l) => l !== null);
  return lines.join("\n") + "\n";
}

export function insertStub(src, stub, slug) {
  if (new RegExp(`slug: "${slug}"`).test(src)) throw new Error(`"${slug}" already exists in artists.ts`);
  // The list closes with "];" just before the drafts comment / SHOW_DRAFTS / the ARTISTS export.
  const end = src.search(/\n\/\*\*\n \* Drafts are hidden|\nconst SHOW_DRAFTS|\nexport const ARTISTS/);
  const close = end < 0 ? -1 : src.lastIndexOf("\n];\n", end);
  if (close < 0) throw new Error("couldn't find the end of the artist list in artists.ts");
  return src.slice(0, close + 1) + stub + src.slice(close + 1);
}

/** The signal.json entry. Pure. */
export function buildSignal({ shortlistEntry, snapshotArtist, week, computedAt, links }) {
  const top = (snapshotArtist?.deezer?.topTracks || []).reduce((a, t) => (!a || (t.rank || 0) > (a.rank || 0) ? t : a), null);
  const evidence = [];
  // One line per release per chart family: 'Apple Music songs: "Title" #4 AU · #6 CA · #7 US'
  const groups = new Map();
  for (const c of snapshotArtist?.charts || []) {
    const k = `${c.source}|${c.kind}|${c.title}`;
    if (!groups.has(k)) groups.set(k, { source: c.source, kind: c.kind, title: c.title, url: c.url, places: [] });
    groups.get(k).places.push({ country: c.country, position: c.position });
  }
  for (const g of groups.values()) {
    g.places.sort((a, b) => a.position - b.position);
    const where = g.source === "apple" ? g.places.map((p) => `#${p.position} ${p.country.toUpperCase()}`).join(" · ") : `#${g.places[0].position}`;
    evidence.push({ label: `${g.source === "apple" ? "Apple Music" : "Deezer global"} ${g.kind}: "${g.title}" ${where}`, source: g.url || undefined, date: snapshotArtist.recordedAt || null });
  }
  for (const p of snapshotArtist?.press || []) evidence.push({ label: `${p.outlet}: ${p.title}`, source: p.url || undefined, date: p.date || null });
  for (const e of shortlistEntry?.evidence || []) if (!/^(Apple Music|Deezer global|Press:)/.test(e)) evidence.push({ label: e });
  return {
    category: shortlistEntry?.category || "Early Signal",
    score: { total: shortlistEntry?.total ?? 0, coverage: shortlistEntry?.coverage ?? 0, components: shortlistEntry?.components || {}, week, computedAt },
    band: shortlistEntry?.band,
    featuredRelease: top ? { title: top.title, released: top.releaseDate || null } : undefined,
    evidence,
    whyWatching: "TODO: two or three sentences, every number from the evidence above, no superlatives.",
    links: Object.fromEntries(Object.entries(links || {}).filter(([k]) => ["spotify", "deezer", "appleMusic", "bandcamp", "youtube", "lastfm", "website"].includes(k))),
    momentum: "new",
  };
}

export function upsertOrigin(src, row) {
  const cleaned = src.replace(new RegExp(` \\{\\n  "slug": "${row.slug}",[\\s\\S]*?\\n \\},?\\n`), "").replace(/ \},\n\];\nexport const VIEWS/, " }\n];\nexport const VIEWS");
  const marker = "];\nexport const VIEWS";
  if (!cleaned.includes(marker)) throw new Error("couldn't find the end of ORIGINS in origins.ts");
  const text = ` {\n  "slug": ${q(row.slug)},\n  "label": ${q(row.label)},\n  "precision": ${q(row.precision)},\n  "x": ${row.x},\n  "y": ${row.y}\n }\n`;
  return cleaned.replace(/\n \}\n\];\nexport const VIEWS/, `\n },\n${text}];\nexport const VIEWS`);
}

export function upsertDrop(src, { week, slug, date }) {
  const ids = [...src.matchAll(/id: "(\d+)"/g)].map((m) => Number(m[1]));
  const existing = src.match(new RegExp(`\\{\\s*id: "(\\d+)",\\s*date: "${date}"[\\s\\S]*?featuredArtistSlugs: \\[([^\\]]*)\\][\\s\\S]*?\\},?\\n`));
  if (existing) {
    const slugs = [...existing[2].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    if (slugs.includes(slug)) return src;
    return src.replace(existing[0], existing[0].replace(`featuredArtistSlugs: [${existing[2]}]`, `featuredArtistSlugs: [${[...slugs, slug].map(q).join(", ")}]`));
  }
  const id = String(Math.max(0, ...ids) + 1).padStart(3, "0");
  const entry = `  {\n    id: ${q(id)},\n    date: ${q(date)},\n    title: ${q(`Vol. ${id} — Week ${week.split("-W")[1]}`)},\n    summary: "TODO: one or two sentences on this week's edition.",\n    featuredArtistSlugs: [${q(slug)}],\n  },\n`;
  return src.replace(/\n\];\s*$/, `\n${entry}];\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (n) => {
    const i = args.indexOf(`--${n}`);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const week = flag("week") || isoWeek();
  const ledger = readJson(path.join(DATA, "artists.json"));
  const snapshot = readJson(path.join(DATA, "snapshots", `${week}.json`), null);
  const shortlist = readJson(path.join(DATA, "shortlists", `${week}.json`), null);
  let key = flag("key");
  if (!key && flag("name")) key = ledger.names[norm(flag("name"))];
  const L = key && ledger.artists[key];
  if (!L) {
    console.error(`No ledger entry for ${flag("key") || flag("name")}. Keys look like mb:<mbid> or dz:<id>; see data/ar/artists.json.`);
    process.exit(1);
  }
  const sl = [...(shortlist?.eligible || []), ...(shortlist?.overflow || []), ...(shortlist?.watch || []), ...(shortlist?.scored || [])].find((e) => e.key === key);
  const snap = snapshot?.artists?.[key];
  const slug = slugify(L.name);
  const roster = readRoster();
  if (roster.some((r) => r.slug === slug)) {
    console.error(`"${slug}" is already on the site.`);
    process.exit(1);
  }
  const featuredDate = weekMonday(week).toISOString().slice(0, 10);
  const number = String(roster.length + 1).padStart(2, "0");
  const area = L.area || null;
  const category = sl?.category || L.lastCategory || "Early Signal";

  const artistsFile = path.join(ROOT, "src", "data", "artists.ts");
  const stub = buildStub({ name: L.name, slug, number, category, area, genres: L.genres, links: L.links, featuredDate });
  fs.writeFileSync(artistsFile, insertStub(fs.readFileSync(artistsFile, "utf8"), stub, slug));
  console.log(`artists.ts   draft "${L.name}" (${slug}), #${number}, ${category}`);

  const signalFile = path.join(ROOT, "src", "data", "signal.json");
  const signal = readJson(signalFile, {});
  signal[slug] = buildSignal({ shortlistEntry: sl, snapshotArtist: snap ? { ...snap, recordedAt: snapshot.recordedAt } : null, week, computedAt: snapshot?.recordedAt || new Date().toISOString(), links: L.links });
  writeJson(signalFile, signal);
  console.log(`signal.json  score ${signal[slug].score.total}, ${signal[slug].evidence.length} evidence item(s)`);

  if (area) {
    const http = createHttp({ log: () => {} });
    const g = await geocode(http, area);
    if (g) {
      const { x, y } = project(g.lat, g.lon);
      const originsFile = path.join(ROOT, "src", "data", "origins.ts");
      fs.writeFileSync(originsFile, upsertOrigin(fs.readFileSync(originsFile, "utf8"), { slug, label: area, precision: g.precision, x, y }));
      console.log(`origins.ts   pin at ${x},${y} (${g.label}: ${g.description})`);
    } else console.log(`origins.ts   could not geocode "${area}"; add the pin by hand (scripts/ar/lib/project.mjs has project(lat, lon))`);
  } else console.log("origins.ts   no origin known yet; add location + pin once sourced");

  if (args.includes("--drop")) {
    const dropsFile = path.join(ROOT, "src", "data", "drops.ts");
    fs.writeFileSync(dropsFile, upsertDrop(fs.readFileSync(dropsFile, "utf8"), { week, slug, date: featuredDate }));
    console.log(`drops.ts     listed in this week's edition (${featuredDate})`);
  }
  L.status = "drafted";
  L.slug = slug;
  writeJson(path.join(DATA, "artists.json"), ledger);
  console.log(`\nNext: npm run sync-artists · npm run ar:photo -- ${slug} · fill the TODOs in artists.ts and signal.json · npm run check-links`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
