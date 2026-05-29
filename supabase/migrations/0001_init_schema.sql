-- ============================================================
-- Torah Skits — core schema
-- ============================================================

-- Enums
create type user_role as enum ('admin', 'rebbi', 'school', 'free');
create type skit_status as enum ('draft', 'scheduled', 'live');
create type kit_file_type as enum ('script', 'costumes', 'notes');
create type submission_status as enum ('new', 'reviewing', 'featured', 'archived');

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'free',
  plan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.has_kit_access()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'rebbi', 'school'));
$$;

-- ---------- skits ----------
create table public.skits (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  parsha text not null,
  chumash text,
  youtube_id text,
  description text,
  performed_by text,
  skit_cast text,
  duration text,
  thumbnail_url text,
  issue_number int,
  hebrew_date text,
  release_date date,
  status skit_status not null default 'draft',
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.skits enable row level security;
create index skits_status_release_idx on public.skits (status, release_date desc);
create index skits_chumash_idx on public.skits (chumash);

-- ---------- kit_files ----------
create table public.kit_files (
  id uuid primary key default gen_random_uuid(),
  skit_id uuid not null references public.skits(id) on delete cascade,
  type kit_file_type not null,
  label text,
  file_name text not null,
  storage_path text not null,
  meta text,
  created_at timestamptz not null default now(),
  unique (skit_id, type)
);
alter table public.kit_files enable row level security;

-- ---------- newsletter_subscribers ----------
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;

-- ---------- skit_submissions ----------
create table public.skit_submissions (
  id uuid primary key default gen_random_uuid(),
  submitter_name text not null,
  email text not null,
  school text,
  parsha text,
  message text,
  video_url text,
  status submission_status not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.skit_submissions enable row level security;

-- ---------- settings (single row) ----------
create table public.settings (
  id int primary key default 1,
  program_name text not null default 'Torah Skits',
  host_name text not null default 'Rabbi Friedman',
  release_day text not null default 'Thursday',
  weekly_email boolean not null default true,
  constraint settings_singleton check (id = 1)
);
alter table public.settings enable row level security;
insert into public.settings (id) values (1) on conflict do nothing;

-- ---------- updated_at triggers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger skits_updated_at before update on public.skits
  for each row execute function public.set_updated_at();

-- ---------- new-user trigger ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
