-- Bamboo restaurants: locations + shared menu with per-location overrides.

create extension if not exists "pgcrypto";

create table locations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,            -- 'birmingham' | 'chattanooga'
  name text not null,
  domain text not null,
  address_line1 text not null,
  city text not null,
  state text not null,
  zip text not null,
  phone text not null,
  hours jsonb not null default '[]',    -- [{ days, open, close }]
  social jsonb not null default '{}',   -- { instagram, facebook }
  announcement text,
  map_url text,
  active boolean not null default true
);

create table menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort int not null default 0
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references menu_categories (id),
  name text not null,
  description text,
  price numeric(6,2),                   -- null allowed for market-price items
  price_note text,                      -- e.g. 'MP', '6 pc'
  dietary_tags text[] not null default '{}',
  available boolean not null default true,
  location_slugs text[],                -- null = served at ALL locations
  sort int not null default 0
);

create table menu_item_overrides (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references menu_items (id) on delete cascade,
  location_slug text not null,          -- 'birmingham' | 'chattanooga'
  price numeric(6,2),
  price_note text,
  available boolean,
  unique (item_id, location_slug)
);

create index menu_items_category_id_idx on menu_items (category_id);
create index menu_item_overrides_item_id_idx on menu_item_overrides (item_id);
