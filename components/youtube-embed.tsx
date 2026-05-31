"use client";

import { useState } from "react";
import { youtubeEmbed } from "@/lib/types";
import { PlayIcon } from "./icons";
import { YtThumb } from "./yt-thumb";

/**
 * Click-to-load YouTube embed in the parchment "video" frame.
 * Shows the thumbnail + play button first, then swaps in the iframe.
 */
export function YouTubeEmbed({
  youtubeId,
  title,
  tag,
  duration,
}: {
  youtubeId: string;
  title?: string;
  tag?: string;
  duration?: string | null;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="video hero-video">
      {playing ? (
        <iframe
          src={`${youtubeEmbed(youtubeId)}?autoplay=1&rel=0`}
          title={title || "Skit video"}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="poster"
          onClick={() => setPlaying(true)}
          aria-label={`Play${title ? `: ${title}` : ""}`}
        >
          <YtThumb id={youtubeId} alt={title || ""} />
          <span className="play-btn">
            <PlayIcon size={32} />
          </span>
        </button>
      )}
      {tag && <span className="tag">{tag}</span>}
      {duration && <span className="dur">{duration}</span>}
    </div>
  );
}
