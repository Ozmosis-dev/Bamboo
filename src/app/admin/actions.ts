"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function refreshAdmin() {
  revalidatePath("/admin", "layout");
}

/* ---------- auth ---------- */

export async function signIn(formData: FormData) {
  const supabase = await createAdminClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createAdminClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------- menu items ---------- */

const parsePrice = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : Number(s);
};

const parseText = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};

/** 'both' → null (all locations); otherwise a single-slug array. */
const parseLocations = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "both");
  return s === "both" ? null : [s];
};

export async function updateItem(formData: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase
    .from("menu_items")
    .update({
      name: String(formData.get("name")),
      description: parseText(formData.get("description")),
      price: parsePrice(formData.get("price")),
      price_note: parseText(formData.get("price_note")),
      dietary_tags: formData.getAll("dietary_tags").map(String),
      available: formData.get("available") === "on",
      location_slugs: parseLocations(formData.get("locations")),
      sort: Number(formData.get("sort") ?? 0),
    })
    .eq("id", String(formData.get("id")));
  if (error) throw error;
  refreshAdmin();
}

export async function addItem(formData: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase.from("menu_items").insert({
    category_id: String(formData.get("category_id")),
    name: String(formData.get("name")),
    price: parsePrice(formData.get("price")),
    sort: Number(formData.get("sort") ?? 99),
  });
  if (error) throw error;
  refreshAdmin();
}

export async function deleteItem(formData: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", String(formData.get("id")));
  if (error) throw error;
  refreshAdmin();
}

/* ---------- per-location overrides ---------- */

export async function saveOverride(formData: FormData) {
  const supabase = await requireUser();
  const availability = String(formData.get("available") ?? "inherit");
  const { error } = await supabase.from("menu_item_overrides").upsert(
    {
      item_id: String(formData.get("item_id")),
      location_slug: String(formData.get("location_slug")),
      price: parsePrice(formData.get("price")),
      price_note: parseText(formData.get("price_note")),
      available: availability === "inherit" ? null : availability === "yes",
    },
    { onConflict: "item_id,location_slug" }
  );
  if (error) throw error;
  refreshAdmin();
}

export async function clearOverride(formData: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase
    .from("menu_item_overrides")
    .delete()
    .eq("item_id", String(formData.get("item_id")))
    .eq("location_slug", String(formData.get("location_slug")));
  if (error) throw error;
  refreshAdmin();
}

/* ---------- categories ---------- */

export async function updateCategory(formData: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase
    .from("menu_categories")
    .update({
      name: String(formData.get("name")),
      sort: Number(formData.get("sort") ?? 0),
    })
    .eq("id", String(formData.get("id")));
  if (error) throw error;
  refreshAdmin();
}

/* ---------- locations ---------- */

export async function updateLocation(formData: FormData) {
  const supabase = await requireUser();

  // Hours arrive as parallel field arrays: days[] / open[] / close[].
  const days = formData.getAll("days").map(String);
  const opens = formData.getAll("open").map(String);
  const closes = formData.getAll("close").map(String);
  const hours = days
    .map((d, i) => ({ days: d, open: opens[i] ?? "", close: closes[i] ?? "" }))
    .filter((h) => h.days.trim() !== "");

  const { error } = await supabase
    .from("locations")
    .update({
      phone: String(formData.get("phone")),
      address_line1: String(formData.get("address_line1")),
      city: String(formData.get("city")),
      state: String(formData.get("state")),
      zip: String(formData.get("zip")),
      map_url: parseText(formData.get("map_url")),
      hours,
      social: {
        instagram: String(formData.get("instagram") ?? ""),
        facebook: String(formData.get("facebook") ?? ""),
      },
      announcement: parseText(formData.get("announcement")),
    })
    .eq("id", String(formData.get("id")));
  if (error) throw error;
  refreshAdmin();
}
