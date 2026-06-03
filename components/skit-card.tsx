import Link from "next/link";
import type { Skit } from "@/lib/types";
import { formatDate } from "@/lib/types";
import { PlayIcon } from "./icons";
import { YtThumb } from "./yt-thumb";

/**
 * A skit card for the library grids. The whole card links to the skit's
 * page — small thumbnails are never played inline (only the page's main
 * player and the home hero play in place).
 */
export function SkitCard({ skit }: { skit: Skit }) {
  return (
    <Link className="card" href={`/skit/${skit.slug}`}>
      <div className="th">
        {skit.thumbnail_url ? (
          <img src={skit.thumbnail_url} alt="" loading="lazy" />
        ) : skit.youtube_id ? (
          <YtThumb id={skit.youtube_id} />
        ) : null}
        <div className="pl">
          <div className="play-btn">
            <PlayIcon size={16} />
          </div>
        </div>
        <span className="num">{skit.parsha}</span>
        {skit.duration && <span className="dur">{skit.duration}</span>}
      </div>
      <h3>{skit.title}</h3>
      <div className="dt">{formatDate(skit.release_date)}</div>
    </Link>
  );
}
