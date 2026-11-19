import { createPublicClient } from "@/lib/supabase/public";
import { PRICES_HIDDEN } from "@/lib/flags";
import type {
  LocationSlug,
  MenuCategory,
  MenuItem,
  MenuItemOverride,
  ResolvedMenuItem,
  ResolvedMenuSection,
} from "@/lib/types";

/** An item is on a location's menu when location_slugs is null (all locations)
 * or contains that location's slug. */
export function servedAtLocation(item: MenuItem, slug: LocationSlug): boolean {
  return item.location_slugs === null || item.location_slugs.includes(slug);
}

/** Effective value = override value when set, else base value. */
export function resolveItem(
  item: MenuItem,
  override: MenuItemOverride | undefined
): ResolvedMenuItem & { available: boolean } {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: override?.price ?? item.price,
    price_note: override?.price_note ?? item.price_note,
    available: override?.available ?? item.available,
    dietary_tags: item.dietary_tags,
    sort: item.sort,
  };
}

/** Pure resolution of the shared menu for one location: filters to items served
 * there, applies overrides, drops unavailable items, groups by category. Used by
 * both the page render and the JSON-LD builder so they can never disagree. */
export function resolveMenu(
  categories: MenuCategory[],
  items: MenuItem[],
  overrides: MenuItemOverride[],
  slug: LocationSlug
): ResolvedMenuSection[] {
  const overrideByItem = new Map(
    overrides.filter((o) => o.location_slug === slug).map((o) => [o.item_id, o])
  );

  return [...categories]
    .sort((a, b) => a.sort - b.sort)
    .map((category) => ({
      category,
      items: items
        .filter((i) => i.category_id === category.id && servedAtLocation(i, slug))
        .map((i) => resolveItem(i, overrideByItem.get(i.id)))
        .filter((i) => i.available)
        .sort((a, b) => a.sort - b.sort)
        .map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description,
          price: i.price,
          price_note: i.price_note,
          dietary_tags: i.dietary_tags,
          sort: i.sort,
        })),
    }))
    .filter((section) => section.items.length > 0);
}

/** While PRICES_HIDDEN, the public menu carries no dollar amounts: prices go,
 * any price_note that itself names one ("glass / $64 bottle") goes, and
 * amounts inside descriptions ("add tofu $1") are scrubbed out; portion notes
 * ("2 pc", "720 ml") stay. */
function stripPrices(menu: ResolvedMenuSection[]): ResolvedMenuSection[] {
  const scrub = (text: string | null) =>
    text === null ? null : text.replace(/\s*\$\d+(?:\.\d{1,2})?/g, "");
  return menu.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      price: null,
      price_note: item.price_note?.includes("$") ? null : item.price_note,
      description: scrub(item.description),
    })),
  }));
}

export async function getMenuForLocation(
  slug: LocationSlug
): Promise<ResolvedMenuSection[]> {
  const supabase = createPublicClient();

  const [categories, items, overrides] = await Promise.all([
    supabase.from("menu_categories").select("*"),
    supabase.from("menu_items").select("*"),
    supabase.from("menu_item_overrides").select("*"),
  ]);

  if (categories.error) throw categories.error;
  if (items.error) throw items.error;
  if (overrides.error) throw overrides.error;

  const menu = resolveMenu(
    categories.data as MenuCategory[],
    // numeric comes back as string from PostgREST unless cast; normalize here.
    (items.data as MenuItem[]).map((i) => ({
      ...i,
      price: i.price === null ? null : Number(i.price),
    })),
    (overrides.data as MenuItemOverride[]).map((o) => ({
      ...o,
      price: o.price === null ? null : Number(o.price),
    })),
    slug
  );
  return PRICES_HIDDEN ? stripPrices(menu) : menu;
}
