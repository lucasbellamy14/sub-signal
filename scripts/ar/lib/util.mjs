import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const DATA = path.join(ROOT, "data", "ar");

/** Same name normalisation the photo and sync scripts use, plus accent folding. */
export const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** ISO week id for a date, e.g. "2026-W44". Computed in UTC. */
export function isoWeek(d = new Date()) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** The Monday (UTC) that starts an ISO week id. */
export function weekMonday(weekId) {
  const [y, w] = weekId.split("-W").map(Number);
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const day = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - day + 1 + (w - 1) * 7);
  return monday;
}

export const weeksBetween = (fromWeek, toWeek) =>
  Math.round((weekMonday(toWeek) - weekMonday(fromWeek)) / (7 * 86400000));

export function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    if (fallback !== undefined) return fallback;
    throw e;
  }
}

export function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n");
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const daysAgo = (iso, now = new Date()) => (now - new Date(iso)) / 86400000;

export const pct = (a, b) => (b > 0 ? (a - b) / b : null);

/** Linear interpolation of a score between two thresholds. */
export function curve(x, lo, hi, max) {
  if (x == null || Number.isNaN(x)) return 0;
  if (x <= lo) return 0;
  if (x >= hi) return max;
  return Math.round(((x - lo) / (hi - lo)) * max * 10) / 10;
}

/** Reads { slug, name, spotify, spotifyTrackId } for every artist in src/data/artists.ts. */
export function readRoster() {
  const src = fs.readFileSync(path.join(ROOT, "src", "data", "artists.ts"), "utf8");
  const meta = readJson(path.join(ROOT, "src", "data", "artist-meta.json"), {});
  const blocks = src.split(/\n  \{\n    id:/).slice(1);
  return blocks.map((b) => {
    const slug = (b.match(/slug: "([^"]+)"/) || [])[1];
    return {
      slug,
      name: (b.match(/name: "([^"]+)"/) || [])[1],
      spotify: (b.match(/\n    spotify: "([^"]+)"/) || [])[1],
      spotifyTrackId: (b.match(/spotifyTrackId: "([^"]+)"/) || [])[1],
      draft: /\n    draft: true/.test(b),
      deezerId: meta[slug]?.deezerId,
    };
  });
}
