import Image from "next/image";
import Link from "next/link";
import { formatHoursEntry, telHref } from "@/lib/format";
import type { Location, ResolvedMenuSection } from "@/lib/types";
import type { SiteContent } from "@/lib/content";
import type { GalleryImage } from "@/lib/images";
import { MarketFx } from "./MarketFx";
import { MarketIntro } from "./MarketIntro";
import { MarketMarquee } from "./MarketMarquee";
import { DRINK_GROUPS, FOOD_SLUGS, SECTION_KANJI } from "./kanji";

const JP_NUMERALS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

/** Food categories list individually; the bar rows follow DRINK_GROUPS. */
function categoryCards(menu: ResolvedMenuSection[]) {
  const food = menu.filter((s) => FOOD_SLUGS.includes(s.category.slug));
  const barRows = DRINK_GROUPS.map((g) => ({
    title: g.title,
    glyph: g.glyph,
    anchor: g.slugs[0],
    count: menu
      .filter((s) => g.slugs.includes(s.category.slug))
      .reduce((n, s) => n + s.items.length, 0),
  }));
  return { food, barRows };
}

export function MarketHome({
  content,
  location,
  sister,
  menu,
  images,
  gallery,
}: {
  content: SiteContent;
  location: Location;
  sister: Location;
  menu: ResolvedMenuSection[];
  images: Record<string, string>;
  gallery: GalleryImage[];
}) {
  const { food, barRows } = categoryCards(menu);

  return (
    <>
      <MarketIntro />
      <MarketFx />

      {/* ------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden bg-char-deep">
        {/* Door render on the right; one gradient overlays the WHOLE section
            (ground + image) so there is no boundary to see */}
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-y-0 right-0 w-full md:left-[20%] md:w-auto">
            <Image
              src={images.hero_door}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
              className="m-photo object-cover object-[72%_center]"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, var(--color-char-deep) 0%, var(--color-char-deep) 32%, color-mix(in srgb, var(--color-char-deep) 55%, transparent) 52%, color-mix(in srgb, var(--color-char-deep) 20%, transparent) 70%, transparent 90%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-char-deep via-transparent to-char-deep/40" />
        </div>

        <p
          aria-hidden
          className="m-tategaki absolute right-5 top-16 hidden text-lg lg:block"
        >
          鮨 · 竹 · 灯
        </p>

        <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-24 sm:px-8 sm:pb-36 sm:pt-32">
          <div data-hero className="flex items-center gap-5">
            <span aria-hidden className="h-px w-14 bg-verm" />
            <p className="m-eyebrow">Chattanooga · Market Street</p>
          </div>

          <h1
            data-hero
            className="m-serif mt-8 max-w-2xl text-5xl leading-[1.08] sm:text-[4.5rem]"
          >
            {content.hero_heading}
          </h1>

          <p
            data-hero
            className="mt-7 max-w-md text-lg leading-relaxed text-tatami"
          >
            {content.hero_subheading}
          </p>

          <div data-hero className="mt-11 flex flex-wrap items-center gap-6">
            <Link
              href="/menu"
              className="m-caps bg-verm px-8 py-4 text-[13px] text-washi transition-colors hover:bg-price"
            >
              See the menu
            </Link>
            <a
              href={telHref(location.phone)}
              className="m-caps group inline-flex items-center gap-3 text-[13px] text-washi/90 hover:text-washi"
            >
              Call {location.phone}
              <span
                aria-hidden
                className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-12"
              />
            </a>
          </div>
        </div>

        {/* Tonight strip */}
        <div data-hero className="relative border-y border-seam bg-char-deep">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-seam px-5 sm:grid-cols-3 sm:divide-x sm:px-8">
            <div className="py-4 sm:pr-10">
              <p className="m-eyebrow !text-[0.6rem]">
                Tonight <span className="m-kanji font-normal">· 今夜</span>
              </p>
              {location.hours.filter((h) => h.open !== "closed").slice(0, 1).map((h) => (
                <p key={h.days} className="m-serif mt-1.5 text-lg leading-snug">
                  {formatHoursEntry(h)}
                </p>
              ))}
            </div>
            <div className="py-4 sm:px-10">
              <p className="m-eyebrow !text-[0.6rem]">Find us</p>
              <p className="m-serif mt-1.5 text-lg leading-snug">
                {location.address_line1}, {location.city}
              </p>
            </div>
            <div className="col-span-2 border-t border-seam py-4 sm:col-span-1 sm:border-t-0 sm:pl-10">
              <p className="m-eyebrow !text-[0.6rem]">No reservations</p>
              <p className="m-serif mt-1.5 text-lg leading-snug text-gold-soft">
                Walk-ins welcome
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------- Kitchen marquee */}
      <MarketMarquee items={gallery} />

      {/* ------------------------------------------------- The menu, by course */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="m-paper-dark" />
        <Image
          src="/textures/wave.webp"
          alt=""
          aria-hidden
          width={1400}
          height={942}
          data-parallax="0.15"
          className="pointer-events-none absolute -right-16 bottom-0 w-[760px] max-w-none opacity-[0.16] sm:w-[1000px]"
        />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <div
            data-fx="rise"
            className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6"
          >
            <div>
              <div className="flex items-center gap-5">
                <span aria-hidden className="h-px w-14 bg-verm" />
                <p className="m-eyebrow">
                  By course <span className="m-kanji font-normal">· 献立</span>
                </p>
              </div>
              <h2 className="m-serif mt-6 text-4xl leading-tight sm:text-5xl">Menu</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  ["/menus/bamboo-food-menu.pdf", "PDF Food Menu"],
                  ["/menus/bamboo-drinks-menu.pdf", "PDF Drink Menu"],
                ] as const
              ).map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="m-caps inline-flex items-center gap-2.5 border border-seam px-4 py-2.5 text-[11px] text-washi transition-colors hover:border-gold hover:text-gold-soft"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 2v8m0 0 3-3m-3 3L5 7M3 13h10" />
                  </svg>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <ul data-fx-group className="mt-14">
            {food.map((section, i) => {
              const kanji = SECTION_KANJI[section.category.slug];
              return (
                <li key={section.category.id} className="relative">
                  <Link
                    href={`/menu#${section.category.slug}`}
                    className="group relative grid grid-cols-[2.25rem_1fr] items-baseline gap-4 overflow-hidden border-b border-seam py-6 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-8 sm:py-7"
                  >
                    {kanji && (
                      <span
                        aria-hidden
                        className="m-kanji pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 text-7xl text-gold-soft opacity-0 transition-opacity duration-500 group-hover:opacity-[0.14] sm:text-8xl"
                      >
                        {kanji}
                      </span>
                    )}
                    <span
                      aria-hidden
                      className="m-kanji text-lg text-verm transition-colors group-hover:text-price"
                    >
                      {JP_NUMERALS[i]}
                    </span>
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-5 gap-y-1">
                      <span className="m-serif text-3xl leading-none transition-transform duration-300 group-hover:translate-x-2 sm:text-[2.75rem]">
                        {section.category.name}
                      </span>
                      {kanji && (
                        <span aria-hidden className="m-kanji text-sm text-gold">
                          {kanji}
                        </span>
                      )}
                    </span>
                    <span className="col-start-2 flex items-center gap-4 sm:col-start-3">
                      <span className="m-caps text-[11px] text-tatami">
                        {section.items.length} dishes
                      </span>
                      <span
                        aria-hidden
                        className="h-px w-8 bg-verm transition-all duration-300 group-hover:w-16"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
            {barRows.map((row, i) => (
              <li key={row.title} className="relative">
                <Link
                  href={`/menu#${row.anchor}`}
                  className="group relative grid grid-cols-[2.25rem_1fr] items-baseline gap-4 overflow-hidden border-b border-seam py-6 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-8 sm:py-7"
                >
                  <span
                    aria-hidden
                    className="m-kanji pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 text-7xl text-gold-soft opacity-0 transition-opacity duration-500 group-hover:opacity-[0.14] sm:text-8xl"
                  >
                    {row.glyph}
                  </span>
                  <span aria-hidden className="m-kanji text-lg text-verm">
                    {JP_NUMERALS[food.length + i]}
                  </span>
                  <span className="flex min-w-0 flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="m-serif text-3xl leading-none text-gold-soft transition-transform duration-300 group-hover:translate-x-2 sm:text-[2.75rem]">
                      {row.title}
                    </span>
                    <span aria-hidden className="m-kanji text-sm text-gold">
                      {row.glyph}
                    </span>
                  </span>
                  <span className="col-start-2 flex items-center gap-4 sm:col-start-3">
                    <span className="m-caps text-[11px] text-tatami">
                      {row.count} pours
                    </span>
                    <span
                      aria-hidden
                      className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-16"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div data-fx="rise" className="mt-12 flex justify-end">
            <Link
              href="/menu"
              className="m-caps group inline-flex items-center gap-3 text-[13px] text-washi hover:text-gold-soft"
            >
              Open the full menu
              <span
                aria-hidden
                className="h-px w-10 bg-gold transition-all duration-300 group-hover:w-16"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Behind the counter */}
      <section className="relative overflow-hidden border-y border-seam">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={images.counter}
            alt=""
            fill
            sizes="100vw"
            className="m-photo scale-110 object-cover object-[60%_center]"
            data-parallax="0.18"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-char via-char/75 to-char/30" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
          <div data-fx="rise" className="max-w-md">
            <p className="m-eyebrow">Behind the counter</p>
            <p className="m-serif mt-6 text-2xl leading-relaxed sm:text-3xl">
              {content.intro}
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Hours / visit */}
      <section className="relative mx-auto grid max-w-6xl gap-14 overflow-hidden px-5 py-24 sm:px-8 md:grid-cols-2">
        <p
          aria-hidden
          className="m-ghost-kanji absolute -right-8 bottom-0 hidden text-[14rem] md:block"
        >
          灯
        </p>
        <div data-fx="rise">
          <p className="m-eyebrow">Hours</p>
          <ul className="mt-6 max-w-sm">
            {location.hours.map((entry) => {
              const [days, times] = formatHoursEntry(entry).split(": ");
              return (
                <li
                  key={entry.days}
                  className="flex items-baseline justify-between gap-6 border-b border-seam py-3.5"
                >
                  <span className="m-caps text-[12px] text-washi">{days}</span>
                  <span className="text-sm text-tatami">{times}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div data-fx="rise" className="relative">
          <p className="m-eyebrow">Find us</p>
          <p className="m-serif mt-6 text-2xl leading-snug">
            {location.address_line1}
            <br />
            {location.city}, {location.state} {location.zip}
          </p>
          {location.map_url && (
            <a
              href={location.map_url}
              className="m-caps mt-6 inline-block border-b border-gold pb-1 text-xs text-gold-soft hover:text-washi"
            >
              Open in Maps
            </a>
          )}
          <p className="mt-10 text-sm leading-relaxed text-tatami">
            In {sister.city}? Visit our sister restaurant,{" "}
            <a
              href={`https://${sister.domain}`}
              className="text-washi underline decoration-seam underline-offset-4 hover:decoration-gold-soft"
            >
              {sister.name}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
