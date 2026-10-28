import { getPhoto } from "@/lib/signal";

/** The credit line under an artist's hero image. Nothing for photos without a recorded source. */
export default function PhotoCredit({ slug }: { slug: string }) {
  const p = getPhoto(slug);
  if (!p) return null;
  if (p.source === "commons") {
    return (
      <p className="photo-credit">
        Photo:{" "}
        <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">
          {p.author || "Wikimedia Commons contributor"}
        </a>
        {p.license ? (
          <>
            ,{" "}
            <a href={p.licenseUrl || p.sourceUrl} target="_blank" rel="noopener noreferrer">
              {p.license}
            </a>
          </>
        ) : null}
        , via Wikimedia Commons{p.license && /BY/.test(p.license) ? " (cropped)" : ""}
      </p>
    );
  }
  return (
    <p className="photo-credit">
      Photo via{" "}
      <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">
        Deezer
      </a>
    </p>
  );
}
