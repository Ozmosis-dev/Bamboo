import { createAdminClient } from "@/lib/supabase/server";
import type {
  DietaryTag,
  MenuCategory,
  MenuItem,
  MenuItemOverride,
} from "@/lib/types";
import {
  addItem,
  clearOverride,
  deleteItem,
  saveOverride,
  updateItem,
} from "../actions";

const DIETARY: DietaryTag[] = ["gluten-free", "vegetarian", "vegan", "spicy"];
const LOCATIONS = ["birmingham", "chattanooga"] as const;
const LOCATION_LABEL = { birmingham: "Birmingham", chattanooga: "Chattanooga" };

function locationValue(item: MenuItem): string {
  if (item.location_slugs === null) return "both";
  return item.location_slugs[0] ?? "both";
}

function OverrideEditor({
  item,
  overrides,
}: {
  item: MenuItem;
  overrides: MenuItemOverride[];
}) {
  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-xs text-ink-soft hover:text-ink">
        Per-location pricing
        {overrides.length > 0 && (
          <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-800">
            {overrides.map((o) => LOCATION_LABEL[o.location_slug as "birmingham"]).join(", ")}
          </span>
        )}
      </summary>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {LOCATIONS.map((slug) => {
          const existing = overrides.find((o) => o.location_slug === slug);
          return (
            <div key={slug} className="rounded border border-line p-3">
              <p className="text-xs font-semibold">{LOCATION_LABEL[slug]}</p>
              <form action={saveOverride} className="mt-2 flex flex-wrap items-end gap-2 text-xs">
                <input type="hidden" name="item_id" value={item.id} />
                <input type="hidden" name="location_slug" value={slug} />
                <label>
                  Price
                  <input
                    name="price"
                    defaultValue={existing?.price ?? ""}
                    inputMode="decimal"
                    className="mt-0.5 block w-20 rounded border border-line px-2 py-1"
                  />
                </label>
                <label>
                  Note
                  <input
                    name="price_note"
                    defaultValue={existing?.price_note ?? ""}
                    className="mt-0.5 block w-20 rounded border border-line px-2 py-1"
                  />
                </label>
                <label>
                  Available
                  <select
                    name="available"
                    defaultValue={
                      existing?.available === null || existing === undefined
                        ? "inherit"
                        : existing.available
                          ? "yes"
                          : "no"
                    }
                    className="mt-0.5 block rounded border border-line px-2 py-1"
                  >
                    <option value="inherit">Same as base</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="rounded bg-bamboo-700 px-2.5 py-1 font-medium text-white"
                >
                  Save
                </button>
              </form>
              {existing && (
                <form action={clearOverride} className="mt-1.5">
                  <input type="hidden" name="item_id" value={item.id} />
                  <input type="hidden" name="location_slug" value={slug} />
                  <button type="submit" className="text-xs text-red-700 underline">
                    Clear override
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </details>
  );
}

function ItemRow({
  item,
  overrides,
}: {
  item: MenuItem;
  overrides: MenuItemOverride[];
}) {
  return (
    <li className="rounded border border-line bg-white p-3">
      <form action={updateItem} className="flex flex-wrap items-end gap-2 text-sm">
        <input type="hidden" name="id" value={item.id} />
        <label className="text-xs">
          Sort
          <input
            name="sort"
            defaultValue={item.sort}
            inputMode="numeric"
            className="mt-0.5 block w-12 rounded border border-line px-2 py-1"
          />
        </label>
        <label className="grow text-xs">
          Name
          <input
            name="name"
            defaultValue={item.name}
            required
            className="mt-0.5 block w-full rounded border border-line px-2 py-1"
          />
        </label>
        <label className="w-full text-xs sm:w-auto sm:grow-2">
          Description
          <input
            name="description"
            defaultValue={item.description ?? ""}
            className="mt-0.5 block w-full rounded border border-line px-2 py-1"
          />
        </label>
        <label className="text-xs">
          Price
          <input
            name="price"
            defaultValue={item.price ?? ""}
            inputMode="decimal"
            className="mt-0.5 block w-16 rounded border border-line px-2 py-1"
          />
        </label>
        <label className="text-xs">
          Note
          <input
            name="price_note"
            defaultValue={item.price_note ?? ""}
            className="mt-0.5 block w-16 rounded border border-line px-2 py-1"
          />
        </label>
        <label className="text-xs">
          Locations
          <select
            name="locations"
            defaultValue={locationValue(item)}
            className="mt-0.5 block rounded border border-line px-2 py-1"
          >
            <option value="both">Both</option>
            <option value="birmingham">Birmingham only</option>
            <option value="chattanooga">Chattanooga only</option>
          </select>
        </label>
        <fieldset className="text-xs">
          <legend className="sr-only">Dietary tags</legend>
          <div className="flex gap-2 pb-1">
            {DIETARY.map((tag) => (
              <label key={tag} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="dietary_tags"
                  value={tag}
                  defaultChecked={item.dietary_tags.includes(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-1 pb-1 text-xs font-medium">
          <input type="checkbox" name="available" defaultChecked={item.available} />
          Available
        </label>
        <button
          type="submit"
          className="rounded bg-bamboo-700 px-3 py-1.5 text-xs font-medium text-white"
        >
          Save
        </button>
      </form>
      <div className="mt-1 flex items-center justify-between">
        <OverrideEditor item={item} overrides={overrides} />
        <form action={deleteItem}>
          <input type="hidden" name="id" value={item.id} />
          <button type="submit" className="text-xs text-red-700 underline">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}

export default async function AdminMenuPage() {
  const supabase = await createAdminClient();
  const [categoriesRes, itemsRes, overridesRes] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort"),
    supabase.from("menu_items").select("*").order("sort"),
    supabase.from("menu_item_overrides").select("*"),
  ]);
  const categories = (categoriesRes.data ?? []) as MenuCategory[];
  const items = (itemsRes.data ?? []) as MenuItem[];
  const overrides = (overridesRes.data ?? []) as MenuItemOverride[];

  return (
    <>
      <h1 className="text-2xl font-semibold text-bamboo-800">Menu items</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Edits go live on both sites within about 5 minutes.
      </p>
      {categories.map((category) => (
        <section key={category.id} className="mt-8">
          <h2 className="text-lg font-semibold">{category.name}</h2>
          <ul className="mt-3 space-y-3">
            {items
              .filter((i) => i.category_id === category.id)
              .map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  overrides={overrides.filter((o) => o.item_id === item.id)}
                />
              ))}
          </ul>
          <form action={addItem} className="mt-3 flex items-end gap-2 text-sm">
            <input type="hidden" name="category_id" value={category.id} />
            <label className="text-xs">
              New item name
              <input
                name="name"
                required
                className="mt-0.5 block w-56 rounded border border-line px-2 py-1"
              />
            </label>
            <label className="text-xs">
              Price
              <input
                name="price"
                inputMode="decimal"
                className="mt-0.5 block w-20 rounded border border-line px-2 py-1"
              />
            </label>
            <button
              type="submit"
              className="rounded border border-bamboo-700 px-3 py-1.5 text-xs font-medium text-bamboo-700"
            >
              Add item
            </button>
          </form>
        </section>
      ))}
    </>
  );
}
