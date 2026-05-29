import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SkitForm } from "@/components/admin/skit-form";
import { deleteSkit } from "@/lib/actions/admin";

export default async function EditSkitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: skit }, { data: kitFiles }] = await Promise.all([
    supabase.from("skits").select("*").eq("id", id).single(),
    supabase.from("kit_files").select("*").eq("skit_id", id),
  ]);

  if (!skit) notFound();

  return (
    <>
      <div className="main-head">
        <h1>Edit skit</h1>
        <div className="spacer"></div>
        <form action={deleteSkit}>
          <input type="hidden" name="id" value={skit.id} />
          <button className="btn btn-ghost" type="submit">
            Delete
          </button>
        </form>
      </div>
      <SkitForm skit={skit} kitFiles={kitFiles ?? []} />
    </>
  );
}
