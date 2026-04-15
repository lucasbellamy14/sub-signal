"use client";

import { useState } from "react";

interface VideoEmbedProps {
  url: string;
  title?: string;
}

function parseVideo(url: string): { type: "youtube" | "vimeo" | null; id: string } {
  // YouTube: youtube.com/watch?v=ID or youtu.be/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };

  // Vimeo: vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: "vimeo", id: vimeoMatch[1] };

  return { type: null, id: "" };
}

function getThumbnailUrl(type: "youtube" | "vimeo" | null, id: string): string {
  if (type === "youtube") {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  // Vimeo thumbnails require an API call — use a placeholder
  return "";
}

function getEmbedUrl(type: "youtube" | "vimeo" | null, id: string): string {
  if (type === "youtube") {
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  if (type === "vimeo") {
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  return "";
}

export default function VideoEmbed({ url, title = "Video" }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const { type, id } = parseVideo(url);

  if (!type) return null;

  const thumbnailUrl = getThumbnailUrl(type, id);
  const embedUrl = getEmbedUrl(type, id);

  if (playing) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%",
          background: "#000",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        background: "#111",
        border: "1px solid #1a1a1a",
        borderRadius: "4px",
        overflow: "hidden",
        cursor: "pointer",
        display: "block",
      }}
    >
      {/* Thumbnail */}
      {thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.7,
            transition: "opacity 0.2s",
          }}
        />
      )}

      {/* Play button overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(57, 255, 90, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 30px rgba(57, 255, 90, 0.3)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#0a0a0a"
            style={{ marginLeft: "2px" }}
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#f0f0f0",
            opacity: 0.7,
          }}
        >
          Play {type === "vimeo" ? "Vimeo" : "YouTube"}
        </span>
      </div>
    </button>
  );
}

/**
 * Thumbnail-only version — shows the YouTube thumbnail as a static image.
 * Used in grids where clicking navigates to a detail page or triggers embed.
 */
export function VideoThumbnail({
  url,
  alt = "Video thumbnail",
}: {
  url: string;
  alt?: string;
}) {
  const { type, id } = parseVideo(url);
  const thumbnailUrl = type === "youtube" ? getThumbnailUrl(type, id) : "";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        background: "#111",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt={alt}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.2s",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#333",
          }}
        >
          Video
        </div>
      )}

      {/* Play icon overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(57, 255, 90, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(57, 255, 90, 0.25)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#0a0a0a"
            style={{ marginLeft: "2px" }}
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>
    </div>
  );
}
