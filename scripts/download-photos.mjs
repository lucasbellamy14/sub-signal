/**
 * Photo Download Script for Sub Signal
 *
 * Downloads artist photos from URLs defined in photo-sources.json
 * and saves them to public/images/.
 *
 * Usage:
 *   npm run photos                     -- download from photo-sources.json
 *   npm run photos -- --spotify        -- also fetch Spotify profile images
 *
 * For Spotify mode, set these in .env:
 *   SPOTIFY_CLIENT_ID=your_client_id
 *   SPOTIFY_CLIENT_SECRET=your_client_secret
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const SOURCES_FILE = path.join(__dirname, "photo-sources.json");

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
  if (!url) return false;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    return true;
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    return false;
  }
}

async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    console.error("  ✗ Spotify auth failed");
    return null;
  }

  const data = await res.json();
  return data.access_token;
}

async function fetchSpotifyPhoto(artistName, token) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  const artist = data.artists?.items?.[0];
  return artist?.images?.[0]?.url || null;
}

async function main() {
  const useSpotify = process.argv.includes("--spotify");
  const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf-8"));

  console.log("\n📸 Sub Signal Photo Downloader\n");

  let spotifyToken = null;
  if (useSpotify) {
    console.log("Authenticating with Spotify...");
    spotifyToken = await getSpotifyToken();
    if (spotifyToken) {
      console.log("  ✓ Spotify authenticated\n");
    } else {
      console.log("  ✗ No Spotify credentials found in .env\n");
    }
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const artist of sources.artists) {
    console.log(`${artist.name} (${artist.slug})`);

    // Early photo
    const earlyPath = path.join(IMAGES_DIR, `${artist.slug}-early.jpg`);
    if (artist.early) {
      process.stdout.write(`  Early photo... `);
      if (await downloadImage(artist.early, earlyPath)) {
        console.log(`✓ saved`);
        downloaded++;
      } else {
        failed++;
      }
    } else {
      console.log(`  Early photo: no URL provided, skipping`);
      skipped++;
    }

    // Recent photo
    const recentPath = path.join(IMAGES_DIR, `${artist.slug}-recent.jpg`);
    if (artist.recent) {
      process.stdout.write(`  Recent photo... `);
      if (await downloadImage(artist.recent, recentPath)) {
        console.log(`✓ saved`);
        downloaded++;
      } else {
        failed++;
      }
    } else if (useSpotify && spotifyToken) {
      process.stdout.write(`  Recent photo (Spotify)... `);
      const spotifyUrl = await fetchSpotifyPhoto(artist.name, spotifyToken);
      if (spotifyUrl && await downloadImage(spotifyUrl, recentPath)) {
        console.log(`✓ saved from Spotify`);
        downloaded++;
      } else {
        console.log(`✗ not found on Spotify`);
        failed++;
      }
    } else {
      console.log(`  Recent photo: no URL provided, skipping`);
      skipped++;
    }

    console.log();
  }

  console.log(`Done! ${downloaded} downloaded, ${skipped} skipped, ${failed} failed\n`);
}

main().catch(console.error);
