"use client";

import { useId, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/images";

/** The arrow bar beneath the kitchen marquee: opens the full food
 * gallery as a seam-ruled grid, closed by default. */
export function MarketGalleryExpand({ items }: { items: GalleryImage[] }) {
  const [open, setOpen] = useState(false);
  const gridId = useId();
  if (items.length === 0) return null;

  return (
    <section aria-label="Full food gallery" className="border-b border-seam">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={gridId}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-center gap-4 py-4 transition-colors hover:text-gold-soft"
      >
        <span aria-hidden className="h-px w-10 bg-seam transition-colors group-hover:bg-gold-soft/60" />
        <span className="m-eyebrow !text-[0.62rem]">
          {open ? "Close the gallery" : "See the full gallery"}{" "}
          <span className="m-kanji font-normal">· 料理</span>
        </span>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`h-3.5 w-3.5 text-gold-soft transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 6l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span aria-hidden className="h-px w-10 bg-seam transition-colors group-hover:bg-gold-soft/60" />
      </button>

      <div
        id={gridId}
        className="grid transition-[grid-template-rows] duration-700 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ul className="grid grid-cols-2 border-t border-seam sm:grid-cols-3 lg:grid-cols-4">
            {items.map(({ url, alt }) => (
              <li
                key={url}
                className="relative aspect-[4/3] border-r border-b border-seam"
              >
                <Image
                  src={url}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="m-photo object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
