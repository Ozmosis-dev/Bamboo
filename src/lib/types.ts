export type LocationSlug = "birmingham" | "chattanooga";

export type HoursEntry = {
  days: string;
  open: string;
  close: string;
};

export type Location = {
  id: string;
  slug: LocationSlug;
  name: string;
  domain: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: HoursEntry[];
  social: { instagram?: string; facebook?: string };
  announcement: string | null;
  map_url: string | null;
  active: boolean;
};

export type DietaryTag = "gluten-free" | "vegetarian" | "vegan" | "spicy";

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  sort: number;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_note: string | null;
  dietary_tags: DietaryTag[];
  available: boolean;
  location_slugs: string[] | null;
  sort: number;
};

export type MenuItemOverride = {
  id: string;
  item_id: string;
  location_slug: string;
  price: number | null;
  price_note: string | null;
  available: boolean | null;
};

/** A menu item with per-location overrides applied. */
export type ResolvedMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_note: string | null;
  dietary_tags: DietaryTag[];
  sort: number;
};

export type ResolvedMenuSection = {
  category: MenuCategory;
  items: ResolvedMenuItem[];
};
