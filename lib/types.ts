import type { Tables, Enums } from "@/lib/database.types";

export type Skit = Tables<"skits">;
export type KitFile = Tables<"kit_files">;
export type Profile = Tables<"profiles">;
export type Submission = Tables<"skit_submissions">;
export type Settings = Tables<"settings">;
export type UserRole = Enums<"user_role">;
export type SkitStatus = Enums<"skit_status">;
export type KitFileType = Enums<"kit_file_type">;

export type SkitWithKit = Skit & { kit_files: KitFile[] };

/** The five chumashim plus a catch-all for Yom Tov skits. */
export const CHUMASHIM = [
  "Bereishis",
  "Shemos",
  "Vayikra",
  "Bamidbar",
  "Devarim",
  "Yom Tov",
] as const;

/** Order of parshiyos for "by parsha order" sorting. */
export const PARSHA_ORDER: string[] = [
  // Bereishis
  "Bereishis","Noach","Lech Lecha","Vayeira","Chayei Sarah","Toldos","Vayeitzei","Vayishlach","Vayeishev","Mikeitz","Vayigash","Vayechi",
  // Shemos
  "Shemos","Vaeira","Bo","Beshalach","Yisro","Mishpatim","Terumah","Tetzaveh","Ki Sisa","Vayakhel","Pekudei",
  // Vayikra
  "Vayikra","Tzav","Shemini","Tazria","Metzora","Acharei Mos","Kedoshim","Emor","Behar","Bechukosai",
  // Bamidbar
  "Bamidbar","Naso","Behaaloscha","Shelach","Korach","Chukas","Balak","Pinchas","Matos","Masei",
  // Devarim
  "Devarim","Vaeschanan","Eikev","Re'eh","Shoftim","Ki Seitzei","Ki Savo","Nitzavim","Vayeilech","Haazinu","Vezos Haberacha",
];

/** Roles that can download recreate kits. */
export const PAID_ROLES: UserRole[] = ["admin", "rebbi", "school"];

export function hasKitAccess(role: UserRole | null | undefined): boolean {
  return !!role && PAID_ROLES.includes(role);
}

/** Build a YouTube thumbnail URL from a video id. */
export function youtubeThumb(youtubeId: string | null | undefined): string | null {
  if (!youtubeId) return null;
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/** Build a privacy-friendly YouTube embed URL. */
export function youtubeEmbed(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}

/**
 * Parse a YouTube id out of a full URL or a bare id.
 * Supports watch?v=, youtu.be/, /embed/, /shorts/.
 */
export function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1, 12) || null;
    }
    const v = url.searchParams.get("v");
    if (v) return v.slice(0, 11);
    const m = url.pathname.match(/\/(embed|shorts)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[2];
  } catch {
    /* not a URL */
  }
  return null;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Format an ISO date (yyyy-mm-dd) as e.g. "Jun 6, 2026". */
export function formatDate(date: string | null): string {
  if (!date) return "—";
  const d = new Date(date + (date.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Group skits into "Month Year" buckets for the browse page. */
export function groupByMonth(skits: Skit[]): { label: string; skits: Skit[] }[] {
  const groups: { label: string; skits: Skit[] }[] = [];
  let current: { label: string; skits: Skit[] } | null = null;
  for (const s of skits) {
    const label = s.release_date
      ? new Date(s.release_date + "T00:00:00").toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Coming soon";
    if (!current || current.label !== label) {
      current = { label, skits: [] };
      groups.push(current);
    }
    current.skits.push(s);
  }
  return groups;
}
