"use client";

import { useState } from "react";

/**
 * YouTube thumbnail at the highest available resolution.
 * Starts at maxresdefault (1280×720) and falls back to hqdefault
 * if the HD thumbnail doesn't exist for that video.
 */
export function YtThumb({ id, alt = "" }: { id: string; alt?: string }) {
  const [src, setSrc] = useState(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  );
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() =>
        setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
      }
    />
  );
}
