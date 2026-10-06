"use client";

import { SavedArtistsProvider } from "@/context/SavedArtistsContext";
import PageTransition from "@/components/PageTransition";
import { ListenProvider } from "@/context/ListenContext";
import ListenBar from "@/components/ListenBar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SavedArtistsProvider>
      <ListenProvider>
        <PageTransition>{children}</PageTransition>
        <ListenBar />
      </ListenProvider>
    </SavedArtistsProvider>
  );
}
