import { createClient } from "@/lib/supabase/server";
import type { Skit, SkitWithKit, KitFile } from "@/lib/types";

/** All live skits, newest first. */
export async function getLiveSkits(limit?: number): Promise<Skit[]> {
  const supabase = await createClient();
  let query = supabase
    .from("skits")
    .select("*")
    .eq("status", "live")
    .order("release_date", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return data ?? [];
}

/** The most recently uploaded live skit (newest by created_at) — used for the home hero. */
export async function getMostRecentSkit(): Promise<Skit | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skits")
    .select("*")
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0] ?? null;
}

/** A single live skit by slug, with its kit files. Returns null if not found. */export async function getSkitBySlug(slug: string): Promise<SkitWithKit | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skits")
    .select("*, kit_files(*)")
    .eq("slug", slug)
    .single();
  if (!data) return null;
  return data as SkitWithKit;
}

/** Live skits other than the given one — used for "more skits". */
export async function getRelatedSkits(excludeId: string, limit = 4): Promise<Skit[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skits")
    .select("*")
    .eq("status", "live")
    .neq("id", excludeId)
    .order("release_date", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** Count of live skits, and counts per chumash — for home/browse stats. */
export async function getChumashCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skits")
    .select("chumash")
    .eq("status", "live");
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const c = row.chumash ?? "Other";
    counts[c] = (counts[c] ?? 0) + 1;
  }
  return counts;
}

/** Scheduled skits (admin + dashboard "coming up"). */
export async function getUpcomingSkits(limit = 3): Promise<Skit[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skits")
    .select("*")
    .eq("status", "scheduled")
    .order("release_date", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getKitFiles(skitId: string): Promise<KitFile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kit_files")
    .select("*")
    .eq("skit_id", skitId);
  return data ?? [];
}
