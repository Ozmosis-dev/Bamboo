"use client";

import { useEffect, useState } from "react";
import type { DietaryTag, ResolvedMenuSection } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { MarketFx, scrollToId } from "./MarketFx";
import { DRINK_GROUPS, FOOD_SLUGS, SECTION_KANJI } from "./kanji";

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

/** Short, description-less fish lists set tighter, in two columns. */
const COMPACT_SLUGS = ["sashimi", "nigiri"];

/** Menu browser in the printed-menu style: sticky category rail (desktop) /
 * Dinner–Drinks tab panel (mobile), active-section tracking, smooth scroll,
 * dietary filters, full-row section bands. */
export function MarketMenu({ menu }: { menu: ResolvedMenuSection[] }) {
  const [active, setActive] = useState<DietaryTag[]>([]);
  const [current, setCurrent] = useState<string>(menu[0]?.category.slug ?? "");
  const [groupOverride, setGroupOverride] = useState<{
    group: "dinner" | "drinks";
    at: string;
  } | null>(null);

  const toggle = (tag: DietaryTag) =>
    setActive((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]
    );

  const matches = (tags: DietaryTag[]) => active.every((t) => tags.includes(t));

  // Track which section is in view.
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
    for (const section of menu) {
      const el = document.getElementById(section.category.slug);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [menu]);

  // The mobile tab follows the section being read; a tap overrides it until
  // the reader scrolls into a different section.
  const autoGroup = FOOD_SLUGS.includes(current) ? "dinner" : "drinks";
  const group =
    groupOverride && groupOverride.at === current ? groupOverride.group : autoGroup;

  const onJump = (slug: string, offsetY: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(slug, offsetY);
  };

  const dinnerSections = menu.filter((s) => FOOD_SLUGS.includes(s.category.slug));
  // The bar in its curated order; categories outside the groups tag along.
  const drinkSections = [
    ...DRINK_GROUPS.flatMap((g) =>
      g.slugs.flatMap((slug) => menu.filter((s) => s.category.slug === slug))
    ),
    ...menu.filter(
      (s) =>
        !FOOD_SLUGS.includes(s.category.slug) &&
        !DRINK_GROUPS.some((g) => g.slugs.includes(s.category.slug))
    ),
  ];
  const orderedMenu = [...dinnerSections, ...drinkSections];
  const groupSections = group === "dinner" ? dinnerSections : drinkSections;
  /** Divider band to render before a section: the drink group it opens. */
  const bandFor = (slug: string) =>
    DRINK_GROUPS.find((g) => g.slugs[0] === slug);

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
          {groupSections.map((s) => {
            const slug = s.category.slug;
            const isCurrent = current === slug;
            return (
              <a
                key={slug}
                href={`#${slug}`}
                onClick={onJump(slug, 205)}
                aria-current={isCurrent ? "true" : undefined}
                className={`m-caps whitespace-nowrap border px-3 py-1.5 text-[10.5px] transition-colors ${
                  isCurrent
                    ? "border-gold bg-gold/15 text-gold-soft"
                    : "border-seam text-tatami"
                }`}
              >
                {s.category.name}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-16">
        {/* Desktop rail */}
        <aside className="hidden pt-8 lg:block">
          <div className="sticky top-28">
            <nav aria-label="Menu categories">
              {(
                [
                  ["Food", "食", dinnerSections],
                  ["Drinks", "飲", drinkSections],
                ] as const
              ).map(([label, glyph, sections], gi) => (
                <div key={label} className={gi > 0 ? "mt-8 border-t border-seam pt-6" : ""}>
                  <p className="m-eyebrow flex items-baseline gap-2 !text-[0.65rem]">
                    {label}
                    <span className="m-kanji font-normal text-gold/80">{glyph}</span>
                  </p>
                  <ul className="mt-3">
                    {sections.map((section) => {
                      const slug = section.category.slug;
                      const isCurrent = current === slug;
                      return (
                        <li key={slug}>
                          <a
                            href={`#${slug}`}
                            onClick={onJump(slug, 120)}
                            aria-current={isCurrent ? "true" : undefined}
                            className={`m-caps group relative block py-[5px] pl-8 text-[12px] leading-tight transition-colors ${
                              isCurrent ? "text-washi" : "text-tatami hover:text-washi"
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`absolute left-0 top-1/2 h-px -translate-y-1/2 bg-verm transition-all duration-300 ${
                                isCurrent ? "w-5" : "w-0 group-hover:w-3 group-hover:bg-gold"
                              }`}
                            />
                            {section.category.name}
                          </a>
                        </li>
                      );
                    })}
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

          {orderedMenu.map((section) => {
            const visible = section.items.filter((item) => matches(item.dietary_tags));
            const kanji = SECTION_KANJI[section.category.slug];
            const groupBand = bandFor(section.category.slug);
            const compact = COMPACT_SLUGS.includes(section.category.slug);
            return (
              <section
                key={section.category.id}
                id={section.category.slug}
                className="scroll-mt-44 pt-12 first:pt-8 lg:scroll-mt-32"
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

                {/* Full-row category band */}
                <header className="relative overflow-hidden border border-seam bg-char-deep">
                  <span
                    aria-hidden
                    className="m-kanji absolute -top-6 right-2 text-[5.5rem] leading-none text-tatami opacity-10"
                  >
                    {kanji ?? "竹"}
                  </span>
                  <div className="relative flex items-center gap-5 px-5 py-4 sm:px-6">
                    <span aria-hidden className="text-verm">
                      <CategoryIcon slug={section.category.slug} className="h-6 w-6" />
                    </span>
                    <h2 className="m-serif text-2xl tracking-wide sm:text-3xl">
                      {section.category.name}
                    </h2>
                    {kanji && (
                      <span aria-hidden className="m-kanji text-sm text-gold">
                        {kanji}
                      </span>
                    )}
                    <span className="m-caps ml-auto hidden text-[10px] text-tatami sm:block">
                      {visible.length} items
                    </span>
                  </div>
                </header>

                {visible.length === 0 ? (
                  <p className="mt-6 text-sm text-tatami">
                    Nothing here matches the selected filters.
                  </p>
                ) : (
                  <ul
                    className={
                      compact
                        ? "mt-2 grid grid-cols-1 gap-x-12 px-1 sm:grid-cols-2"
                        : "mt-2 px-1"
                    }
                  >
                    {visible.map((item) =>
                      compact && item.description ? (
                        /* a described item in a compact section (The Flight)
                           spans both columns as a signature card */
                        <li
                          key={item.id}
                          className="relative mb-4 mt-2 border border-gold/35 bg-char-deep/70 px-5 py-4 sm:col-span-2"
                        >
                          {(
                            [
                              "left-1.5 top-1.5 border-l border-t",
                              "right-1.5 top-1.5 border-r border-t",
                              "bottom-1.5 left-1.5 border-b border-l",
                              "bottom-1.5 right-1.5 border-b border-r",
                            ] as const
                          ).map((pos) => (
                            <span
                              key={pos}
                              aria-hidden
                              className={`absolute h-3 w-3 border-gold/60 ${pos}`}
                            />
                          ))}
                          <p className="m-eyebrow !text-[0.58rem] text-gold-soft">
                            Chef&apos;s signature{" "}
                            <span className="m-kanji font-normal">· 板長</span>
                          </p>
                          <div className="mt-2 flex items-baseline justify-between gap-6">
                            <h3 className="m-item-name text-[14px]">{item.name}</h3>
                            <p className="shrink-0 text-[15px]">
                              {item.price !== null && (
                                <span className="m-price">{dollars(item.price)}</span>
                              )}
                              {item.price_note && (
                                <span className="ml-2 text-[12px] text-tatami">
                                  {item.price !== null ? "· " : ""}
                                  {item.price_note}
                                </span>
                              )}
                            </p>
                          </div>
                          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-tatami">
                            {item.description}
                          </p>
                        </li>
                      ) : (
                      <li
                        key={item.id}
                        className={`border-b border-seam ${compact ? "py-2.5" : "py-4.5"}`}
                      >
                        <div className="flex items-baseline justify-between gap-6">
                          <h3
                            className={`m-item-name ${compact ? "text-[12.5px]" : "text-[13.5px]"}`}
                          >
                            {item.name}
                            {item.dietary_tags.map((tag) => (
                              <span
                                key={tag}
                                title={tag}
                                className="ml-2 inline-block border border-seam px-1.5 py-0.5 align-middle text-[9px] font-semibold tracking-widest text-gold-soft"
                              >
                                {TAG_LABELS[tag]}
                              </span>
                            ))}
                          </h3>
                          <p className={`shrink-0 ${compact ? "text-[13.5px]" : "text-[15px]"}`}>
                            {item.price !== null && (
                              <span className="m-price">{dollars(item.price)}</span>
                            )}
                            {item.price_note && (
                              <span
                                className={`ml-2 text-tatami ${compact ? "text-[11.5px]" : "text-[13px]"}`}
                              >
                                {item.price !== null ? "· " : ""}
                                {item.price_note}
                              </span>
                            )}
                          </p>
                        </div>
                        {item.description && (
                          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-tatami">
                            {item.description}
                          </p>
                        )}
                      </li>
                      )
                    )}
                  </ul>
                )}
              </section>
            );
          })}

          <p className="mt-16 border-t border-seam pt-5 text-xs leading-relaxed text-tatami/80">
            *Consuming raw or undercooked meats, poultry, seafood, or shellfish may
            increase risk of foodborne illness.
          </p>
        </div>
      </div>
    </div>
  );
}
