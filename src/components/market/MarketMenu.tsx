"use client";

import { useEffect, useMemo, useState } from "react";
import type { DietaryTag, ResolvedMenuSection } from "@/lib/types";
import { MarketFx, scrollToId } from "./MarketFx";
import { DRINK_GROUPS, FOOD_SLUGS, SECTION_KANJI } from "./kanji";

type Item = ResolvedMenuSection["items"][number];

const FILTERS: { tag: DietaryTag; label: string }[] = [
  { tag: "gluten-free", label: "Gluten-free" },
  { tag: "vegetarian", label: "Vegetarian" },
  { tag: "vegan", label: "Vegan" },
];

const TAG_LABELS: Record<DietaryTag, string> = {
  "gluten-free": "GF",
  vegetarian: "V",
  vegan: "VG",
  spicy: "辛",
};

/** Menu prices print like the physical menus: whole dollars drop cents. */
function dollars(price: number) {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

/** House favorites carry the printed menu's red 好 badge. */
const FAVORITES = new Set(["Magic City", "Choo Choo"]);

/** The kitchen half of the printed menu, exactly as laid out in print: section
 * titles and item order. Items are looked up by name in the CMS data; anything
 * the CMS adds that print doesn't know yet is appended to its home section. */
const KITCHEN_LAYOUT: {
  id: string;
  title: string;
  kanji?: string;
  homeSlug: string;
  inline?: boolean;
  names: string[];
}[] = [
  {
    id: "starters",
    title: "Starters",
    homeSlug: "share",
    names: [
      "Grilled Edamame",
      "Tempura Green Beans or Eggplant",
      "Flash-Fried Calamari",
      "Miso Soup",
      "Lumpia",
      "Momos",
    ],
  },
  {
    id: "skewers",
    title: "Skewers",
    kanji: "串",
    homeSlug: "skewers",
    inline: true,
    names: [
      "Lemongrass Chicken",
      "Korean BBQ Chicken",
      "Marinated Beef",
      "Grilled Salmon",
      "Korean BBQ Shrimp",
      "Pork Belly Adobo",
    ],
  },
  {
    id: "salads",
    title: "Salads",
    kanji: "菜",
    homeSlug: "salads",
    names: [
      "Maguro",
      "Thai",
      "Spicy Caesar",
      "Seared Asian Salmon",
      "Seaweed",
      "Kimchi",
    ],
  },
  {
    id: "bowls-plates",
    title: "Bowls & Plates",
    kanji: "麺",
    homeSlug: "noodle-bowls",
    names: [
      "Maa Bowl",
      "Ramen",
      "Thukpa",
      "Vegetarian Thukpa",
      "Spicy Miso",
      "Pad Kra Pao",
      "PBR",
      "Slow-Roasted Baby Back Ribs",
      "Char Siu Bao",
      "Poké",
    ],
  },
];

/** The kitchen categories the layout above draws from. */
const KITCHEN_SLUGS = ["share", "skewers", "salads", "noodle-bowls"];

const SUSHI_ID = "sushi";
const DINNER_IDS = [SUSHI_ID, "rolls", ...KITCHEN_LAYOUT.map((s) => s.id)];

/** Centered print-style section header between hairline rules. */
function SectionHeader({ title, kanji }: { title: string; kanji?: string }) {
  return (
    <header className="flex items-center gap-4 sm:gap-6">
      <span aria-hidden className="h-px min-w-6 flex-1 bg-gold/30" />
      <h2 className="m-caps text-center text-[14px] !tracking-[0.42em] text-gold-soft sm:text-[16px]">
        {title}
      </h2>
      {kanji && (
        <span aria-hidden className="m-kanji text-[13px] text-gold/70">
          {kanji}
        </span>
      )}
      <span aria-hidden className="h-px min-w-6 flex-1 bg-gold/30" />
    </header>
  );
}

/** One item in the printed style: name with the red price beside it. With
 * `inline`, the description runs on the same line (the skewer rows). */
function ItemLine({ item, inline }: { item: Item; inline?: boolean }) {
  const price =
    item.price !== null ? (
      <span className="m-price text-[13.5px]">{dollars(item.price)}</span>
    ) : item.price_note?.includes("$") ? (
      /* "Salmon $16 · Tuna $18" style notes print red, like prices */
      <span className="m-price text-[13px]">{item.price_note}</span>
    ) : null;

  return (
    <li className="break-inside-avoid py-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="m-item-name text-[13px]">
          {FAVORITES.has(item.name) && (
            <span
              title="House favorite"
              className="m-kanji mr-2 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-verm align-[-3px] text-[10.5px] leading-none text-washi"
            >
              好
            </span>
          )}
          {item.name}
          {item.dietary_tags.includes("spicy") && (
            <span
              title="spicy"
              className="m-kanji ml-2 align-middle text-[12px] font-normal text-price"
            >
              辛
            </span>
          )}
          {item.dietary_tags
            .filter((tag) => tag !== "spicy")
            .map((tag) => (
              <span
                key={tag}
                title={tag}
                className="ml-2 inline-block border border-seam px-1.5 py-0.5 align-middle text-[9px] font-semibold tracking-widest text-gold-soft"
              >
                {TAG_LABELS[tag]}
              </span>
            ))}
        </h3>
        {inline && item.description && (
          <span className="text-[12.5px] text-tatami">· {item.description}</span>
        )}
        {price}
        {item.price !== null && item.price_note && (
          <span className="text-[12px] text-tatami">· {item.price_note}</span>
        )}
      </div>
      {!inline && item.description && (
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-tatami">
          {item.description}
        </p>
      )}
    </li>
  );
}

/** Menu browser matching the printed menu's layout: sushi page first (The
 * Flight banner, tataki pair, sashimi/nigiri box, rolls), then the kitchen
 * page (Starters, Skewers, Salads, Bowls & Plates), then the bar. Navigation
 * stays: sticky rail (desktop), Dinner–Drinks tabs (mobile), dietary filters. */
export function MarketMenu({ menu }: { menu: ResolvedMenuSection[] }) {
  const [active, setActive] = useState<DietaryTag[]>([]);
  const [current, setCurrent] = useState<string>(SUSHI_ID);
  const [groupOverride, setGroupOverride] = useState<{
    group: "dinner" | "drinks";
    at: string;
  } | null>(null);

  const toggle = (tag: DietaryTag) =>
    setActive((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]
    );

  const matches = (item: Item) =>
    active.every((t) => item.dietary_tags.includes(t));

  /* ---------------- compose the print layout from the CMS data ---------- */
  const layout = useMemo(() => {
    const bySlug = new Map(menu.map((s) => [s.category.slug, s]));

    const sashimiAll = bySlug.get("sashimi")?.items ?? [];
    const nigiri = bySlug.get("nigiri")?.items ?? [];
    const rolls = bySlug.get("rolls")?.items ?? [];

    /* described sashimi items (The Flight) become the page-top banner */
    const banners = sashimiAll.filter((i) => i.description);
    const sashimi = sashimiAll.filter((i) => !i.description);

    /* kitchen items by name, remembering their home category */
    const kitchen = new Map<string, { item: Item; slug: string }>();
    for (const slug of KITCHEN_SLUGS) {
      for (const item of bySlug.get(slug)?.items ?? []) {
        if (!kitchen.has(item.name)) kitchen.set(item.name, { item, slug });
      }
    }
    const used = new Set<string>();
    const take = (name: string) => {
      const entry = kitchen.get(name);
      if (entry) used.add(name);
      return entry?.item;
    };

    const pair = ["Tuna Tataki", "Tuna Ponzu"]
      .map(take)
      .filter((i): i is Item => Boolean(i));

    /* the add-on footnote strip at the foot of Bowls & Plates */
    const addOn = [...kitchen.values()].find(
      ({ item }) => item.price === null && item.name.startsWith("Add to")
    );
    if (addOn) used.add(addOn.item.name);

    const sections = KITCHEN_LAYOUT.map((spec) => ({
      ...spec,
      items: spec.names.map(take).filter((i): i is Item => Boolean(i)),
    }));
    /* CMS items print doesn't know yet tag onto their home section */
    for (const [name, { item, slug }] of kitchen) {
      if (used.has(name)) continue;
      const home =
        sections.find((s) => s.homeSlug === slug) ??
        sections[sections.length - 1];
      home.items.push(item);
    }

    const drinks = [
      ...DRINK_GROUPS.flatMap((g) =>
        g.slugs.flatMap((slug) => menu.filter((s) => s.category.slug === slug))
      ),
      ...menu.filter(
        (s) =>
          !FOOD_SLUGS.includes(s.category.slug) &&
          !DRINK_GROUPS.some((g) => g.slugs.includes(s.category.slug))
      ),
    ];

    return { banners, pair, sashimi, nigiri, rolls, sections, addOn, drinks };
  }, [menu]);

  const drinkIds = layout.drinks.map((s) => s.category.slug);
  const navIds = [...DINNER_IDS, ...drinkIds];

  /* ---------------- scroll tracking --------------------------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    for (const id of navIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navIds.join("|")]);

  const autoGroup = DINNER_IDS.includes(current) ? "dinner" : "drinks";
  const group =
    groupOverride && groupOverride.at === current ? groupOverride.group : autoGroup;

  const onJump = (slug: string, offsetY: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(slug, offsetY);
  };

  const dinnerNav: { id: string; label: string }[] = [
    { id: SUSHI_ID, label: "Sashimi & Nigiri" },
    { id: "rolls", label: "Rolls" },
    ...layout.sections.map((s) => ({ id: s.id, label: s.title })),
  ];
  const drinkNav = layout.drinks.map((s) => ({
    id: s.category.slug,
    label: s.category.name,
  }));
  const groupNav = group === "dinner" ? dinnerNav : drinkNav;

  /** Divider band to render before a drink section: the group it opens. */
  const bandFor = (slug: string) =>
    DRINK_GROUPS.find((g) => g.slugs[0] === slug);

  const sashimiVisible = layout.sashimi.filter(matches);
  const nigiriVisible = layout.nigiri.filter(matches);
  const rollsVisible = layout.rolls.filter(matches);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <MarketFx />

      {/* Mobile category panel: Dinner / Drinks tabs over that group's chips */}
      <nav
        aria-label="Menu categories"
        className="sticky top-[70px] z-30 -mx-5 border-b border-seam bg-char/95 px-5 pb-3 pt-3 backdrop-blur-md lg:hidden"
      >
        <div className="flex gap-1.5" role="tablist" aria-label="Menu halves">
          {(
            [
              ["dinner", "Dinner", "食"],
              ["drinks", "Drinks", "飲"],
            ] as const
          ).map(([key, label, glyph]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={group === key}
              onClick={() => setGroupOverride({ group: key, at: current })}
              className={`m-caps flex flex-1 items-center justify-center gap-2 border py-2.5 text-[11.5px] transition-colors ${
                group === key
                  ? "border-verm bg-verm text-washi"
                  : "border-seam text-tatami"
              }`}
            >
              {label}
              <span className="m-kanji text-[11px] font-normal opacity-80">{glyph}</span>
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {groupNav.length === 0 && (
            <p className="m-caps px-1 py-1.5 text-[10.5px] text-tatami">
              Coming soon
            </p>
          )}
          {groupNav.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={onJump(id, 205)}
              aria-current={current === id ? "true" : undefined}
              className={`m-caps whitespace-nowrap border px-3 py-1.5 text-[10.5px] transition-colors ${
                current === id
                  ? "border-gold bg-gold/15 text-gold-soft"
                  : "border-seam text-tatami"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-16">
        {/* Desktop rail */}
        <aside className="hidden pt-8 lg:block">
          <div className="sticky top-28">
            <nav aria-label="Menu categories">
              {(
                [
                  ["Food", "食", dinnerNav],
                  ["Drinks", "飲", drinkNav],
                ] as const
              ).map(([label, glyph, entries], gi) => (
                <div key={label} className={gi > 0 ? "mt-8 border-t border-seam pt-6" : ""}>
                  <p className="m-eyebrow flex items-baseline gap-2 !text-[0.65rem]">
                    {label}
                    <span className="m-kanji font-normal text-gold/80">{glyph}</span>
                  </p>
                  {entries.length === 0 && (
                    <p className="m-caps mt-3 text-[11px] text-tatami">
                      Coming soon
                    </p>
                  )}
                  <ul className="mt-3">
                    {entries.map(({ id, label: name }) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          onClick={onJump(id, 120)}
                          aria-current={current === id ? "true" : undefined}
                          className={`m-caps group relative block py-[5px] pl-8 text-[12px] leading-tight transition-colors ${
                            current === id ? "text-washi" : "text-tatami hover:text-washi"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`absolute left-0 top-1/2 h-px -translate-y-1/2 bg-verm transition-all duration-300 ${
                              current === id
                                ? "w-5"
                                : "w-0 group-hover:w-3 group-hover:bg-gold"
                            }`}
                          />
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="mt-8 border-t border-seam pt-6">
              <p className="m-eyebrow !text-[0.65rem]">Dietary</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {FILTERS.map(({ tag, label }) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={active.includes(tag)}
                    onClick={() => toggle(tag)}
                    className={`m-caps border px-3 py-1.5 text-[10.5px] transition-colors ${
                      active.includes(tag)
                        ? "border-gold bg-gold/15 text-gold-soft"
                        : "border-seam text-tatami hover:border-gold/60"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Sections */}
        <div className="min-w-0">
          {/* Mobile filters */}
          <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
            {FILTERS.map(({ tag, label }) => (
              <button
                key={tag}
                type="button"
                aria-pressed={active.includes(tag)}
                onClick={() => toggle(tag)}
                className={`m-caps border px-3 py-1.5 text-[10.5px] transition-colors ${
                  active.includes(tag)
                    ? "border-gold bg-gold/15 text-gold-soft"
                    : "border-seam text-tatami"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ------------------------- sushi page ---------------------------- */}
          <section id={SUSHI_ID} className="scroll-mt-44 pt-10 lg:scroll-mt-32">
            {/* The Flight banner, as printed: gold name, description, red ring */}
            {layout.banners.filter(matches).map((item) => (
              <div
                key={item.id}
                className="border border-seam bg-char-deep/50 px-5 py-5 sm:px-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                  <h3 className="m-serif shrink-0 text-2xl uppercase !tracking-[0.22em] text-gold-soft sm:text-3xl">
                    {item.name}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-tatami">
                    {item.description}
                  </p>
                  {item.price !== null && (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-full border border-price sm:self-center">
                      <span className="m-price text-[15px]">{dollars(item.price)}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Tuna Tataki · Tuna Ponzu pair */}
            {layout.pair.filter(matches).length > 0 && (
              <ul className="mt-2 grid grid-cols-1 gap-x-16 sm:grid-cols-2">
                {layout.pair.filter(matches).map((item) => (
                  <ItemLine key={item.id} item={item} />
                ))}
              </ul>
            )}

            {/* Sashimi | Nigiri in one bordered box, as printed */}
            {(sashimiVisible.length > 0 || nigiriVisible.length > 0) && (
              <div className="mt-6 grid grid-cols-1 gap-x-14 border border-seam px-6 py-5 sm:grid-cols-2 sm:px-9">
                {(
                  [
                    ["Sashimi", "刺身", sashimiVisible],
                    ["Nigiri", "握り", nigiriVisible],
                  ] as const
                ).map(([title, kanji, items]) => (
                  <div key={title} className="py-2">
                    <div className="flex items-center gap-4">
                      <h3 className="m-caps text-[12px] !tracking-[0.35em] text-gold-soft">
                        {title}
                      </h3>
                      <span aria-hidden className="m-kanji text-[11px] text-gold/60">
                        {kanji}
                      </span>
                      <span aria-hidden className="h-px flex-1 bg-gold/25" />
                    </div>
                    <ul className="mt-3">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-baseline justify-between gap-4 py-2"
                        >
                          <span className="text-[12.5px]">
                            {item.price_note && (
                              <span className="text-tatami">{item.price_note} · </span>
                            )}
                            <span className="m-item-name">{item.name}</span>
                          </span>
                          {item.price !== null && (
                            <span className="m-price shrink-0 text-[13px]">
                              {dollars(item.price)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Rolls */}
          <section id="rolls" className="scroll-mt-44 pt-14 lg:scroll-mt-32">
            <SectionHeader title="Rolls" kanji={SECTION_KANJI.rolls} />
            {rollsVisible.length === 0 ? (
              <p className="mt-6 text-center text-sm text-tatami">
                Nothing here matches the selected filters.
              </p>
            ) : (
              <ul className="mt-5 sm:columns-2 sm:gap-x-16">
                {rollsVisible.map((item) => (
                  <ItemLine key={item.id} item={item} />
                ))}
              </ul>
            )}
          </section>

          {/* ------------------------- kitchen page -------------------------- */}
          {layout.sections.map((section) => {
            const visible = section.items.filter(matches);
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-44 pt-14 lg:scroll-mt-32"
              >
                <SectionHeader title={section.title} kanji={section.kanji} />
                {visible.length === 0 ? (
                  <p className="mt-6 text-center text-sm text-tatami">
                    Nothing here matches the selected filters.
                  </p>
                ) : (
                  <ul
                    className={
                      section.inline
                        ? "mt-5 sm:columns-2 sm:gap-x-16"
                        : "mt-5 sm:columns-2 sm:gap-x-16"
                    }
                  >
                    {visible.map((item) => (
                      <ItemLine key={item.id} item={item} inline={section.inline} />
                    ))}
                  </ul>
                )}

                {/* the printed add-on strip closes Bowls & Plates: title line,
                    then the add-ons as tidy name-price pairs that never leave
                    an orphaned price on its own line */}
                {section.id === "bowls-plates" && layout.addOn && (
                  <div className="mt-8 border border-seam px-5 py-5 text-center sm:px-8">
                    <p className="m-item-name text-[11.5px] text-washi">
                      <span aria-hidden className="m-price mr-2.5">
                        *
                      </span>
                      {layout.addOn.item.name}
                    </p>
                    <ul className="mx-auto mt-3.5 flex max-w-xl flex-wrap justify-center gap-x-7 gap-y-2">
                      {(layout.addOn.item.description ?? "")
                        .split(/\s*[/·]\s*/)
                        .filter(Boolean)
                        .map((part) => {
                          const m = part.match(/^(.*?)\s*(\$\d+(?:\.\d+)?)$/);
                          return (
                            <li
                              key={part}
                              className="whitespace-nowrap text-[13px] text-tatami"
                            >
                              {m ? (
                                <>
                                  {m[1]}{" "}
                                  <span className="m-price ml-1">{m[2]}</span>
                                </>
                              ) : (
                                part
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </section>
            );
          })}

          {/* ------------------------- the bar ------------------------------- */}
          {layout.drinks.map((section) => {
            const visible = section.items.filter(matches);
            const groupBand = bandFor(section.category.slug);
            return (
              <section
                key={section.category.id}
                id={section.category.slug}
                className="scroll-mt-44 pt-14 lg:scroll-mt-32"
              >
                {groupBand && (
                  <div className="m-verm relative mb-12 overflow-hidden px-6 py-7 sm:px-8">
                    <span
                      aria-hidden
                      className="m-kanji absolute -top-5 right-3 text-[6rem] leading-none text-washi opacity-15"
                    >
                      {groupBand.glyph}
                    </span>
                    <p className="m-eyebrow !text-[0.65rem]">The bar</p>
                    <p className="m-serif mt-2 text-3xl">{groupBand.title}</p>
                  </div>
                )}
                <SectionHeader
                  title={section.category.name}
                  kanji={SECTION_KANJI[section.category.slug]}
                />
                {visible.length === 0 ? (
                  <p className="mt-6 text-center text-sm text-tatami">
                    Nothing here matches the selected filters.
                  </p>
                ) : (
                  <ul className="mt-5 sm:columns-2 sm:gap-x-16">
                    {visible.map((item) => (
                      <ItemLine key={item.id} item={item} />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          {layout.drinks.length === 0 && (
            <section className="scroll-mt-44 pt-12 lg:scroll-mt-32">
              <div className="m-verm relative overflow-hidden px-6 py-7 sm:px-8">
                <span
                  aria-hidden
                  className="m-kanji absolute -top-5 right-3 text-[6rem] leading-none text-washi opacity-15"
                >
                  盃
                </span>
                <p className="m-eyebrow !text-[0.65rem]">The bar</p>
                <p className="m-serif mt-2 text-3xl">Drinks</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-washi/90">
                  Cocktails, sake, wine, and beer are coming soon. Check back
                  for the full list.
                </p>
              </div>
            </section>
          )}

          <p className="mt-16 border-t border-seam pt-5 text-center text-xs leading-relaxed text-tatami/80">
            *Consuming raw or undercooked meats, poultry, seafood, or shellfish may
            increase risk of foodborne illness.
          </p>
        </div>
      </div>
    </div>
  );
}
