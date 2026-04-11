import { getAllArtists } from "@/lib/artists";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IGGenerator from "./IGGenerator";

/**
 * Admin page: Instagram Post Generator
 *
 * This page lets you select an artist from a dropdown and generates
 * a 1080x1080 Sub Signal branded image that you can download and
 * post to Instagram. The image includes:
 * - Dark background with noise
 * - Artist name and role
 * - One-line origin hook
 * - Sub Signal logo with green accent
 */
export default function GenerateIGPage() {
  const allArtists = getAllArtists();
  const artists = allArtists.map((entry) => entry.data);

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2 block">
              Admin Tools
            </span>
            <h1 className="font-heading font-800 text-4xl text-text-primary mb-2">
              IG Post Generator
            </h1>
            <p className="font-mono text-sm text-text-secondary">
              Select an artist to generate a 1080×1080 branded image for
              Instagram.
            </p>
          </div>

          <IGGenerator artists={artists} />
        </div>
      </main>
      <Footer />
    </>
  );
}
