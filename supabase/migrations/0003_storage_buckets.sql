-- ============================================================
-- Storage buckets
--   kit-files  : private PDFs (scripts/costumes/notes) — gated downloads
--   thumbnails : public skit thumbnail images
-- ============================================================
insert into storage.buckets (id, name, public) values ('kit-files', 'kit-files', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('thumbnails', 'thumbnails', true)
  on conflict (id) do nothing;

-- kit-files: only paid users (rebbi/school) and admins may download
create policy "kit-files: paid read" on storage.objects for select
  using ( bucket_id = 'kit-files' and public.has_kit_access() );
create policy "kit-files: admin write" on storage.objects for insert
  with check ( bucket_id = 'kit-files' and public.is_admin() );
create policy "kit-files: admin update" on storage.objects for update
  using ( bucket_id = 'kit-files' and public.is_admin() );
create policy "kit-files: admin delete" on storage.objects for delete
  using ( bucket_id = 'kit-files' and public.is_admin() );

-- thumbnails: public read, admin write
create policy "thumbnails: public read" on storage.objects for select
  using ( bucket_id = 'thumbnails' );
create policy "thumbnails: admin write" on storage.objects for insert
  with check ( bucket_id = 'thumbnails' and public.is_admin() );
create policy "thumbnails: admin update" on storage.objects for update
  using ( bucket_id = 'thumbnails' and public.is_admin() );
create policy "thumbnails: admin delete" on storage.objects for delete
  using ( bucket_id = 'thumbnails' and public.is_admin() );
