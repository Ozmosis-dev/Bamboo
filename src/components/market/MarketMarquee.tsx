import Image from "next/image";
import { DEFAULT_GALLERY, type GalleryImage } from "@/lib/images";

/** Seamless auto-scrolling strip of graded kitchen photos. Pure CSS
 * animation (see .m-marquee in globals.css): pauses on hover, static
 * under prefers-reduced-motion. */
export function MarketMarquee({ items = DEFAULT_GALLERY }: { items?: GalleryImage[] }) {
  return (
    <section aria-label="From the kitchen" className="m-marquee border-b border-seam">
      <div className="m-marquee-track">
        {[false, true].map((clone) => (
          <ul key={String(clone)} aria-hidden={clone || undefined} className="flex shrink-0">
            {items.map(({ url: src, alt }) => (
              <li
                key={src}
                className="relative h-56 w-[260px] shrink-0 border-r border-seam sm:h-72 sm:w-[330px]"
              >
                <Image
                  src={src}
                  alt={clone ? "" : alt}
                  fill
                  sizes="330px"
                  className="m-photo object-cover"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
