import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasKitAccess, type UserRole } from "@/lib/types";

/**
 * Gated download for a kit file. Verifies the visitor has a paid role,
 * then issues a short-lived signed URL to the private storage object.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", _request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!hasKitAccess(profile?.role as UserRole | undefined)) {
    return NextResponse.json(
      { error: "A subscription is required to download recreate kits." },
      { status: 403 }
    );
  }

  const { data: file } = await supabase
    .from("kit_files")
    .select("storage_path, file_name")
    .eq("id", fileId)
    .single();

  if (!file) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const { data: signed, error } = await supabase.storage
    .from("kit-files")
    .createSignedUrl(file.storage_path, 60, { download: file.file_name });

  if (error || !signed) {
    return NextResponse.json(
      {
        error:
          "This kit file hasn't been uploaded yet. Please check back soon.",
      },
      { status: 404 }
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
