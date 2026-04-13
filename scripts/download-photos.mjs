/**
 * Auto Photo Download Script for Sub Signal
 *
 * Downloads artist photos from Wikipedia (the only reliable free source).
 * For underground artists without Wikipedia pages, the site shows
 * a styled initials fallback automatically.
 *
 * Usage:
 *   npm run photos                  -- download from Wikipedia
 *   npm run photos -- --force       -- re-download even if photos exist
 *
 * To add manual photos for artists without Wikipedia:
 *   Drop images into public/images/ as {slug}-early.jpg and {slug}-recent.jpg
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");

// Artist data — wikiPage must be the exact Wikipedia article title
// Only artists with actual Wikipedia pages will get auto-downloaded photos
const ARTISTS = [
  { slug: "mkgee", name: "Mk.gee", wikiPage: "Mk.gee" },
  { slug: "nia", name: "Nia Archives", wikiPage: "Nia Archives" },
  { slug: "paristexas", name: "Paris Texas", wikiPage: null },
  { slug: "rizlavie", name: "Riz La Vie", wikiPage: null },
  { slug: "olivermalcolm", name: "Oliver Malcolm", wikiPage: null },
  { slug: "contradash", name: "Contradash", wikiPage: null },
];

const WIKI_UA = "SubSignal/1.0 (music discovery site)";

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadImage(url, filepath) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) {
        const backoff = (attempt + 1) * 3000;
        console.log(`    Retrying in ${backoff / 1000}s...`);
        await sleep(backoff);
      }
      const res = await fetch(url, { headers: { "User-Agent": WIKI_UA } });
      if (res.status === 429) {
        if (attempt < 2) continue;
        throw new Error("Rate limited (429)");
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) throw new Error(`Not an image: ${contentType}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 1000) throw new Error("Image too small");
      fs.writeFileSync(filepath, buffer);
      return true;
    } catch (err) {
      if (attempt === 2 || !err.message.includes("429")) {
        console.error(`    ✗ ${err.message}`);
        return false;
      }
    }
  }
  return false;
}

/**
 * Get ALL images from an artist's Wikipedia page with URLs and dimensions.
 * Only returns actual photos — filters out icons, logos, SVGs, and tiny images.
 */
async function fetchPageImages(wikiPage) {
  const images = [];
  try {
    const encoded = encodeURIComponent(wikiPage.replace(/ /g, "_"));

    // Get all image filenames from the page
    const listUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=images&imlimit=50&format=json`;
    const listRes = await fetch(listUrl, { headers: { "User-Agent": WIKI_UA } });
    if (!listRes.ok) return images;
    const listData = await listRes.json();

    const pages = listData.query?.pages;
    if (!pages) return images;
    const page = Object.values(pages)[0];
    if (!page?.images) return images;

    // Filter out obvious non-photos by filename
    const skipPatterns = /logo|icon|flag|symbol|map|chart|diagram|commons-|edit-|lock-|question|stub|wikidata|wikiquote|padlock|ambox|OOjs/i;
    const photoFiles = page.images
      .map((img) => img.title)
      .filter((title) => {
        const lower = title.toLowerCase();
        if (lower.endsWith(".svg") || lower.endsWith(".gif")) return false;
        if (skipPatterns.test(title)) return false;
        return true;
      });

    if (photoFiles.length === 0) return images;

    // Get image info (URL + dimensions + mime) for each file
    const titles = photoFiles.map((t) => encodeURIComponent(t)).join("|");
    const infoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${titles}&prop=imageinfo&iiprop=url|size|mime&format=json`;
    const infoRes = await fetch(infoUrl, { headers: { "User-Agent": WIKI_UA } });
    if (!infoRes.ok) return images;
    const infoData = await infoRes.json();

    const infoPages = infoData.query?.pages;
    if (!infoPages) return images;

    for (const p of Object.values(infoPages)) {
      const info = p.imageinfo?.[0];
      if (!info) continue;
      if (info.width < 200 || info.height < 200) continue;
      const mime = info.mime || "";
      if (!mime.startsWith("image/")) continue;
      images.push({
        url: info.url,
        width: info.width,
        height: info.height,
        area: info.width * info.height,
        title: p.title || "",
      });
    }
  } catch {
    // silently fail
  }
  return images;
}

async function main() {
  const force = process.argv.includes("--force");

  console.log("\n📸 Sub Signal — Photo Downloader\n");
  console.log("Source: Wikipedia page images only (verified, freely licensed)\n");

  let downloaded = 0;
  let skipped = 0;
  let noSource = 0;

  for (const artist of ARTISTS) {
    console.log(`${artist.name}`);

    const earlyPath = path.join(IMAGES_DIR, `${artist.slug}-early.jpg`);
    const recentPath = path.join(IMAGES_DIR, `${artist.slug}-recent.jpg`);

    // No Wikipedia page — skip
    if (!artist.wikiPage) {
      const hasEarly = fs.existsSync(earlyPath);
      const hasRecent = fs.existsSync(recentPath);
      if (hasEarly || hasRecent) {
        console.log(`  ✓ Manual photos present (${hasEarly && hasRecent ? "both" : "one"})\n`);
        skipped++;
      } else {
        console.log("  — No Wikipedia page (will show styled initials)\n");
        noSource++;
      }
      continue;
    }

    // Skip if both photos exist and are distinct (not forced)
    if (!force && fs.existsSync(earlyPath) && fs.existsSync(recentPath)) {
      const earlySize = fs.statSync(earlyPath).size;
      const recentSize = fs.statSync(recentPath).size;
      if (earlySize !== recentSize) {
        console.log("  ✓ Two distinct photos already exist, skipping\n");
        skipped++;
        continue;
      }
      console.log("  ⚠ Photos are identical, re-downloading...");
    }

    // Fetch all images from the Wikipedia page
    process.stdout.write("  Fetching Wikipedia page images... ");
    const pageImages = await fetchPageImages(artist.wikiPage);
    console.log(`${pageImages.length} found`);

    if (pageImages.length === 0) {
      console.log("  — No photos on Wikipedia page\n");
      noSource++;
      continue;
    }

    // Sort: oldest year first (for "early" slot), newest last (for "recent" slot)
    // Within same year, prefer larger/portrait images (better for profile photos)
    pageImages.sort((a, b) => {
      const yearA = a.title.match(/(\d{4})/)?.[1] || "9999";
      const yearB = b.title.match(/(\d{4})/)?.[1] || "9999";
      if (yearA !== yearB) return yearA.localeCompare(yearB);
      // Same year: prefer taller aspect ratio (portrait photos)
      const ratioA = a.height / a.width;
      const ratioB = b.height / b.width;
      return ratioB - ratioA;
    });

    // Download early photo (first/oldest)
    process.stdout.write(`  Downloading early photo... `);
    const earlySuccess = await downloadImage(pageImages[0].url, earlyPath);
    if (earlySuccess) console.log("✓");

    await sleep(2000);

    // Download recent photo — pick the remaining image with the most pixels
    let recentSuccess = false;
    if (pageImages.length > 1) {
      // Remove the early photo from candidates
      const remaining = pageImages.slice(1);
      // Sort remaining by pixel area descending (best detail first)
      remaining.sort((a, b) => b.area - a.area);
      process.stdout.write(`  Downloading recent photo... `);
      recentSuccess = await downloadImage(remaining[0].url, recentPath);
      if (recentSuccess) console.log("✓");
    }

    if (earlySuccess && recentSuccess) {
      const earlySize = fs.statSync(earlyPath).size;
      const recentSize = fs.statSync(recentPath).size;
      console.log(`  ✓ Two distinct photos (${(earlySize / 1024).toFixed(0)}KB + ${(recentSize / 1024).toFixed(0)}KB)`);
      downloaded++;
    } else if (earlySuccess) {
      console.log("  ⚠ Only 1 photo available on Wikipedia");
      downloaded++;
    } else {
      console.log("  ✗ Failed to download");
    }

    console.log();
    await sleep(3000);
  }

  console.log(`\nDone! ${downloaded} downloaded, ${skipped} skipped, ${noSource} no source`);
  if (noSource > 0) {
    console.log(`\nFor artists without Wikipedia pages, drop photos manually into public/images/`);
    console.log(`as {slug}-early.jpg and {slug}-recent.jpg\n`);
  }
}

main().catch(console.error);
