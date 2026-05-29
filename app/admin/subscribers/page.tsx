import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/types";
import { SubscriberRow } from "@/components/admin/subscriber-row";

export default async function AdminSubscribersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const all = profiles ?? [];

  const rebbis = all.filter((p) => p.role === "rebbi").length;
  const schools = all.filter((p) => p.role === "school").length;
  const free = all.filter((p) => p.role === "free").length;
  const active = all.filter((p) =>
    ["admin", "rebbi", "school"].includes(p.role)
  ).length;
  const monthlyRevenue = rebbis * 8 + schools * 39;

  return (
    <>
      <div className="main-head">
        <h1>Subscribers</h1>
        <div className="spacer"></div>
        <a className="btn btn-ghost" href="#">
          Export CSV
        </a>
      </div>

      <div className="stat-cards">
        <div className="scard">
          <div className="n">{active}</div>
          <div className="l">Active</div>
        </div>
        <div className="scard">
          <div className="n">${monthlyRevenue}</div>
          <div className="l">Monthly revenue</div>
        </div>
        <div className="scard">
          <div className="n">{free}</div>
          <div className="l">Free accounts</div>
        </div>
        <div className="scard">
          <div className="n">{schools}</div>
          <div className="l">Schools</div>
        </div>
      </div>

      <div className="panel pad">
        <table className="tbl">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Joined</th>
              <th>Role</th>
            </tr>
            {all.map((p) => (
              <tr key={p.id}>
                <td>{p.full_name || "—"}</td>
                <td>{p.email}</td>
                <td>{p.plan || "—"}</td>
                <td>{formatDate(p.created_at?.slice(0, 10) ?? null)}</td>
                <td>
                  <SubscriberRow id={p.id} role={p.role} />
                </td>
              </tr>
            ))}
            {all.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
