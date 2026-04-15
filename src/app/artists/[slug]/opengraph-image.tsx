import { ImageResponse } from "next/og";
import { ARTISTS } from "@/data/artists";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sub Signal — Artist";

export default function OGImage({ params }: { params: { slug: string } }) {
  const artist = ARTISTS.find((a) => a.slug === params.slug);
  const name = artist?.name ?? "Artist";
  const tag = artist?.cardTag ?? "Sub Signal";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
          padding: "60px",
        }}
      >
        {/* Tag */}
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#ffffff",
            marginBottom: 24,
          }}
        >
          {tag}
        </div>

        {/* Artist name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#39ff5a",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          {name}
        </div>

        {/* Wordmark */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 18,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          SUB SIGNAL
        </div>
      </div>
    ),
    { ...size }
  );
}
