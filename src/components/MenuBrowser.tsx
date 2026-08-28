"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { DietaryTag, ResolvedMenuSection } from "@/lib/types";

const FILTERS: { tag: DietaryTag; label: string }[] = [
  { tag: "gluten-free", label: "Gluten-free" },
  { tag: "vegetarian", label: "Vegetarian" },
  { tag: "vegan", label: "Vegan" },
];

const TAG_LABELS: Record<DietaryTag, string> = {
  "gluten-free": "GF",
  vegetarian: "V",
  vegan: "VG",
  spicy: "🌶",
};

/** Renders the full menu (statically — data arrives as props from the server
 * render, no client fetch) with a sticky category nav and dietary filters. */
export function MenuBrowser({ menu }: { menu: ResolvedMenuSection[] }) {
  const [active, setActive] = useState<DietaryTag[]>([]);

  const toggle = (tag: DietaryTag) =>
    setActive((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );

  const matches = (tags: DietaryTag[]) => active.every((t) => tags.includes(t));

  return (
    <>
      <nav
        aria-label="Menu categories"
        className="sticky top-0 z-10 -mx-4 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur"
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {menu.map((section) => (
            <a
              key={section.category.id}
              href={`#${section.category.slug}`}
              className="font-medium text-ink-soft hover:text-ink"
            >
              {section.category.name}
            </a>
          ))}
          <span className="hidden h-4 w-px bg-line sm:block" aria-hidden />
          {FILTERS.map(({ tag, label }) => (
            <button
              key={tag}
              type="button"
              aria-pressed={active.includes(tag)}
              onClick={() => toggle(tag)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                active.includes(tag)
                  ? "border-bamboo-700 bg-bamboo-700 text-white"
                  : "border-line text-ink-soft hover:border-bamboo-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {menu.map((section) => {
        const visible = section.items.filter((i) => matches(i.dietary_tags));
        return (
          <section
            key={section.category.id}
            id={section.category.slug}
            className="scroll-mt-16 pt-10"
          >
            <h2 className="text-xl font-semibold text-bamboo-800">
              {section.category.name}
            </h2>
            {visible.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">
                Nothing in this section matches the selected filters.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {visible.map((item) => (
                  <li key={item.id} className="flex items-baseline justify-between gap-4 py-3">
                    <div>
                      <h3 className="font-medium">
                        {item.name}
                        {item.dietary_tags.map((tag) => (
                          <span
                            key={tag}
                            title={tag}
                            className="ml-1.5 inline-block rounded bg-bamboo-100 px-1 py-0.5 align-middle text-[10px] font-semibold uppercase text-bamboo-800"
                          >
                            {TAG_LABELS[tag]}
                          </span>
                        ))}
                      </h3>
                      {item.description && (
                        <p className="mt-0.5 text-sm text-ink-soft">{item.description}</p>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-medium tabular-nums">
                      {formatPrice(item)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
}
