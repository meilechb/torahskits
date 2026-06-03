"use client";

import { useEffect, useId, useState } from "react";
import { youtubeEmbed } from "@/lib/types";
import { PlayIcon } from "./icons";
import { YtThumb } from "./yt-thumb";

// When any embed starts playing it announces itself on this event; every other
// embed listening resets to its thumbnail, so only one video ever plays.
const PLAY_EVENT = "torahskits:play";

/**
 * Click-to-load YouTube embed in the parchment "video" frame.
 * Shows a high-res thumbnail + play button, then swaps in the iframe.
 * Only one embed on the page can play at a time.
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
  const id = useId();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    function onOtherPlay(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (detail !== id) setPlaying(false);
    }
    window.addEventListener(PLAY_EVENT, onOtherPlay as EventListener);
    return () =>
      window.removeEventListener(PLAY_EVENT, onOtherPlay as EventListener);
  }, [playing, id]);

  function play() {
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: id }));
    setPlaying(true);
  }

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
          onClick={play}
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
