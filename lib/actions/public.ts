"use server";

import { createClient } from "@/lib/supabase/server";

export type FormResult = { ok?: string; error?: string } | undefined;

/** Newsletter signup (anyone). */
export async function subscribeNewsletter(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  const email = String(formData.get("email") || "").trim();
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });
  if (error && !error.message.includes("duplicate")) {
    return { error: "Something went wrong. Please try again." };
  }
  return { ok: "You're signed up! Look out for the new skit every week." };
}

/** Rebbi submits their class's recreated skit. */
export async function submitSkit(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  const submitter_name = String(formData.get("submitter_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const school = String(formData.get("school") || "").trim() || null;
  const parsha = String(formData.get("parsha") || "").trim() || null;
  const video_url = String(formData.get("video_url") || "").trim() || null;
  const message = String(formData.get("message") || "").trim() || null;

  if (!submitter_name || !email) {
    return { error: "Please tell us your name and email." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("skit_submissions").insert({
    submitter_name,
    email,
    school,
    parsha,
    video_url,
    message,
  });
  if (error) {
    return { error: "Something went wrong. Please try again." };
  }
  return {
    ok: "Thank you! We received your skit and will be in touch soon.",
  };
}
