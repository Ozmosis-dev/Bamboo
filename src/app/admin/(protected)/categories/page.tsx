import { createAdminClient } from "@/lib/supabase/server";
import type { MenuCategory } from "@/lib/types";
import { updateCategory } from "../../actions";

export default async function AdminCategoriesPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from("menu_categories").select("*").order("sort");
  const categories = (data ?? []) as MenuCategory[];

  return (
    <>
      <h1 className="text-2xl font-semibold text-bamboo-800">Categories</h1>
      <p className="mt-1 text-sm text-ink-soft">Rename or re-order the four menu sections.</p>
      <ul className="mt-6 space-y-3">
        {categories.map((category) => (
          <li key={category.id} className="rounded border border-line bg-white p-3">
            <form action={updateCategory} className="flex items-end gap-3 text-sm">
              <input type="hidden" name="id" value={category.id} />
              <label className="text-xs">
                Sort
                <input
                  name="sort"
                  defaultValue={category.sort}
                  inputMode="numeric"
                  className="mt-0.5 block w-14 rounded border border-line px-2 py-1"
                />
              </label>
              <label className="grow text-xs">
                Name
                <input
                  name="name"
                  defaultValue={category.name}
                  required
                  className="mt-0.5 block w-full max-w-xs rounded border border-line px-2 py-1"
                />
              </label>
              <button
                type="submit"
                className="rounded bg-bamboo-700 px-3 py-1.5 text-xs font-medium text-white"
              >
                Save
              </button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
