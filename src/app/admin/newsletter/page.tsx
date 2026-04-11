import { getAllArtists } from "@/lib/artists";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterPreview from "./NewsletterPreview";

/**
 * Admin page: Newsletter Generator
 *
 * Auto-generates an HTML email for the latest featured artist.
 * You can preview it and copy the HTML to paste into your
 * email tool (Mailchimp, ConvertKit, etc.).
 */
export default function NewsletterPage() {
  const allArtists = getAllArtists();
  const artists = allArtists.map((e) => e.data);

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
              Newsletter Generator
            </h1>
            <p className="font-mono text-sm text-text-secondary">
              Auto-generate HTML email for the latest featured artist.
            </p>
          </div>

          <NewsletterPreview artists={artists} />
        </div>
      </main>
      <Footer />
    </>
  );
}
