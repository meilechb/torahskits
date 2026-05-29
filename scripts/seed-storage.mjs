/**
 * Seeds placeholder kit PDFs into the private `kit-files` bucket so the
 * demo's download buttons work end-to-end. Uploads run as the admin user
 * (RLS lets admins write to storage), so no service-role key is needed.
 *
 * Usage:
 *   node scripts/seed-storage.mjs
 *
 * Requires env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *               SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD  (see .env.example)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!url || !key || !email || !password) {
  console.error("Missing env. See .env.example.");
  process.exit(1);
}

// A minimal valid one-page PDF.
function placeholderPdf(title) {
  const text = `Torah Skits — ${title} (placeholder kit file)`;
  return `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 90>>stream
BT /F1 18 Tf 72 700 Td (${text}) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f
trailer<</Root 1 0 R/Size 6>>
startxref
0
%%EOF`;
}

const supabase = createClient(url, key);

const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
if (authErr) {
  console.error("Admin sign-in failed:", authErr.message);
  process.exit(1);
}

const { data: files, error } = await supabase.from("kit_files").select("id, type, storage_path, skit_id");
if (error) {
  console.error("Could not read kit_files:", error.message);
  process.exit(1);
}

let ok = 0;
for (const f of files ?? []) {
  // Prefer a real PDF from ./seed/<type>.pdf if present, else generate one.
  const local = `seed/${f.type}.pdf`;
  const body = existsSync(local) ? readFileSync(local) : Buffer.from(placeholderPdf(f.type));
  const { error: upErr } = await supabase.storage
    .from("kit-files")
    .upload(f.storage_path, body, { upsert: true, contentType: "application/pdf" });
  if (upErr) {
    console.warn(`  ✗ ${f.storage_path}: ${upErr.message}`);
  } else {
    ok++;
  }
}
console.log(`Uploaded ${ok}/${files?.length ?? 0} kit files.`);
process.exit(0);
