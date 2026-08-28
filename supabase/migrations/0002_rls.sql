-- RLS: anonymous read for the public sites, writes for authenticated admin only.
-- Availability filtering happens in the app layer (it depends on the resolved
-- location), not here.

alter table locations enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table menu_item_overrides enable row level security;

create policy "public read locations"
  on locations for select using (true);
create policy "public read categories"
  on menu_categories for select using (true);
create policy "public read items"
  on menu_items for select using (true);
create policy "public read overrides"
  on menu_item_overrides for select using (true);

create policy "auth write locations"
  on locations for all to authenticated using (true) with check (true);
create policy "auth write categories"
  on menu_categories for all to authenticated using (true) with check (true);
create policy "auth write items"
  on menu_items for all to authenticated using (true) with check (true);
create policy "auth write overrides"
  on menu_item_overrides for all to authenticated using (true) with check (true);
