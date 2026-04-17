"use client";

import { SavedArtistsProvider } from "@/context/SavedArtistsContext";
import PageTransition from "@/components/PageTransition";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SavedArtistsProvider>
      <PageTransition>{children}</PageTransition>
    </SavedArtistsProvider>
  );
}
