import { getCurrentProfile } from "@/lib/auth";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="admin-shell">
      <Sidebar profile={profile} />
      <main className="main">{children}</main>
    </div>
  );
}
