import { getAllArtists, getFeaturedArtist } from "@/lib/artists";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Roster from "@/components/Roster";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

/**
 * This is the homepage of Sub Signal.
 *
 * How it works:
 * 1. It reads all the artist MDX files from /src/content/artists/
 * 2. Finds the "featured" artist for the hero section
 * 3. Passes all the artist data down to the components to display
 *
 * This runs on the SERVER (not in the browser), which means it reads
 * files directly from disk — fast and secure.
 */
export default function Home() {
  // Get all artists and the featured one
  const allArtistEntries = getAllArtists();
  const featuredEntry = getFeaturedArtist();

  // Extract just the artist data from each entry
  const artists = allArtistEntries.map((entry) => entry.data);

  const featuredArtist = featuredEntry
    ? featuredEntry.data
    : artists[0]; // fallback to first artist if none is marked featured

  return (
    <PageTransition>
      <Header />

      {featuredArtist && <Hero artist={featuredArtist} />}

      <Roster artists={artists} />

      <Newsletter />

      <Footer />
    </PageTransition>
  );
}
