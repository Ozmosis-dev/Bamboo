-- CMS surfaces: editable page copy, image slots and gallery, and a public
-- storage bucket for owner uploads. Static files remain the fallback when a
-- row is absent, so the sites never break on missing content.

create table site_copy (
  location_slug text not null,          -- 'birmingham' | 'chattanooga'
  key text not null,                    -- e.g. 'hero_heading'
  value text not null,
  primary key (location_slug, key)
);

create table site_images (
  id uuid primary key default gen_random_uuid(),
  key text not null,                    -- slot name, or 'gallery'
  url text not null,
  alt text not null default '',
  sort int not null default 0
);
-- A slot holds exactly one image; the gallery holds many.
create unique index site_images_slot_idx on site_images (key)
  where key <> 'gallery';

alter table site_copy enable row level security;
alter table site_images enable row level security;

create policy "public read site_copy"
  on site_copy for select using (true);
create policy "public read site_images"
  on site_images for select using (true);

create policy "auth write site_copy"
  on site_copy for all to authenticated using (true) with check (true);
create policy "auth write site_images"
  on site_images for all to authenticated using (true) with check (true);

-- Storage bucket for uploaded photos (public read; owners write).
insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;

create policy "public read site bucket"
  on storage.objects for select using (bucket_id = 'site');
create policy "auth insert site bucket"
  on storage.objects for insert to authenticated with check (bucket_id = 'site');
create policy "auth update site bucket"
  on storage.objects for update to authenticated using (bucket_id = 'site');
create policy "auth delete site bucket"
  on storage.objects for delete to authenticated using (bucket_id = 'site');
