import type { Metadata } from "next";
import Image from "next/image";
import { getCopy } from "@content/index";
import { MarketMap } from "@/components/market/MarketMap";
import { MarketPageHeader } from "@/components/market/MarketPage";
import { formatHoursEntry, telHref } from "@/lib/format";
import { getCurrentLocation, currentLocationSlug } from "@/lib/location";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const location = await getCurrentLocation();
  return pageMetadata(location, {
    title: "Visit",
    description: `Hours, address, parking, and directions for ${location.name} at ${location.address_line1}, ${location.city}, ${location.state}.`,
    path: "/visit",
  });
}

const LANDMARKS = [
  { name: "Creative Discovery Museum", note: "around the corner" },
  { name: "Tennessee Aquarium", note: "straight up Market" },
  { name: "Ross's Landing & Riverwalk", note: "on the riverfront" },
  { name: "Walnut Street Bridge", note: "a longer stroll east" },
];

export default async function VisitPage() {
  const slug = currentLocationSlug();
  const location = await getCurrentLocation();
  const copy = getCopy(slug);

  if (slug === "chattanooga") {
    return (
      <>
        <MarketPageHeader
          eyebrow="Visit"
          kanji="訪 · 竹"
          title="Market Street, after five."
        />

        {/* Dark: the essentials beside the door */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_400px]">
            <div className="max-w-xl">
              <div data-fx="rise">
                <p className="m-eyebrow">Hours</p>
                <ul className="mt-6">
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

              <div data-fx="rise" className="mt-14">
                <p className="m-eyebrow">Address</p>
                <p className="m-serif mt-5 text-3xl leading-snug sm:text-4xl">
                  {location.address_line1}
                  <br />
                  {location.city}, {location.state} {location.zip}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  {location.map_url && (
                    <a
                      href={location.map_url}
                      className="m-caps bg-verm px-7 py-3.5 text-[12px] text-washi transition-colors hover:bg-price"
                    >
                      Open in Maps
                    </a>
                  )}
                  <a
                    href={telHref(location.phone)}
                    className="m-caps group inline-flex items-center gap-3 text-[12px] text-washi/90 hover:text-washi"
                  >
                    {location.phone}
                    <span
                      aria-hidden
                      className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-12"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-5">
              <div data-fx="rise" className="overflow-hidden border border-seam">
                <Image
                  src="/brand/hero-door.webp"
                  alt="The vermilion front door on Market Street"
                  width={800}
                  height={600}
                  className="m-photo aspect-[4/3] w-full object-cover object-[62%_38%]"
                />
              </div>
              <div data-fx="rise" className="overflow-hidden border border-seam">
                <Image
                  src="/photos/counter.webp"
                  alt="Inside: the sushi counter under bamboo slats"
                  width={800}
                  height={600}
                  className="m-photo aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Washi: the neighborhood map, printed like an insert */}
        <section className="m-washi border-y border-seam">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
              <div data-fx="rise">
                <div className="flex items-center gap-5">
                  <span aria-hidden className="h-px w-14 bg-verm" />
                  <p className="m-eyebrow">
                    The neighborhood <span className="m-kanji font-normal">· 街</span>
                  </p>
                </div>
                <h2 className="m-serif mt-6 text-3xl leading-tight sm:text-4xl">
                  Four blocks from the river.
                </h2>
                <p className="m-soft mt-6 text-base leading-relaxed">
                  Everything worth walking to is a short stroll up Market
                  Street. Look for the stars.
                </p>
                <ul className="mt-10">
                  {LANDMARKS.map((l) => (
                    <li
                      key={l.name}
                      className="flex items-baseline gap-4 border-b border-[#d8cdbb] py-3.5"
                    >
                      <span aria-hidden className="text-[#8a6f2f]">✦</span>
                      <span className="m-caps flex-1 text-[11.5px] text-[#262019]">
                        {l.name}
                      </span>
                      <span className="m-soft text-xs">{l.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div data-fx="rise" className="min-w-0">
                <div className="overflow-x-auto">
                  <div className="min-w-[560px]">
                    <MarketMap variant="paper" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vermilion: parking */}
        <section className="m-verm relative overflow-hidden">
          <span
            aria-hidden
            className="m-kanji absolute -right-6 -top-12 text-[13rem] leading-none text-washi opacity-10"
          >
            車
          </span>
          <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-18 sm:px-8 sm:py-20 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
            <p data-fx="rise" className="m-serif text-3xl sm:text-4xl">
              Parking
            </p>
            <p data-fx="rise" className="max-w-2xl text-lg leading-relaxed text-washi/90">
              {copy.visitNotes}
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <h1 className="pt-10 text-3xl font-semibold tracking-tight text-bamboo-800">
        Visit {location.name}
      </h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-bamboo-800">Hours</h2>
        <table className="mt-3 w-full max-w-sm text-left">
          <tbody>
            {location.hours.map((entry) => {
              const [days, times] = formatHoursEntry(entry).split(": ");
              return (
                <tr key={entry.days} className="border-b border-line">
                  <th scope="row" className="py-2 pr-6 font-medium">
                    {days}
                  </th>
                  <td className="py-2 text-ink-soft">{times}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bamboo-800">Address</h2>
        <p className="mt-3 text-ink-soft">
          {location.address_line1}
          <br />
          {location.city}, {location.state} {location.zip}
        </p>
        <p className="mt-2">
          <a href={telHref(location.phone)} className="text-bamboo-700 underline">
            {location.phone}
          </a>
        </p>
        {location.map_url && (
          <a
            href={location.map_url}
            className="mt-4 inline-block rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-bamboo-600"
          >
            Open in Google Maps
          </a>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bamboo-800">
          Parking &amp; directions
        </h2>
        <p className="mt-3 text-ink-soft">{copy.visitNotes}</p>
      </section>
    </div>
  );
}
