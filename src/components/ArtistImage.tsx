"use client";

import Image from "next/image";
import { useState } from "react";
import GenerativeArt from "@/components/GenerativeArt";

/**
 * Artist photo with a graceful fallback. Looks for /images/artists/{slug}.jpg
 * (fetched by `npm run photos`); if it's missing, shows the generative art.
 * The parent must be position: relative and have a size/aspect ratio.
 */
export default function ArtistImage({
  slug,
  name,
  index = 0,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  position = "50% 35%",
}: {
  slug: string;
  name: string;
  index?: number;
  sizes?: string;
  priority?: boolean;
  position?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return <GenerativeArt slug={slug} index={index} />;

  return (
    <Image
      src={`/images/artists/${slug}.jpg`}
      alt={`${name} — artist photo`}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      style={{ objectFit: "cover", objectPosition: position }}
    />
  );
}
