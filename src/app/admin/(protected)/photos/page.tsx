import { createAdminClient } from "@/lib/supabase/server";
import { IMAGE_SLOTS } from "@/lib/images";
import {
  addGalleryImage,
  deleteGalleryImage,
  replaceGalleryImage,
  resetSlotImage,
  updateGalleryImage,
  uploadSlotImage,
} from "../../actions";

export const dynamic = "force-dynamic";

type ImageRow = { id: string; key: string; url: string; alt: string; sort: number };

function SlotCard({ slot, row }: { slot: (typeof IMAGE_SLOTS)[number]; row?: ImageRow }) {
  const current = row?.url ?? slot.fallback;
  return (
    <div className="a-card overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={current} alt="" className="h-40 w-full object-cover" />
      <div className="p-4">
        <p className="text-sm font-semibold">{slot.label}</p>
        <p className="mt-0.5 text-xs text-ink-soft">{slot.hint}</p>
        <form action={uploadSlotImage} className="mt-3 flex items-center gap-2">
          <input type="hidden" name="key" value={slot.key} />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="min-w-0 flex-1 text-xs file:mr-2 file:rounded-md file:border file:border-line file:bg-white file:px-2.5 file:py-1.5 file:text-xs file:font-medium"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-bamboo-700 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
          >
            Replace
          </button>
        </form>
        {row && (
          <form action={resetSlotImage} className="mt-2">
            <input type="hidden" name="key" value={slot.key} />
            <button type="submit" className="text-xs text-ink-soft underline hover:text-ink">
              Reset to original photo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default async function PhotosPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from("site_images").select("*").order("sort");
  const rows = (data ?? []) as ImageRow[];
  const slotRows = Object.fromEntries(
    rows.filter((r) => r.key !== "gallery").map((r) => [r.key, r])
  );
  const gallery = rows.filter((r) => r.key === "gallery");

  return (
    <>
      <h1 className="text-2xl font-semibold">Photos</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Swap the site&apos;s photos. Uploads go live within about 5 minutes —
        bright, sharp, landscape photos work best.
      </p>

      <h2 className="a-eyebrow mt-9">Page photos</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {IMAGE_SLOTS.map((slot) => (
          <SlotCard key={slot.key} slot={slot} row={slotRows[slot.key]} />
        ))}
      </div>

      <h2 className="a-eyebrow mt-12">Food photo banner</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Every photo in the scrolling strip on the homepage and Contact page, in
        order. Replace or remove any of them, or add more to make the banner
        longer.
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((img) => (
          <div key={img.id} className="a-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-36 w-full object-cover" />
            <div className="p-3">
              <form action={updateGalleryImage} className="flex items-end gap-2">
                <input type="hidden" name="id" value={img.id} />
                <label className="min-w-0 flex-1 text-xs">
                  Description
                  <input
                    name="alt"
                    defaultValue={img.alt}
                    placeholder="e.g. Rainbow roll"
                    className="mt-1 w-full rounded-md border border-line px-2 py-1.5"
                  />
                </label>
                <label className="w-14 text-xs">
                  Order
                  <input
                    name="sort"
                    defaultValue={img.sort}
                    inputMode="numeric"
                    className="mt-1 w-full rounded-md border border-line px-2 py-1.5"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-md border border-line px-2.5 py-1.5 text-xs font-medium hover:border-bamboo-600"
                >
                  Save
                </button>
              </form>
              <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-line pt-2.5">
                <form action={replaceGalleryImage} className="flex min-w-0 items-center gap-1.5">
                  <input type="hidden" name="id" value={img.id} />
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    required
                    className="min-w-0 flex-1 text-[11px] file:mr-1.5 file:rounded file:border file:border-line file:bg-white file:px-2 file:py-1 file:text-[11px] file:font-medium"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-md border border-line px-2 py-1 text-[11px] font-medium hover:border-bamboo-600"
                  >
                    Replace
                  </button>
                </form>
                <form action={deleteGalleryImage} className="shrink-0">
                  <input type="hidden" name="id" value={img.id} />
                  <button type="submit" className="text-xs text-bamboo-700 underline">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        <div className="a-card flex flex-col justify-center border-dashed p-4">
          <p className="text-sm font-semibold">Add a dish photo</p>
          <form action={addGalleryImage} className="mt-3 space-y-2.5">
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="w-full text-xs file:mr-2 file:rounded-md file:border file:border-line file:bg-white file:px-2.5 file:py-1.5 file:text-xs file:font-medium"
            />
            <input
              name="alt"
              placeholder="Short description (for accessibility)"
              className="w-full rounded-md border border-line px-2 py-1.5 text-xs"
            />
            <button
              type="submit"
              className="rounded-md bg-bamboo-700 px-3.5 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              Upload & add
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
