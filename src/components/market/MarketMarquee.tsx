import Image from "next/image";

const DISHES: [string, string][] = [
  ["/photos/rolls-platter.webp", "Specialty rolls on slate boards"],
  ["/photos/sashimi-board.webp", "Nigiri and sashimi with shaved carrot"],
  ["/photos/ramen-close.webp", "Pork belly ramen with soft egg"],
  ["/photos/rainbow-roll.webp", "Rainbow roll with spicy mayo"],
  ["/photos/glazed-bowl.webp", "Glazed rice bowl beside skewers"],
  ["/photos/roll-closeup.webp", "Torched roll with spicy mayo and sesame"],
  ["/photos/ribs.webp", "Slow roasted baby back ribs with rice and slaw"],
  ["/photos/nigiri.webp", "Glazed nigiri and rolls"],
  ["/photos/skewers.webp", "Lemongrass chicken skewers"],
  ["/photos/ramen.webp", "Noodle bowl with soft egg and crispy wonton"],
];

/** Seamless auto-scrolling strip of graded kitchen photos. Pure CSS
 * animation (see .m-marquee in globals.css): pauses on hover, static
 * under prefers-reduced-motion. */
export function MarketMarquee() {
  return (
    <section aria-label="From the kitchen" className="m-marquee border-b border-seam">
      <div className="m-marquee-track">
        {[false, true].map((clone) => (
          <ul key={String(clone)} aria-hidden={clone || undefined} className="flex shrink-0">
            {DISHES.map(([src, alt]) => (
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
