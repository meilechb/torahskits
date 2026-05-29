import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, youtubeThumb } from "@/lib/types";

function statusTag(status: string) {
  if (status === "live") return <span className="tag-status live">Live</span>;
  if (status === "scheduled")
    return <span className="tag-status sched">Scheduled</span>;
  return <span className="tag-status draft">Draft</span>;
}

export default async function AdminSkitsPage() {
  const supabase = await createClient();
  const { data: skits } = await supabase
    .from("skits")
    .select("id,title,parsha,release_date,status,views,thumbnail_url,youtube_id,kit_files(id)")
    .order("created_at", { ascending: false });

  const all = skits ?? [];

  return (
    <>
      <div className="main-head">
        <h1>All skits</h1>
        <div className="spacer"></div>
        <Link className="btn btn-pri" href="/admin/upload">
          ＋ New skit
        </Link>
      </div>

      <div className="panel pad">
        <table className="tbl">
          <tbody>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Parsha</th>
              <th>Date</th>
              <th>Kit files</th>
              <th>Status</th>
              <th>Views</th>
              <th></th>
            </tr>
            {all.map((s) => {
              const n = s.kit_files?.length ?? 0;
              const thumb = s.thumbnail_url ?? youtubeThumb(s.youtube_id);
              return (
                <tr key={s.id}>
                  <td>
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="thumbcell"
                        src={thumb}
                        alt=""
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="thumbcell"></div>
                    )}
                  </td>
                  <td>{s.title}</td>
                  <td>{s.parsha}</td>
                  <td>{formatDate(s.release_date)}</td>
                  <td>{n} / 3</td>
                  <td>{statusTag(s.status)}</td>
                  <td>{s.status === "live" ? s.views : "—"}</td>
                  <td className="actions-cell">
                    <Link href={`/admin/skits/${s.id}`}>Edit</Link>
                  </td>
                </tr>
              );
            })}
            {all.length === 0 && (
              <tr>
                <td colSpan={8} className="muted">
                  No skits yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
