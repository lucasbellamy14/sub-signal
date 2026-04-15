"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface SavedArtistsContextValue {
  savedSlugs: string[];
  toggleSave: (slug: string) => void;
}

const SavedArtistsContext = createContext<SavedArtistsContextValue>({
  savedSlugs: [],
  toggleSave: () => {},
});

const STORAGE_KEY = "sub-signal-saved-artists";

export function SavedArtistsProvider({ children }: { children: ReactNode }) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSavedSlugs(parsed);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Write to localStorage on change (skip initial load)
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSlugs));
      } catch {
        // ignore
      }
    }
  }, [savedSlugs, loaded]);

  const toggleSave = useCallback((slug: string) => {
    setSavedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  return (
    <SavedArtistsContext.Provider value={{ savedSlugs, toggleSave }}>
      {children}
    </SavedArtistsContext.Provider>
  );
}

export function useSavedArtists() {
  return useContext(SavedArtistsContext);
}
