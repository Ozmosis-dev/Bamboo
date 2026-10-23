import { createAdminClient } from "@/lib/supabase/server";
import { CONTENT_FIELDS, defaultContent, type SiteContent } from "@/lib/content";
import type { LocationSlug } from "@/lib/types";
import { saveCopy } from "../../actions";

export const dynamic = "force-dynamic";

const LOCATIONS: { slug: LocationSlug; label: string }[] = [
  { slug: "chattanooga", label: "Bamboo on Market — Chattanooga" },
  { slug: "birmingham", label: "Bamboo on 2nd — Birmingham" },
];

function LocationEditor({
  slug,
  label,
  saved,
}: {
  slug: LocationSlug;
  label: string;
  saved: Record<string, string>;
}) {
  const defaults = defaultContent(slug);
  return (
    <section className="a-card mt-8 p-6">
      <p className="a-eyebrow">{label}</p>
      <form action={saveCopy} className="mt-5 space-y-5">
        <input type="hidden" name="location_slug" value={slug} />
        {CONTENT_FIELDS.map((field) => {
          const value =
            saved[field.key] ?? defaults[field.key as keyof SiteContent];
          return (
            <label key={field.key} className="block">
              <input type="hidden" name="key" value={field.key} />
              <span className="block text-sm font-semibold">{field.label}</span>
              <span className="mt-0.5 block text-xs text-ink-soft">{field.hint}</span>
              {field.multiline ? (
                <textarea
                  name={`value_${field.key}`}
                  defaultValue={value}
                  rows={3}
                  className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm leading-relaxed"
                />
              ) : (
                <input
                  name={`value_${field.key}`}
                  defaultValue={value}
                  className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
                />
              )}
            </label>
          );
        })}
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <p className="text-xs text-ink-soft">
            Clearing a field brings back the original wording. Changes reach the
            site within about 5 minutes.
          </p>
          <button
            type="submit"
            className="rounded-md bg-bamboo-700 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}

export default async function ContentPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from("site_copy").select("location_slug, key, value");
  const savedBySlug: Record<string, Record<string, string>> = {};
  for (const row of data ?? []) {
    (savedBySlug[row.location_slug] ??= {})[row.key] = row.value;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Page content</h1>
      <p className="mt-1 text-sm text-ink-soft">
        The written words on the website — headlines, paragraphs, and small
        lines — ready to edit in place.
      </p>
      {LOCATIONS.map((loc) => (
        <LocationEditor
          key={loc.slug}
          slug={loc.slug}
          label={loc.label}
          saved={savedBySlug[loc.slug] ?? {}}
        />
      ))}
    </>
  );
}
