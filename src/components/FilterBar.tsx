"use client";

const GENRES = [
  "All",
  "Indie",
  "Electronic",
  "Experimental",
  "Art Pop",
  "R&B",
  "Lo-fi",
  "Rock",
  "Hip-Hop",
];

const MOODS = [
  "All",
  "Chill",
  "Energetic",
  "Melancholic",
  "Experimental",
  "Dreamy",
  "Raw",
];

interface FilterBarProps {
  onFilterChange: (filters: { genre: string; mood: string }) => void;
  activeGenre: string;
  activeMood: string;
}

/**
 * FilterBar — a row of clickable "chips" that let visitors filter artists
 * by genre or mood. Think of chips like little buttons/tags.
 */
export default function FilterBar({
  onFilterChange,
  activeGenre,
  activeMood,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Genre chips */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary mr-1">
          Genre
        </span>
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => onFilterChange({ genre, mood: activeMood })}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
              activeGenre === genre
                ? "bg-accent text-bg border-accent"
                : "bg-transparent text-text-secondary border-border hover:border-accent hover:text-accent"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Mood chips */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary mr-1">
          Mood
        </span>
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => onFilterChange({ genre: activeGenre, mood })}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
              activeMood === mood
                ? "bg-accent/10 text-accent border-accent"
                : "bg-transparent text-text-secondary border-border hover:border-accent/50 hover:text-accent"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}
