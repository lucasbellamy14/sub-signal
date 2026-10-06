import type { TimelineArtist } from "@/data/artists";
import { SESSIONS } from "@/data/sessions";
import meta from "@/data/artist-meta.json";

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/**
 * The same four facts, in the same order, on every artist page:
 * where they're based, their sound, when Sub Signal discovered them,
 * and where to listen. Only verified links are shown.
 */
export default function ArtistSpecSheet({ artist }: { artist: TimelineArtist }) {
  const location = artist.location ?? artist.meta.split("·")[0]?.trim();
  const deezerId = (meta as Record<string, { deezerId?: number }>)[artist.slug]?.deezerId;
  const video = SESSIONS.find((s) => s.artistSlug === artist.slug);

  const links: { label: string; href: string }[] = [];
  if (artist.spotify) links.push({ label: "Spotify", href: artist.spotify });
  if (deezerId) links.push({ label: "Deezer", href: `https://www.deezer.com/artist/${deezerId}` });
  if (video) links.push({ label: "Watch", href: video.videoUrl });
  if (artist.website) links.push({ label: "Website", href: artist.website });

  return (
    <dl className="spec-sheet" aria-label={`${artist.name} at a glance`}>
      <div className="spec-cell">
        <dt className="spec-label">From</dt>
        <dd className="spec-value">{location}</dd>
      </div>
      <div className="spec-cell">
        <dt className="spec-label">Sound</dt>
        <dd className="spec-value">{artist.genres.join(" · ")}</dd>
      </div>
      <div className="spec-cell">
        <dt className="spec-label">Discovered</dt>
        <dd className="spec-value">{fmtDate(artist.featuredDate)}</dd>
      </div>
      <div className="spec-cell">
        <dt className="spec-label">Listen</dt>
        <dd className="spec-value spec-links">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
          ))}
        </dd>
      </div>
    </dl>
  );
}
