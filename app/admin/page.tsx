import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/types";

function statusTag(status: string) {
  if (status === "live") return <span className="tag-status live">Live</span>;
  if (status === "scheduled")
    return <span className="tag-status sched">Scheduled</span>;
  return <span className="tag-status draft">Draft</span>;
}

function compactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: skits }, { count: kitCount }, { data: profiles }] =
    await Promise.all([
      supabase
        .from("skits")
        .select("id,title,parsha,release_date,status,views,kit_files(id)")
        .order("created_at", { ascending: false }),
      supabase.from("kit_files").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("role"),
    ]);

  const all = skits ?? [];
  const published = all.filter((s) => s.status === "live").length;
  const totalViews = all.reduce((sum, s) => sum + (s.views ?? 0), 0);
  const activeSubs = (profiles ?? []).filter((p) =>
    ["admin", "rebbi", "school"].includes(p.role)
  ).length;

  const recent = all.slice(0, 6);

  return (
    <>
      <div className="main-head">
        <h1>Dashboard</h1>
        <div className="spacer"></div>
        <Link className="btn btn-pri" href="/admin/upload">
          ＋ New skit
        </Link>
      </div>

      <div className="stat-cards">
        <div className="scard">
          <div className="n">{published}</div>
          <div className="l">Skits published</div>
        </div>
        <div className="scard">
          <div className="n">{compactNumber(totalViews)}</div>
          <div className="l">Total views</div>
        </div>
        <div className="scard">
          <div className="n">{kitCount ?? 0}</div>
          <div className="l">Kit files</div>
        </div>
        <div className="scard">
          <div className="n">{activeSubs}</div>
          <div className="l">Active subscribers</div>
        </div>
      </div>

      <div className="panel pad">
        <h3 className="card-title">Recent skits</h3>
        <table className="tbl">
          <tbody>
            <tr>
              <th>Skit</th>
              <th>Parsha</th>
              <th>Date</th>
              <th>Kit</th>
              <th>Status</th>
              <th>Views</th>
              <th></th>
            </tr>
            {recent.map((s) => {
              const n = s.kit_files?.length ?? 0;
              return (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.parsha}</td>
                  <td>{formatDate(s.release_date)}</td>
                  <td>
                    {n >= 3 ? "✓ Complete" : `${n} of 3 files`}
                  </td>
                  <td>{statusTag(s.status)}</td>
                  <td>{s.status === "live" ? s.views : "—"}</td>
                  <td className="actions-cell">
                    <Link href={`/admin/skits/${s.id}`}>Edit</Link>
                  </td>
                </tr>
              );
            })}
            {recent.length === 0 && (
              <tr>
                <td colSpan={7} className="muted">
                  No skits yet. Upload your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
