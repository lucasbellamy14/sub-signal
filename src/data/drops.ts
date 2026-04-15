export interface Drop {
  id: string;
  date: string;
  title: string;
  summary: string;
  featuredArtistSlugs: string[];
}

export const DROPS: Drop[] = [
  {
    id: "001",
    date: "2026-04-14",
    title: "Vol. 001 — First Transmission",
    summary:
      "The inaugural Sub Signal drop. Six artists pulled from the edges of R&B, jungle, rap, and pop — each one building something the mainstream hasn't caught yet.",
    featuredArtistSlugs: ["mk-gee", "nia-archives", "paris-texas"],
  },
  {
    id: "002",
    date: "2026-04-07",
    title: "Vol. 002 — Quiet Frequency",
    summary:
      "Three artists working in the spaces between genres. A slow-burn R&B writer, a producer turned frontman, and a graphic designer who accidentally became a pop star.",
    featuredArtistSlugs: ["riz-la-vie", "oliver-malcolm", "contradash"],
  },
  {
    id: "003",
    date: "2026-03-31",
    title: "Vol. 003 — Early Signal",
    summary:
      "Before the algorithms find them. A look back at the artists who defined the first wave of Sub Signal — where they started and why they matter.",
    featuredArtistSlugs: ["mk-gee", "nia-archives"],
  },
];
