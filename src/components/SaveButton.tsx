"use client";

import { useSavedArtists } from "@/context/SavedArtistsContext";

interface SaveButtonProps {
  slug: string;
  size?: number;
}

export default function SaveButton({ slug, size = 18 }: SaveButtonProps) {
  const { savedSlugs, toggleSave } = useSavedArtists();
  const isSaved = savedSlugs.includes(slug);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSave(slug);
      }}
      aria-label={isSaved ? "Remove from saved" : "Save artist"}
      style={{
        background: "none",
        border: "none",
        padding: "0.25rem",
        cursor: "pointer",
        color: isSaved ? "#39ff5a" : "#555",
        transition: "color 0.2s",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        if (!isSaved) e.currentTarget.style.color = "#39ff5a";
      }}
      onMouseLeave={(e) => {
        if (!isSaved) e.currentTarget.style.color = "#555";
      }}
    >
      {isSaved ? (
        /* Filled bookmark */
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ) : (
        /* Outline bookmark */
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  );
}
