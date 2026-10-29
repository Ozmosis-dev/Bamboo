import { getCopy } from "@content/index";
import { createPublicClient } from "@/lib/supabase/public";
import type { LocationSlug } from "@/lib/types";

/** Every owner-editable text on the site, keyed for the CMS. The file copy in
 * content/ provides the defaults; a site_copy row overrides per location. */
export type SiteContent = {
  coming_heading: string;
  coming_subheading: string;
  coming_open_date: string;
  coming_map_heading: string;
  hero_heading: string;
  hero_subheading: string;
  intro: string;
  about_shared: string;
  about_local: string;
  visit_notes: string;
  menu_tagline: string;
  contact_lead: string;
};

export const CONTENT_FIELDS: {
  key: keyof SiteContent;
  label: string;
  hint: string;
  multiline?: boolean;
}[] = [
  {
    key: "coming_heading",
    label: "Coming-soon headline",
    hint: "The big line on the pre-opening panel.",
  },
  {
    key: "coming_subheading",
    label: "Coming-soon note",
    hint: "The construction note under the coming-soon headline.",
    multiline: true,
  },
  {
    key: "coming_open_date",
    label: "Target opening",
    hint: "Shown on the coming-soon panel, e.g. “February 1, 2027”.",
  },
  {
    key: "coming_map_heading",
    label: "Coming-soon map heading",
    hint: "Above the neighborhood map on the pre-opening panel.",
  },
  { key: "hero_heading", label: "Homepage headline", hint: "The big line visitors see first." },
  {
    key: "hero_subheading",
    label: "Homepage subheading",
    hint: "One or two sentences under the headline.",
    multiline: true,
  },
  {
    key: "intro",
    label: "Behind-the-counter paragraph",
    hint: "Shown over the kitchen photo on the homepage.",
    multiline: true,
  },
  {
    key: "about_shared",
    label: "About — our story",
    hint: "The big statement on the About page.",
    multiline: true,
  },
  {
    key: "about_local",
    label: "About — this location",
    hint: "The paragraph about this restaurant specifically.",
    multiline: true,
  },
  {
    key: "visit_notes",
    label: "Parking & directions",
    hint: "Shown on the Visit page.",
    multiline: true,
  },
  {
    key: "menu_tagline",
    label: "Menu page tagline",
    hint: "Small line in the red Menu banner.",
  },
  {
    key: "contact_lead",
    label: "Contact page intro",
    hint: "Short note under “Pick up the phone.”",
    multiline: true,
  },
];

export function defaultContent(slug: LocationSlug): SiteContent {
  const copy = getCopy(slug);
  return {
    coming_heading: "Something is taking shape on Market Street.",
    coming_subheading:
      "We're building Chattanooga's home for high-end Asian fusion — wok-fired plates, sushi, spirits, and the long bamboo counter. The room is under construction — step inside the 3D render while we finish it.",
    coming_open_date: "February 1, 2027",
    coming_map_heading: "Find us on Market Street.",
    hero_heading: copy.hero.heading,
    hero_subheading: copy.hero.subheading,
    intro: copy.intro,
    about_shared: copy.about.shared,
    about_local: copy.about.local,
    visit_notes: copy.visitNotes,
    menu_tagline:
      slug === "chattanooga"
        ? "Dinner · plates from across Asia"
        : "Dinner · changes with the fish",
    contact_lead:
      "No reservation system, no forms — the fastest way to reach us is a call. We'll pick up between prep and service.",
  };
}

/** Defaults merged with any saved overrides. Never throws on a missing table
 * or network hiccup — the sites fall back to the file copy. */
export async function getSiteContent(slug: LocationSlug): Promise<SiteContent> {
  const content = defaultContent(slug);
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_copy")
      .select("key, value")
      .eq("location_slug", slug);
    for (const row of data ?? []) {
      if (row.key in content && row.value.trim() !== "") {
        content[row.key as keyof SiteContent] = row.value;
      }
    }
  } catch {}
  return content;
}
