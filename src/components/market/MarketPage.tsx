import { MarketFx } from "./MarketFx";

/** Shared page opening for market subpages: vermilion dash, eyebrow with an
 * optional kanji tail, Faculty Glyphic title, optional lead. Mounts the page
 * motion engine. */
export function MarketPageHeader({
  eyebrow,
  kanji,
  title,
  lead,
}: {
  eyebrow: string;
  kanji?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="relative">
      <div aria-hidden className="m-paper-dark" />
      <div className="relative mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-20">
        <MarketFx />
      {kanji && (
        <p
          aria-hidden
          className="m-tategaki absolute right-5 top-16 hidden text-lg lg:block"
        >
          {kanji}
        </p>
      )}
      <div data-hero className="flex items-center gap-5">
        <span aria-hidden className="h-px w-14 bg-verm" />
        <p className="m-eyebrow">{eyebrow}</p>
      </div>
      <h1 data-hero className="m-serif mt-6 max-w-2xl text-5xl leading-[1.08] sm:text-6xl">
        {title}
      </h1>
      {lead && (
        <p data-hero className="mt-6 max-w-xl text-lg leading-relaxed text-tatami">
          {lead}
        </p>
      )}
      </div>
    </div>
  );
}
