"use client";

import Link from "next/link";
import { useState } from "react";
import type { Skit } from "@/lib/types";
import { formatDate, youtubeEmbed } from "@/lib/types";
import { PlayIcon } from "./icons";
import { YtThumb } from "./yt-thumb";

/**
 * A skit card for the library grids.
 * - The play button plays the video inline (right away).
 * - The title and date link to the skit's page.
 */
export function SkitCard({ skit }: { skit: Skit }) {
  const [playing, setPlaying] = useState(false);
  const canPlay = !!skit.youtube_id;

  return (
    <div className="card">
      <div className="th">
        {playing && skit.youtube_id ? (
          <iframe
            src={`${youtubeEmbed(skit.youtube_id)}?autoplay=1&rel=0`}
            title={skit.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {skit.thumbnail_url ? (
              <img src={skit.thumbnail_url} alt="" loading="lazy" />
            ) : skit.youtube_id ? (
              <YtThumb id={skit.youtube_id} />
            ) : null}
            <button
              type="button"
              className="pl"
              aria-label={`Play ${skit.title}`}
              onClick={() => setPlaying(true)}
              disabled={!canPlay}
            >
              <span className="play-btn">
                <PlayIcon size={16} />
              </span>
            </button>
            <span className="num">{skit.parsha}</span>
            {skit.duration && <span className="dur">{skit.duration}</span>}
          </>
        )}
      </div>
      <Link href={`/skit/${skit.slug}`} className="card-link">
        <h3>{skit.title}</h3>
        <div className="dt">{formatDate(skit.release_date)}</div>
      </Link>
    </div>
  );
}
