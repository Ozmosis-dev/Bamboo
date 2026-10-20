"use client";

import { useEffect, useState } from "react";
import type { DietaryTag, ResolvedMenuSection } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { MarketFx, scrollToId } from "./MarketFx";
import { FOOD_SLUGS, SECTION_KANJI } from "./kanji";

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

const MOBILE_VISIBLE = 5;

/** Menu browser in the printed-menu style: sticky category rail (desktop) /
 * collapsible category panel (mobile), active-section tracking, smooth
 * scroll, dietary filters, full-row section bands. */
export function MarketMenu({ menu }: { menu: ResolvedMenuSection[] }) {
  const [active, setActive] = useState<DietaryTag[]>([]);
  const [current, setCurrent] = useState<string>(menu[0]?.category.slug ?? "");
  const [moreOpen, setMoreOpen] = useState(false);

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

  const onJump = (slug: string, offsetY: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMoreOpen(false);
    // Let the "More" panel finish collapsing before measuring the target.
    window.setTimeout(() => scrollToId(slug, offsetY), moreOpen ? 340 : 0);
  };

  // Mobile: keep the active category visible even while collapsed.
  const foundIdx = menu.findIndex((s) => s.category.slug === current);
  const currentIdx = foundIdx === -1 ? 0 : foundIdx;
  const mobileVisible =
    currentIdx < MOBILE_VISIBLE
      ? menu.slice(0, MOBILE_VISIBLE)
      : [...menu.slice(0, MOBILE_VISIBLE - 1), menu[currentIdx]];
  const mobileRest = menu.filter((s) => !mobileVisible.includes(s));

  const chip = (slug: string, name: string, isCurrent: boolean, offsetY: number) => (
    <a
      key={slug}
      href={`#${slug}`}
      onClick={onJump(slug, offsetY)}
      aria-current={isCurrent ? "true" : undefined}
      className={`m-caps whitespace-nowrap border px-3 py-1.5 text-[10.5px] transition-colors ${
        isCurrent ? "border-verm bg-verm text-washi" : "border-seam text-tatami"
      }`}
    >
      {name}
    </a>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <MarketFx />

      {/* Mobile category panel */}
      <nav
        aria-label="Menu categories"
        className="sticky top-[70px] z-30 -mx-5 border-b border-seam bg-char/95 px-5 pb-3 pt-3 backdrop-blur-md lg:hidden"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {mobileVisible.map((s) =>
            chip(s.category.slug, s.category.name, current === s.category.slug, 185)
          )}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            className={`m-caps flex items-center gap-1.5 border px-3 py-1.5 text-[10.5px] transition-colors ${
              moreOpen ? "border-gold text-gold-soft" : "border-seam text-gold-soft"
            }`}
          >
            More
            <svg
              aria-hidden
              viewBox="0 0 10 6"
              className={`h-[5px] w-[9px] transition-transform duration-300 ${
                moreOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1 1l4 4 4-4" />
            </svg>
          </button>
        </div>
        <div
          className={`grid transition-all duration-300 ${
            moreOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="flex flex-wrap gap-1.5 overflow-hidden">
            {mobileRest.map((s) =>
              chip(s.category.slug, s.category.name, current === s.category.slug, 185)
            )}
          </div>
        </div>
      </nav>

      <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-16">
        {/* Desktop rail */}
        <aside className="hidden pt-8 lg:block">
          <div className="sticky top-28">
            <nav aria-label="Menu categories">
              {(
                [
                  ["Food", "食", menu.filter((s) => FOOD_SLUGS.includes(s.category.slug))],
                  ["Drinks", "飲", menu.filter((s) => !FOOD_SLUGS.includes(s.category.slug))],
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

          {menu.map((section) => {
            const visible = section.items.filter((item) => matches(item.dietary_tags));
            const kanji = SECTION_KANJI[section.category.slug];
            const isBarStart = section.category.slug === "cocktails";
            return (
              <section
                key={section.category.id}
                id={section.category.slug}
                className="scroll-mt-44 pt-12 first:pt-8 lg:scroll-mt-32"
              >
                {isBarStart && (
                  <div className="m-verm relative mb-12 overflow-hidden px-6 py-7 sm:px-8">
                    <span
                      aria-hidden
                      className="m-kanji absolute -top-5 right-3 text-[6rem] leading-none text-washi opacity-15"
                    >
                      盃
                    </span>
                    <p className="m-eyebrow !text-[0.65rem]">Second half</p>
                    <p className="m-serif mt-2 text-3xl">The bar</p>
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
                  <ul className="mt-2 px-1">
                    {visible.map((item) => (
                      <li key={item.id} className="border-b border-seam py-4.5">
                        <div className="flex items-baseline justify-between gap-6">
                          <h3 className="m-item-name text-[13.5px]">
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
                          <p className="shrink-0 text-[15px]">
                            {item.price !== null && (
                              <span className="m-price">{dollars(item.price)}</span>
                            )}
                            {item.price_note && (
                              <span className="ml-2 text-[13px] text-tatami">
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
                    ))}
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
