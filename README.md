# Torah Skits

A weekly Parsha-skit platform for a rebbi (school teacher) and his class. Every
week a new skit goes up on the week's parsha — **free to watch** for families,
with a downloadable **recreate kit** (script, costume/prop list, director's
notes) for subscribing rebbeim who want to put on the skit with their own class.

Built with **Next.js 16 (App Router) + TypeScript** and **Supabase**
(Postgres, Auth, Storage). The visual design is a warm "parchment" system —
burgundy + gold on cream paper, Frank Ruhl Libre (serif) + Karla (sans), with
full Hebrew support.

## Features

- **Public site** — home (this-week hero + library), browse/search/filter by
  chumash, individual skit pages with click-to-play YouTube embeds.
- **Recreate kits** — gated PDF downloads (script / costumes / notes) served
  via short-lived signed URLs; only paid roles can download.
- **Auth** — email + password via Supabase. Single sign-in routes admins to the
  admin portal and everyone else to their library.
- **Subscriber dashboard** ("My Library") — this week's kit, recently unlocked
  skits, subscription details, and what's coming up.
- **Admin panel** (the rebbi) — dashboard stats, manage all skits, an easy
  **upload flow** (paste a YouTube link, fill details, drop in the kit PDFs,
  publish / save draft / schedule), subscriber management, and settings.
- **Landing for rebbeim** — the Subscribe / "Recreate It" page and a "Submit
  your skit" form for classes that recreate a skit.
- **Newsletter** signup.

## Tech / architecture

| Area      | Choice |
|-----------|--------|
| Framework | Next.js 16 App Router, React 19, TypeScript |
| Styling   | Custom CSS design system in `app/globals.css` (+ Tailwind v4 available) |
| Fonts     | `next/font` — Frank Ruhl Libre + Karla |
| Backend   | Supabase: Postgres + Row Level Security, Auth, Storage |
| Auth gate | `middleware.ts` guards `/admin` (admin only) and `/dashboard` (any user) |

### Key directories

```
app/
  page.tsx              Home
  browse/               All skits (search / filter / sort)
  skit/[slug]/          Skit detail + gated kit downloads
  subscribe/  about/  submit/   Marketing + submission
  login/  signup/       Auth
  dashboard/            Subscriber library
  admin/                Admin portal (layout + dashboard/skits/upload/subscribers/settings)
  api/kit/[fileId]/     Gated signed-URL download for a kit file
components/             Shared UI (header, footer, skit card, YouTube embed, admin/*)
lib/
  supabase/             Browser / server / middleware clients
  queries.ts  auth.ts  types.ts
  actions/              Server actions (auth, public, admin)
  database.types.ts     Generated Supabase types
supabase/migrations/    SQL schema, RLS policies, storage buckets, seed
scripts/seed-storage.mjs  Uploads placeholder kit PDFs (runs as admin)
```

### Data model

`profiles` (role: admin | rebbi | school | free), `skits`, `kit_files`
(script/costumes/notes per skit), `newsletter_subscribers`, `skit_submissions`,
`settings`. RLS: live skits are world-readable; admins read/write everything;
kit-file downloads (private `kit-files` bucket) require a paid role.

> **Subscriptions:** tiers and access-gating are built, but no payment
> processor is wired up yet. An admin grants paid access by setting a user's
> role to `rebbi`/`school` in the admin **Subscribers** screen.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + publishable key
npm run dev                  # http://localhost:3000
```

Environment variables (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
```

### Demo logins (seeded)

| Role            | Email                   | Password          |
|-----------------|-------------------------|-------------------|
| Admin (rebbi)   | `admin@torahskits.com`  | `TorahSkits2026!` |
| Paid subscriber | `rebbi@torahskits.com`  | `TorahSkits2026!` |
| Free family     | `family@torahskits.com` | `TorahSkits2026!` |

### Seed the kit PDFs (optional, makes downloads work in the demo)

```bash
node scripts/seed-storage.mjs     # uploads placeholder PDFs as the admin user
```

## Database

Schema, RLS policies, storage buckets, and seed data live in
`supabase/migrations/`. Apply them to a fresh project with the Supabase CLI
(`supabase db push`) or paste them into the SQL editor in order.

## Deploy

Deploys to **Vercel**. Set the two `NEXT_PUBLIC_*` env vars in the Vercel
project, then `vercel --prod` (or connect the repo). The Supabase project's
Auth → URL configuration should include the deployed origin.
