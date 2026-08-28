import { describe, expect, it } from "vitest";
import { resolveItem, resolveMenu, servedAtLocation } from "./menu";
import type { MenuCategory, MenuItem, MenuItemOverride } from "./types";

const cat = (id: string, sort: number): MenuCategory => ({
  id,
  name: id,
  slug: id,
  sort,
});

const item = (overrides: Partial<MenuItem> & { id: string }): MenuItem => ({
  category_id: "sushi",
  name: overrides.id,
  description: null,
  price: 10,
  price_note: null,
  dietary_tags: [],
  available: true,
  location_slugs: null,
  sort: 0,
  ...overrides,
});

const override = (
  overrides: Partial<MenuItemOverride> & { item_id: string }
): MenuItemOverride => ({
  id: `ov-${overrides.item_id}`,
  location_slug: "birmingham",
  price: null,
  price_note: null,
  available: null,
  ...overrides,
});

describe("servedAtLocation", () => {
  it("null location_slugs means served everywhere", () => {
    expect(servedAtLocation(item({ id: "a" }), "birmingham")).toBe(true);
    expect(servedAtLocation(item({ id: "a" }), "chattanooga")).toBe(true);
  });

  it("non-null location_slugs limits the item", () => {
    const exclusive = item({ id: "a", location_slugs: ["chattanooga"] });
    expect(servedAtLocation(exclusive, "chattanooga")).toBe(true);
    expect(servedAtLocation(exclusive, "birmingham")).toBe(false);
  });
});

describe("resolveItem", () => {
  it("uses base values when no override exists", () => {
    const resolved = resolveItem(
      item({ id: "a", price: 12, price_note: "6 pc" }),
      undefined
    );
    expect(resolved.price).toBe(12);
    expect(resolved.price_note).toBe("6 pc");
    expect(resolved.available).toBe(true);
  });

  it("override fields win only when set", () => {
    const resolved = resolveItem(
      item({ id: "a", price: 12, price_note: "6 pc", available: true }),
      override({ item_id: "a", price: 14 })
    );
    expect(resolved.price).toBe(14);
    expect(resolved.price_note).toBe("6 pc"); // null override falls through
    expect(resolved.available).toBe(true);
  });

  it("override can disable availability per location", () => {
    const resolved = resolveItem(
      item({ id: "a" }),
      override({ item_id: "a", available: false })
    );
    expect(resolved.available).toBe(false);
  });

  it("null base price with MP note passes through", () => {
    const resolved = resolveItem(
      item({ id: "a", price: null, price_note: "MP" }),
      undefined
    );
    expect(resolved.price).toBeNull();
    expect(resolved.price_note).toBe("MP");
  });
});

describe("resolveMenu", () => {
  const categories = [cat("hot", 2), cat("sushi", 1)];
  const items = [
    item({ id: "roll", category_id: "sushi", sort: 2 }),
    item({ id: "nigiri", category_id: "sushi", sort: 1 }),
    item({
      id: "cha-only",
      category_id: "sushi",
      sort: 3,
      location_slugs: ["chattanooga"],
    }),
    item({ id: "eightysixed", category_id: "sushi", sort: 4, available: false }),
    item({ id: "ramen", category_id: "hot", sort: 1, price: 15 }),
  ];
  const overrides = [
    override({ item_id: "ramen", location_slug: "birmingham", price: 16 }),
    override({ item_id: "roll", location_slug: "chattanooga", available: false }),
  ];

  it("sorts categories and items, excludes unavailable and other-location items", () => {
    const menu = resolveMenu(categories, items, overrides, "birmingham");
    expect(menu.map((s) => s.category.id)).toEqual(["sushi", "hot"]);
    expect(menu[0].items.map((i) => i.id)).toEqual(["nigiri", "roll"]);
  });

  it("applies overrides only for the requested location", () => {
    const bhm = resolveMenu(categories, items, overrides, "birmingham");
    const cha = resolveMenu(categories, items, overrides, "chattanooga");
    const ramenBhm = bhm.find((s) => s.category.id === "hot")!.items[0];
    const ramenCha = cha.find((s) => s.category.id === "hot")!.items[0];
    expect(ramenBhm.price).toBe(16);
    expect(ramenCha.price).toBe(15);
  });

  it("availability override hides the item at that location only", () => {
    const bhm = resolveMenu(categories, items, overrides, "birmingham");
    const cha = resolveMenu(categories, items, overrides, "chattanooga");
    expect(bhm[0].items.some((i) => i.id === "roll")).toBe(true);
    expect(cha[0].items.some((i) => i.id === "roll")).toBe(false);
  });

  it("location-exclusive item shows only at its location", () => {
    const bhm = resolveMenu(categories, items, overrides, "birmingham");
    const cha = resolveMenu(categories, items, overrides, "chattanooga");
    expect(bhm[0].items.some((i) => i.id === "cha-only")).toBe(false);
    expect(cha[0].items.some((i) => i.id === "cha-only")).toBe(true);
  });

  it("drops empty categories", () => {
    const menu = resolveMenu([cat("empty", 3), ...categories], items, [], "birmingham");
    expect(menu.some((s) => s.category.id === "empty")).toBe(false);
  });
});
