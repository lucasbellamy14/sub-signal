"use client";

/**
 * A visual placeholder shown when an artist doesn't have a real photo yet.
 * Displays their initials on a dark gradient background with the accent color.
 */
export default function PlaceholderImage({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a14] flex flex-col items-center justify-center ${className}`}
    >
      <span className="text-accent/20 font-heading font-800 text-6xl sm:text-7xl">
        {initials}
      </span>
      <span className="font-mono text-[11px] text-text-secondary/40 mt-2">
        {name}
      </span>
    </div>
  );
}
