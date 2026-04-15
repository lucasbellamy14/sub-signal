import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sub Signal — Underground Artist Discovery";

export default function OGImage() {
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
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#39ff5a",
            marginBottom: 24,
          }}
        >
          SUB SIGNAL
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#777",
          }}
        >
          Underground Artist Discovery
        </div>
      </div>
    ),
    { ...size }
  );
}
