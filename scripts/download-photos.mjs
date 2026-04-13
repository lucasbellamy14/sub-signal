/**
 * Auto Photo Download Script for Sub Signal
 *
 * Automatically finds and downloads artist photos from Wikipedia and Spotify.
 * No manual URL entry needed — just run it.
 *
 * Usage:
 *   npm run photos                  -- auto-download from Wikipedia
 *   npm run photos -- --spotify     -- also try Spotify API as fallback
 *
 * For Spotify, set in .env:
 *   SPOTIFY_CLIENT_ID=your_client_id
 *   SPOTIFY_CLIENT_SECRET=your_client_secret
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");

// Artist data — read directly from the source file
const ARTISTS = [
  { slug: "mkgee", name: "Mk.gee", wikiSearch: "Mk.gee" },
  { slug: "nia", name: "Nia Archives", wikiSearch: "Nia Archives" },
  { slug: "paristexas", name: "Paris Texas", wikiSearch: "Paris Texas (band)" },
  { slug: "rizlavie", name: "Riz La Vie", wikiSearch: "Riz La Vie" },
  { slug: "olivermalcolm", name: "Oliver Malcolm", wikiSearch: "Oliver Malcolm" },
  { slug: "contradash", name: "Contradash", wikiSearch: "Contradash" },
];

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SubSignal/1.0 (music discovery site)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) throw new Error(`Not an image: ${contentType}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) throw new Error("Image too small, likely placeholder");
    fs.writeFileSync(filepath, buffer);
    return true;
  } catch (err) {
    console.error(`    ✗ ${err.message}`);
    return false;
  }
}

async function fetchFromWikipedia(searchTerm) {
  try {
    // First try the REST API summary endpoint
    const encoded = encodeURIComponent(searchTerm.replace(/ /g, "_"));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "SubSignal/1.0 (music discovery site)" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.originalimage?.source) return data.originalimage.source;
      if (data.thumbnail?.source) {
        // Get higher resolution version of thumbnail
        return data.thumbnail.source.replace(/\/\d+px-/, "/800px-");
      }
    }

    // Fallback: try Wikipedia search API
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&srlimit=1`;
    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "SubSignal/1.0 (music discovery site)" },
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const pageTitle = searchData.query?.search?.[0]?.title;
      if (pageTitle) {
        const pageUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/ /g, "_"))}`;
        const pageRes = await fetch(pageUrl, {
          headers: { "User-Agent": "SubSignal/1.0 (music discovery site)" },
        });
        if (pageRes.ok) {
          const pageData = await pageRes.json();
          if (pageData.originalimage?.source) return pageData.originalimage.source;
          if (pageData.thumbnail?.source) {
            return pageData.thumbnail.source.replace(/\/\d+px-/, "/800px-");
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token;
  } catch {
    return null;
  }
}

async function fetchFromSpotify(artistName, token) {
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.artists?.items?.[0]?.images?.[0]?.url || null;
  } catch {
    return null;
  }
}

async function main() {
  const useSpotify = process.argv.includes("--spotify");

  console.log("\n📸 Sub Signal — Auto Photo Downloader\n");

  let spotifyToken = null;
  if (useSpotify) {
    process.stdout.write("Authenticating with Spotify... ");
    spotifyToken = await getSpotifyToken();
    console.log(spotifyToken ? "✓" : "✗ (no credentials in .env)");
    console.log();
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const artist of ARTISTS) {
    console.log(`${artist.name}`);

    const earlyPath = path.join(IMAGES_DIR, `${artist.slug}-early.jpg`);
    const recentPath = path.join(IMAGES_DIR, `${artist.slug}-recent.jpg`);

    // Skip if both photos already exist
    if (fs.existsSync(earlyPath) && fs.existsSync(recentPath)) {
      console.log("  ✓ Photos already exist, skipping\n");
      skipped++;
      continue;
    }

    // Try Wikipedia first
    process.stdout.write("  Searching Wikipedia... ");
    let imageUrl = await fetchFromWikipedia(artist.wikiSearch);

    if (imageUrl) {
      console.log("found!");
    } else {
      console.log("not found");

      // Try Spotify as fallback
      if (spotifyToken) {
        process.stdout.write("  Searching Spotify... ");
        imageUrl = await fetchFromSpotify(artist.name, spotifyToken);
        console.log(imageUrl ? "found!" : "not found");
      }
    }

    if (imageUrl) {
      process.stdout.write("  Downloading... ");
      const success = await downloadImage(imageUrl, earlyPath);
      if (success) {
        // Copy same image for both early and recent
        fs.copyFileSync(earlyPath, recentPath);
        console.log(`✓ saved (${artist.slug}-early.jpg + ${artist.slug}-recent.jpg)`);
        downloaded++;
      } else {
        failed++;
      }
    } else {
      console.log("  ✗ No image source found");
      failed++;
    }

    console.log();
  }

  console.log(`\nDone! ${downloaded} artists downloaded, ${skipped} skipped, ${failed} failed\n`);

  if (failed > 0) {
    console.log("Tip: For artists without Wikipedia pages, try: npm run photos -- --spotify");
    console.log("     (requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env)\n");
  }
}

main().catch(console.error);
