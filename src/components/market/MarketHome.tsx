import Link from "next/link";
import { formatHoursEntry, formatPriceShort, telHref } from "@/lib/format";
import type { Location, ResolvedMenuItem, ResolvedMenuSection } from "@/lib/types";
import type { SiteCopy } from "@content/types";
import { MarketFx } from "./MarketFx";

function HighlightRow({ item }: { item: ResolvedMenuItem }) {
  return (
    <li className="border-b border-seam py-5">
      <div className="flex items-baseline justify-between gap-6">
        <h3 className="m-item-name text-sm">{item.name}</h3>
        <p className="m-price shrink-0 text-sm">{formatPriceShort(item)}</p>
      </div>
      {item.description && (
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-tatami">
          {item.description}
        </p>
      )}
    </li>
  );
}

export function MarketHome({
  copy,
  location,
  sister,
  menu,
}: {
  copy: SiteCopy;
  location: Location;
  sister: Location;
  menu: ResolvedMenuSection[];
}) {
  // One signature item from each of the first six sections.
  const highlights = menu.slice(0, 6).flatMap((s) => s.items.slice(0, 1));

  return (
    <>
      <MarketFx />

      {/* ------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden m-seigaiha">
        <p
          aria-hidden
          data-parallax="0.3"
          className="m-ghost-kanji absolute -right-8 top-1/2 -translate-y-1/2 text-[24rem] sm:-right-4 sm:text-[34rem]"
        >
          竹
        </p>
        <p
          aria-hidden
          className="m-tategaki absolute right-6 top-16 hidden text-lg lg:block"
        >
          鮨 · 竹 · 灯
        </p>

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28">
          <div data-hero className="flex items-center gap-5">
            <span aria-hidden className="h-px w-14 bg-verm" />
            <p className="m-eyebrow">Chattanooga · Market Street</p>
          </div>

          <h1
            data-hero
            className="m-serif mt-8 max-w-3xl text-5xl leading-[1.12] sm:text-7xl"
          >
            {copy.hero.heading}
          </h1>

          <p
            data-hero
            className="mt-7 max-w-xl text-lg leading-relaxed text-tatami"
          >
            {copy.hero.subheading}
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
              className="m-caps group inline-flex items-center gap-3 text-[13px] text-tatami hover:text-washi"
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
        <div data-hero className="relative border-y border-seam bg-char-deep/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-2 px-5 py-4 sm:px-8">
            <p className="m-eyebrow !text-[0.65rem]">Tonight</p>
            {location.hours.filter((h) => h.open !== "closed").slice(0, 1).map((h) => (
              <p key={h.days} className="text-sm text-tatami">
                {formatHoursEntry(h)}
              </p>
            ))}
            <p className="text-sm text-tatami">
              {location.address_line1}, {location.city}
            </p>
            <p className="m-caps ml-auto hidden text-[11px] text-gold-soft sm:block">
              Walk-ins welcome
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- From the kitchen */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div data-fx="rise" className="m-rule-title">
          <span aria-hidden className="m-serif text-lg text-gold">
            鮨
          </span>
          <h2 className="m-serif text-center text-3xl sm:text-4xl">
            From the kitchen
          </h2>
          <span aria-hidden className="m-serif text-lg text-gold">
            巻
          </span>
        </div>

        <ul
          data-fx-group
          className="mt-12 grid gap-x-16 sm:grid-cols-2"
        >
          {highlights.map((item) => (
            <HighlightRow key={item.id} item={item} />
          ))}
        </ul>

        <div data-fx="rise" className="mt-12 text-center">
          <Link
            href="/menu"
            className="m-caps inline-block border border-seam px-8 py-4 text-[13px] text-washi transition-colors hover:border-gold hover:text-gold-soft"
          >
            The full menu
          </Link>
        </div>
      </section>

      {/* ----------------------------------------------- Editorial band */}
      <section className="relative overflow-hidden border-y border-seam bg-char-deep">
        <p
          aria-hidden
          data-parallax="0.35"
          className="m-ghost-kanji absolute -left-10 top-1/2 -translate-y-1/2 text-[20rem]"
        >
          味
        </p>
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <span aria-hidden data-fx="draw" className="mx-auto block h-px w-16 bg-gold" />
          <p data-fx="rise" className="m-serif mt-8 text-2xl leading-relaxed sm:text-[1.75rem]">
            {copy.intro}
          </p>
          <span aria-hidden data-fx="draw" className="mx-auto mt-8 block h-px w-16 bg-gold" />
        </div>
      </section>

      {/* -------------------------------------------------- Hours / visit */}
      <section className="mx-auto grid max-w-6xl gap-14 px-5 py-24 sm:px-8 md:grid-cols-2">
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

        <div data-fx="rise">
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
