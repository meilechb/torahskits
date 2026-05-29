import Link from "next/link";
import type { Skit } from "@/lib/types";
import { formatDate, youtubeThumb } from "@/lib/types";
import { PlayIcon } from "./icons";

/** A single skit card for the library grids. */
export function SkitCard({ skit }: { skit: Skit }) {
  const thumb = skit.thumbnail_url || youtubeThumb(skit.youtube_id);
  return (
    <Link className="card" href={`/skit/${skit.slug}`}>
      <div className="th">
        {thumb && <img src={thumb} alt="" loading="lazy" />}
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
