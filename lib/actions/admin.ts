"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { parseYouTubeId, slugify } from "@/lib/types";
import type { KitFileType, SkitStatus, UserRole } from "@/lib/types";

export type AdminFormState = { error?: string; ok?: string } | undefined;

const KIT_TYPES: KitFileType[] = ["script", "costumes", "notes"];

const KIT_LABELS: Record<KitFileType, string> = {
  script: "Script",
  costumes: "Costumes",
  notes: "Notes",
};

/** Ensure the current user is an admin; returns the supabase client or throws. */
async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Not authorized");
  }
  const supabase = await createClient();
  return supabase;
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) || "").trim();
}

/** Pick a unique slug derived from title; append -2, -3… if needed. */
async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  title: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(title) || "skit";
  let candidate = base;
  let n = 1;
  // Loop until we find a slug not used by another skit.
  // (Small dataset; a handful of queries at most.)
  for (;;) {
    let query = supabase.from("skits").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

/**
 * Create or update a skit, handle kit file uploads + thumbnail, then redirect.
 * Hidden `id` distinguishes create vs update. `intent` sets the status.
 */
export async function saveSkit(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await requireAdmin();
  } catch {
    return { error: "You don't have permission to do that." };
  }

  const id = str(formData, "id") || null;
  const title = str(formData, "title");
  if (!title) return { error: "Please give the skit a title." };

  const parsha = str(formData, "parsha");
  if (!parsha) return { error: "Please choose a parsha." };

  const intent = str(formData, "intent");
  const status: SkitStatus =
    intent === "publish"
      ? "live"
      : intent === "schedule"
        ? "scheduled"
        : "draft";

  const youtubeRaw = str(formData, "youtube_id");
  const youtube_id = youtubeRaw ? parseYouTubeId(youtubeRaw) : null;

  const issueRaw = str(formData, "issue_number");
  const issue_number = issueRaw ? Number.parseInt(issueRaw, 10) : null;

  const fields = {
    title,
    parsha,
    chumash: str(formData, "chumash") || null,
    youtube_id,
    description: str(formData, "description") || null,
    performed_by: str(formData, "performed_by") || null,
    skit_cast: str(formData, "skit_cast") || null,
    duration: str(formData, "duration") || null,
    issue_number: Number.isFinite(issue_number) ? issue_number : null,
    hebrew_date: str(formData, "hebrew_date") || null,
    release_date: str(formData, "release_date") || null,
    status,
  };

  let skitId = id;

  if (id) {
    const { error } = await supabase
      .from("skits")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const slug = await uniqueSlug(supabase, title);
    const { data, error } = await supabase
      .from("skits")
      .insert({ ...fields, slug })
      .select("id")
      .single();
    if (error || !data) return { error: error?.message || "Could not save skit." };
    skitId = data.id;
  }

  if (!skitId) return { error: "Could not save skit." };

  // --- Kit file uploads ---
  for (const type of KIT_TYPES) {
    const file = formData.get(type);
    if (file instanceof File && file.size > 0) {
      const path = `${skitId}/${type}.pdf`;
      const { error: upErr } = await supabase.storage
        .from("kit-files")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) return { error: `Kit upload failed: ${upErr.message}` };

      const { error: rowErr } = await supabase.from("kit_files").upsert(
        {
          skit_id: skitId,
          type,
          label: KIT_LABELS[type],
          file_name: file.name,
          storage_path: path,
        },
        { onConflict: "skit_id,type" }
      );
      if (rowErr) return { error: `Kit record failed: ${rowErr.message}` };
    }
  }

  // --- Thumbnail upload ---
  const thumb = formData.get("thumbnail");
  if (thumb instanceof File && thumb.size > 0) {
    const ext = thumb.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${skitId}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("thumbnails")
      .upload(path, thumb, { upsert: true, contentType: thumb.type });
    if (upErr) return { error: `Thumbnail upload failed: ${upErr.message}` };

    const { data: pub } = supabase.storage.from("thumbnails").getPublicUrl(path);
    await supabase
      .from("skits")
      .update({ thumbnail_url: pub.publicUrl })
      .eq("id", skitId);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/skits");
  revalidatePath("/browse");
  redirect("/admin/skits");
}

/** Delete a skit (form button). */
export async function deleteSkit(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  await supabase.from("skits").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/skits");
  redirect("/admin/skits");
}

const PLAN_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  rebbi: "Rebbi",
  school: "School",
  free: "Free",
};

/** Update a subscriber's role + plan label. */
export async function setSubscriberRole(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const role = str(formData, "role") as UserRole;
  if (!id || !role) return;
  await supabase
    .from("profiles")
    .update({ role, plan: PLAN_LABELS[role] ?? null })
    .eq("id", id);
  revalidatePath("/admin/subscribers");
}

/** Save program settings (row id = 1). */
export async function saveSettings(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await requireAdmin();
  } catch {
    return { error: "You don't have permission to do that." };
  }

  const program_name = str(formData, "program_name");
  const host_name = str(formData, "host_name");
  const release_day = str(formData, "release_day");
  const weekly_email = str(formData, "weekly_email") === "on";

  const { error } = await supabase
    .from("settings")
    .update({ program_name, host_name, release_day, weekly_email })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  return { ok: "Settings saved." };
}
