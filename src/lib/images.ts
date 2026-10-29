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
    label: "Coming-soon model preview",
    hint: "The small 3D-room image on the pre-opening panel.",
    fallback: "/brand/floor-model-poster.jpg",
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

export type SiteImages = {
  slots: Record<string, string>;
  gallery: GalleryImage[];
};

/** Slot URLs (uploaded or fallback) and the food gallery. Never throws. */
export async function getSiteImages(): Promise<SiteImages> {
  const slots = Object.fromEntries(IMAGE_SLOTS.map((s) => [s.key, s.fallback]));
  let gallery = DEFAULT_GALLERY;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_images")
      .select("key, url, alt, sort")
      .order("sort");
    const rows = data ?? [];
    for (const row of rows) {
      if (row.key !== "gallery" && row.key in slots && row.url) slots[row.key] = row.url;
    }
    const uploaded = rows.filter((r) => r.key === "gallery" && r.url);
    if (uploaded.length > 0) {
      gallery = uploaded.map((r) => ({ url: r.url, alt: r.alt ?? "" }));
    }
  } catch {}
  return { slots, gallery };
}
