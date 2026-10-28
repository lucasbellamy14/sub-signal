import { getSignal } from "@/lib/signal";

const monthYear = (iso?: string | null) =>
  iso ? new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";

const shortDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

/**
 * The A&R block on an artist page: the score and category from the weekly
 * data run, the featured release, "Why we're watching", and the evidence
 * each claim rests on. Renders nothing for artists the run hasn't scored
 * (the original roster), so their pages are unchanged.
 */
export default function ArtistSignal({ slug }: { slug: string }) {
  const s = getSignal(slug);
  if (!s) return null;
  const coverage = Math.round(s.score.coverage * 100);

  return (
    <section className="signal" aria-label="Sub Signal A&R signal">
      <dl className="spec-sheet signal-sheet">
        <div className="spec-cell">
          <dt className="spec-label">Signal</dt>
          <dd className="spec-value signal-score">
            <strong>{s.score.total}</strong>
            <span>/100</span>
          </dd>
        </div>
        <div className="spec-cell">
          <dt className="spec-label">Category</dt>
          <dd className="spec-value">{s.category}</dd>
        </div>
        <div className="spec-cell">
          <dt className="spec-label">Featured release</dt>
          <dd className="spec-value">
            {s.featuredRelease ? (
              <>
                &ldquo;{s.featuredRelease.title}&rdquo;
                {s.featuredRelease.released ? ` (${monthYear(s.featuredRelease.released)})` : ""}
              </>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div className="spec-cell">
          <dt className="spec-label">Evidence</dt>
          <dd className="spec-value">
            {s.evidence.length} verified · {coverage}% coverage
          </dd>
        </div>
      </dl>

      <div className="signal-why-label">Why we&rsquo;re watching</div>
      <p className="artist-desc signal-why">{s.whyWatching}</p>

      {s.evidence.length > 0 && (
        <ul className="signal-evidence">
          {s.evidence.map((e, i) => (
            <li key={i}>
              {e.source ? (
                <a href={e.source} target="_blank" rel="noopener noreferrer">
                  {e.label}
                </a>
              ) : (
                e.label
              )}
              {e.date ? <span className="signal-date"> · {shortDate(e.date)}</span> : null}
            </li>
          ))}
        </ul>
      )}

      <p className="signal-note">
        Scored week {s.score.week} by Sub Signal&rsquo;s weekly A&amp;R run from public data: Deezer, Last.fm, Apple Music charts and the music press. Growth is judged against the artist&rsquo;s own starting point.
      </p>
    </section>
  );
}
