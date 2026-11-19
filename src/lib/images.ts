import { createPublicClient } from "@/lib/supabase/public";

export type GalleryImage = { url: string; alt: string };

/** Single-image slots the owners can replace, with their shipped defaults. */
export const IMAGE_SLOTS: { key: string; label: string; hint: string; fallback: string }[] = [
  {
    key: "hero_door",
    label: "Homepage hero",
    hint: "The tall photo on the right of the homepage.",
    fallback: "/brand/hero-door.webp",
  },
  {
    key: "coming_model_poster",
    label: "Coming-soon storefront",
    hint: "The storefront image on the pre-opening panel (opens the 3D room).",
    fallback: "/brand/visit-storefront.png",
  },
  {
    key: "coming_backdrop",
    label: "Coming-soon backdrop",
    hint: "The aerial neighborhood photo behind the pre-opening panel.",
    fallback: "/brand/location-aerial.webp",
  },
  {
    key: "visit_storefront",
    label: "Visit page photo",
    hint: "The storefront photo beside hours on the Visit page.",
    fallback: "/brand/visit-storefront.png",
  },
  {
    key: "counter",
    label: "Kitchen photo",
    hint: "The wide photo behind the homepage paragraph.",
    fallback: "/photos/counter.webp",
  },
  {
    key: "dining_room",
    label: "Dining room photo",
    hint: "The full-width photo and side panel on the About page.",
    fallback: "/photos/dining-room.webp",
  },
];

/** The scrolling food banner's shipped set; gallery rows replace it wholesale
 * once the owners add their own. */
export const DEFAULT_GALLERY: GalleryImage[] = [
  { url: "/photos/rolls-platter.webp", alt: "Specialty rolls on slate boards" },
  { url: "/photos/sashimi-board.webp", alt: "Nigiri and sashimi with shaved carrot" },
  { url: "/photos/ramen-close.webp", alt: "Pork belly ramen with soft egg" },
  { url: "/photos/rainbow-roll.webp", alt: "Rainbow roll with spicy mayo" },
  { url: "/photos/glazed-bowl.webp", alt: "Glazed rice bowl beside skewers" },
  { url: "/photos/roll-closeup.webp", alt: "Torched roll with spicy mayo and sesame" },
  { url: "/photos/ribs.webp", alt: "Slow roasted baby back ribs with rice and slaw" },
  { url: "/photos/nigiri.webp", alt: "Glazed nigiri and rolls" },
  { url: "/photos/skewers.webp", alt: "Lemongrass chicken skewers" },
  { url: "/photos/ramen.webp", alt: "Noodle bowl with soft egg and crispy wonton" },
];

/** The rest of the food set, shown when the banner's full gallery is
 * expanded; `food_gallery` rows replace it wholesale once the owners
 * add their own. */
export const DEFAULT_GALLERY_EXTRA: GalleryImage[] = [
  { url: "/photos/tuna-tataki.webp", alt: "Seared tuna tataki with jalapeño and sesame" },
  { url: "/photos/sushi-spread.webp", alt: "Sushi spread of specialty and crispy rolls" },
  { url: "/photos/pork-ramen.webp", alt: "Chashu ramen with marinated egg" },
  { url: "/photos/crunch-roll.webp", alt: "Crunchy California rolls with spicy mayo" },
  { url: "/photos/green-beans.webp", alt: "Tempura green beans" },
  { url: "/photos/chili-dumplings.webp", alt: "Steamed dumplings in chili sauce" },
  { url: "/photos/calamari.webp", alt: "Crispy calamari with lemon" },
  { url: "/photos/spring-rolls.webp", alt: "Spring rolls with sweet chili sauce" },
  { url: "/photos/wonton-noodle-bowl.webp", alt: "Noodle bowl with mushrooms and crispy wonton strips" },
  { url: "/photos/dumplings.webp", alt: "Dumplings in ponzu with cilantro" },
  { url: "/photos/beef-bowl.webp", alt: "Sesame-glazed beef bowl with shaved carrot" },
  { url: "/photos/pork-belly-skewers.webp", alt: "Pork belly skewers with sweet chili sauce" },
  { url: "/photos/rolls-drizzle.webp", alt: "Specialty rolls with spicy mayo drizzle" },
  { url: "/photos/salmon-skewers.webp", alt: "Glazed salmon skewers with shaved carrot" },
  { url: "/photos/chicken-wonton-soup.webp", alt: "Chicken and wonton soup with crispy strips" },
  { url: "/photos/roll-board.webp", alt: "Full board of specialty rolls" },
  { url: "/photos/shrimp-skewers.webp", alt: "Grilled shrimp skewers with scallion" },
];

export type SiteImages = {
  slots: Record<string, string>;
  gallery: GalleryImage[];
  galleryExtra: GalleryImage[];
};

/** Slot URLs (uploaded or fallback) and the food gallery. Never throws. */
export async function getSiteImages(): Promise<SiteImages> {
  const slots = Object.fromEntries(IMAGE_SLOTS.map((s) => [s.key, s.fallback]));
  let gallery = DEFAULT_GALLERY;
  let galleryExtra = DEFAULT_GALLERY_EXTRA;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_images")
      .select("key, url, alt, sort")
      .order("sort");
    const rows = data ?? [];
    for (const row of rows) {
      if (row.key in slots && row.url) slots[row.key] = row.url;
    }
    const uploaded = rows.filter((r) => r.key === "gallery" && r.url);
    if (uploaded.length > 0) {
      gallery = uploaded.map((r) => ({ url: r.url, alt: r.alt ?? "" }));
    }
    const extra = rows.filter((r) => r.key === "food_gallery" && r.url);
    if (extra.length > 0) {
      galleryExtra = extra.map((r) => ({ url: r.url, alt: r.alt ?? "" }));
    }
  } catch {}
  return { slots, gallery, galleryExtra };
}
