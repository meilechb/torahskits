import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <>
      <div className="main-head">
        <h1>Settings</h1>
      </div>
      <SettingsForm settings={settings ?? null} />
    </>
  );
}
