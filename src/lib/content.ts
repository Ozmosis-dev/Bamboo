import { getCopy } from "@content/index";
import { createPublicClient } from "@/lib/supabase/public";
import type { LocationSlug } from "@/lib/types";

/** Every owner-editable text on the site, keyed for the CMS. The file copy in
 * content/ provides the defaults; a site_copy row overrides per location. */
export type SiteContent = {
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
    hero_heading: copy.hero.heading,
    hero_subheading: copy.hero.subheading,
    intro: copy.intro,
    about_shared: copy.about.shared,
    about_local: copy.about.local,
    visit_notes: copy.visitNotes,
    menu_tagline: "Dinner · changes with the fish",
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
