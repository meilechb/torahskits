-- ============================================================
-- RLS policies
-- ============================================================

-- profiles
create policy "profiles: self read" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles: self update" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "profiles: admin update any" on public.profiles for update
  using (public.is_admin());

-- skits
create policy "skits: public read live" on public.skits for select
  using (status = 'live' or public.is_admin());
create policy "skits: admin write" on public.skits for all
  using (public.is_admin()) with check (public.is_admin());

-- kit_files
create policy "kit_files: public read" on public.kit_files for select
  using (public.is_admin()
    or exists (select 1 from public.skits s where s.id = skit_id and s.status = 'live'));
create policy "kit_files: admin write" on public.kit_files for all
  using (public.is_admin()) with check (public.is_admin());

-- newsletter_subscribers
create policy "newsletter: anyone insert" on public.newsletter_subscribers for insert with check (true);
create policy "newsletter: admin read" on public.newsletter_subscribers for select using (public.is_admin());

-- skit_submissions
create policy "submissions: anyone insert" on public.skit_submissions for insert with check (true);
create policy "submissions: admin read" on public.skit_submissions for select using (public.is_admin());
create policy "submissions: admin update" on public.skit_submissions for update using (public.is_admin());

-- settings
create policy "settings: public read" on public.settings for select using (true);
create policy "settings: admin update" on public.settings for update
  using (public.is_admin()) with check (public.is_admin());
