import { createAdminClient } from "@/lib/supabase/server";
import type { Location } from "@/lib/types";
import { updateLocation } from "../../actions";

function Field({
  label,
  name,
  defaultValue,
  width = "w-full",
}: {
  label: string;
  name: string;
  defaultValue: string;
  width?: string;
}) {
  return (
    <label className="block text-xs">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        className={`mt-0.5 block ${width} rounded border border-line px-2 py-1 text-sm`}
      />
    </label>
  );
}

export default async function AdminLocationsPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from("locations").select("*").order("slug");
  const locations = (data ?? []) as Location[];

  return (
    <>
      <h1 className="text-2xl font-semibold text-bamboo-800">Location details</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {locations.map((location) => (
          <form
            key={location.id}
            action={updateLocation}
            className="rounded border border-line bg-white p-4"
          >
            <input type="hidden" name="id" value={location.id} />
            <h2 className="text-lg font-semibold">{location.name}</h2>

            <div className="mt-3 space-y-3">
              <Field label="Phone" name="phone" defaultValue={location.phone} width="w-44" />
              <Field label="Address" name="address_line1" defaultValue={location.address_line1} />
              <div className="flex gap-2">
                <Field label="City" name="city" defaultValue={location.city} width="w-36" />
                <Field label="State" name="state" defaultValue={location.state} width="w-14" />
                <Field label="Zip" name="zip" defaultValue={location.zip} width="w-20" />
              </div>
              <Field label="Google Maps URL" name="map_url" defaultValue={location.map_url ?? ""} />
              <Field label="Instagram URL" name="instagram" defaultValue={location.social.instagram ?? ""} />
              <Field label="Facebook URL" name="facebook" defaultValue={location.social.facebook ?? ""} />

              <fieldset>
                <legend className="text-xs font-semibold">Hours</legend>
                <p className="text-xs text-ink-soft">
                  Days label, then open/close in 24h time (or the word
                  &ldquo;closed&rdquo;). Blank day rows are dropped.
                </p>
                <div className="mt-1 space-y-1.5">
                  {[...location.hours, { days: "", open: "", close: "" }].map(
                    (entry, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          name="days"
                          defaultValue={entry.days}
                          placeholder="Mon–Thu"
                          className="w-28 rounded border border-line px-2 py-1 text-sm"
                        />
                        <input
                          name="open"
                          defaultValue={entry.open}
                          placeholder="11:00"
                          className="w-20 rounded border border-line px-2 py-1 text-sm"
                        />
                        <input
                          name="close"
                          defaultValue={entry.close}
                          placeholder="21:00"
                          className="w-20 rounded border border-line px-2 py-1 text-sm"
                        />
                      </div>
                    )
                  )}
                </div>
              </fieldset>

              <label className="block text-xs">
                Announcement banner (blank = hidden)
                <textarea
                  name="announcement"
                  defaultValue={location.announcement ?? ""}
                  rows={2}
                  className="mt-0.5 block w-full rounded border border-line px-2 py-1 text-sm"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 rounded bg-bamboo-700 px-4 py-1.5 text-sm font-medium text-white"
            >
              Save {location.name}
            </button>
          </form>
        ))}
      </div>
    </>
  );
}
