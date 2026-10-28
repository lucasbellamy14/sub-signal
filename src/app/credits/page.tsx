import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ARTISTS } from "@/data/artists";
import { PHOTOS } from "@/lib/signal";

export const metadata = { title: "Photo credits" };

/** Every artist photo on the site, where it came from, and its licence. */
export default function CreditsPage() {
  const rows = ARTISTS.map((a) => ({ artist: a, photo: PHOTOS[a.slug] })).filter((r) => r.photo);
  return (
    <>
      <Header />
      <section className="section-hero">
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#39ff5a", marginBottom: "1.5rem" }}>
          Credits
        </p>
        <h1 className="hero-headline">
          Photo <span style={{ color: "#39ff5a" }}>Credits</span>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.95rem", color: "#b0b0b0", maxWidth: "460px", lineHeight: 1.7, marginTop: "2rem" }}>
          Artist photos on Sub Signal come from Wikimedia Commons under open licences, with credit to the photographer, or are shown from Deezer. Where no usable photo exists we show generative art instead.
        </p>
      </section>
      <section style={{ padding: "0 2.5rem 5rem", maxWidth: "800px", margin: "0 auto" }}>
        <ul className="credits-list">
          {rows.map(({ artist, photo }) => (
            <li key={artist.slug}>
              <a href={`/artists/${artist.slug}`} className="credits-artist">
                {artist.name}
              </a>
              <span className="credits-detail">
                {photo!.source === "commons" ? (
                  <>
                    <a href={photo!.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {photo!.author || "Wikimedia Commons contributor"}
                    </a>
                    {photo!.license ? (
                      <>
                        {" · "}
                        <a href={photo!.licenseUrl || photo!.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {photo!.license}
                        </a>
                      </>
                    ) : null}
                    {" · Wikimedia Commons"}
                  </>
                ) : (
                  <a href={photo!.sourceUrl} target="_blank" rel="noopener noreferrer">
                    Deezer
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="artist-desc" style={{ color: "#9a9a9a" }}>No credited photos yet.</p>}
      </section>
      <Footer />
    </>
  );
}
