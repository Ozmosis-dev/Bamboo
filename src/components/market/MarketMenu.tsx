"use client";

import { useEffect, useRef, useState } from "react";
import { formatPriceShort } from "@/lib/format";
import type { DietaryTag, ResolvedMenuSection } from "@/lib/types";
import { MarketFx, scrollToId } from "./MarketFx";

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

/** Kanji glyphs for sections we can name confidently; others go without. */
const SECTION_KANJI: Record<string, string> = {
  sashimi: "刺身",
  nigiri: "握り",
  rolls: "巻",
  skewers: "串",
  salads: "菜",
  "noodle-bowls": "麺",
  sake: "酒",
  cocktails: "盃",
};

/** Menu browser in the printed-menu style: sticky category rail (desktop) /
 * chip bar (mobile), active-section tracking, smooth scroll, dietary filters. */
export function MarketMenu({ menu }: { menu: ResolvedMenuSection[] }) {
  const [active, setActive] = useState<DietaryTag[]>([]);
  const [current, setCurrent] = useState<string>(menu[0]?.category.slug ?? "");
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

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
      { rootMargin: "-20% 0px -70% 0px" }
    );
    for (const section of menu) {
      const el = document.getElementById(section.category.slug);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [menu]);

  // Keep the active mobile chip scrolled into view.
  useEffect(() => {
    chipRefs.current[current]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [current]);

  const onJump = (slug: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(slug, 120);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <MarketFx />

      {/* Mobile chip bar */}
      <nav
        aria-label="Menu categories"
        className="sticky top-[61px] z-30 -mx-5 border-b border-seam bg-char/95 px-5 backdrop-blur-md lg:hidden"
      >
        <div className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menu.map((section) => {
            const slug = section.category.slug;
            const isCurrent = current === slug;
            return (
              <a
                key={slug}
                ref={(el) => {
                  chipRefs.current[slug] = el;
                }}
                href={`#${slug}`}
                onClick={onJump(slug)}
                aria-current={isCurrent ? "true" : undefined}
                className={`m-caps shrink-0 whitespace-nowrap border px-3.5 py-2 text-[11px] transition-colors ${
                  isCurrent
                    ? "border-verm bg-verm text-washi"
                    : "border-seam text-tatami"
                }`}
              >
                {section.category.name}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-16">
        {/* Desktop rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="m-eyebrow !text-[0.65rem]">Jump to</p>
            <nav aria-label="Menu categories">
              <ul className="mt-5 space-y-0.5">
                {menu.map((section) => {
                  const slug = section.category.slug;
                  const isCurrent = current === slug;
                  return (
                    <li key={slug}>
                      <a
                        href={`#${slug}`}
                        onClick={onJump(slug)}
                        aria-current={isCurrent ? "true" : undefined}
                        className={`m-caps group flex items-center gap-3 py-2 text-[12px] transition-colors ${
                          isCurrent ? "text-washi" : "text-tatami hover:text-washi"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`h-px bg-verm transition-all duration-300 ${
                            isCurrent ? "w-6" : "w-0 group-hover:w-3 group-hover:bg-gold"
                          }`}
                        />
                        {section.category.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-10 border-t border-seam pt-6">
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
            const visible = section.items.filter((i) => matches(i.dietary_tags));
            const kanji = SECTION_KANJI[section.category.slug];
            return (
              <section
                key={section.category.id}
                id={section.category.slug}
                className="scroll-mt-32 pt-16 first:pt-10"
              >
                <div className="flex items-baseline gap-5">
                  <h2 className="m-serif text-2xl tracking-wide sm:text-3xl">
                    {section.category.name}
                  </h2>
                  {kanji && (
                    <span aria-hidden className="m-serif text-base text-gold">
                      {kanji}
                    </span>
                  )}
                  <span aria-hidden data-fx="draw" className="h-px flex-1 self-center bg-seam" />
                </div>

                {visible.length === 0 ? (
                  <p className="mt-6 text-sm text-tatami">
                    Nothing here matches the selected filters.
                  </p>
                ) : (
                  <ul className="mt-4">
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
                          <p className="m-price shrink-0 text-[15px]">
                            {formatPriceShort(item)}
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
            *Consuming raw or undercooked meats, poultry, seafood, or shellfish
            may increase risk of foodborne illness.
          </p>
        </div>
      </div>
    </div>
  );
}
