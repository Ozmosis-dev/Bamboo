import type { Metadata } from "next";
import Image from "next/image";
import { getCopy } from "@content/index";
import { MarketFx } from "@/components/market/MarketFx";
import { MarketMap } from "@/components/market/MarketMap";
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
        <MarketFx />

        {/* Split composition: the door owns the right edge, full height */}
        <section className="relative border-b border-seam">
          <div className="grid lg:min-h-[86vh] lg:grid-cols-[1.08fr_1fr]">
            <div className="relative z-10 flex flex-col justify-between gap-16 px-5 pb-14 pt-16 sm:px-8 sm:pt-20 lg:pr-0 lg:pl-[max(2rem,calc((100vw-72rem)/2))]">
              <div>
                <div data-hero className="flex items-center gap-5">
                  <span aria-hidden className="h-px w-14 bg-verm" />
                  <p className="m-eyebrow">
                    Visit <span className="m-kanji font-normal">· 訪</span>
                  </p>
                </div>
                <h1
                  data-hero
                  className="m-serif mt-8 text-5xl leading-[1.04] sm:text-6xl lg:w-[135%] lg:text-7xl"
                >
                  Market Street,
                  <br />
                  after five.
                </h1>
              </div>

              <div data-hero>
                <p className="m-serif text-4xl leading-none sm:text-5xl">
                  <span className="text-price">423</span> Market St
                </p>
                <p className="m-caps mt-4 text-[12px] text-tatami">
                  Chattanooga, Tennessee · 37402
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-6">
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

              <div
                data-hero
                className="grid grid-cols-3 gap-6 border-t border-seam pt-7 lg:pr-16"
              >
                {location.hours.map((entry) => {
                  const [days, times] = formatHoursEntry(entry).split(": ");
                  return (
                    <div key={entry.days}>
                      <p className="m-eyebrow !text-[0.62rem]">{days}</p>
                      <p className="m-serif mt-2.5 text-lg leading-snug sm:text-xl">
                        {times.replace(/ pm/g, "")}
                        {times !== "Closed" && (
                          <span className="ml-1 text-sm text-tatami">pm</span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[52vh] lg:min-h-0">
              <span
                aria-hidden
                className="absolute left-0 top-0 z-10 hidden h-full w-[3px] bg-verm lg:block"
              />
              <Image
                src="/brand/hero-door.webp"
                alt="The vermilion front door on Market Street"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="m-photo object-cover object-[55%_32%]"
              />
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-gradient-to-r from-char/55 via-transparent to-transparent lg:block"
              />
              <p
                aria-hidden
                className="m-tategaki absolute right-5 top-8 z-10 text-base"
              >
                竹 · 灯
              </p>
            </div>
          </div>
        </section>

        {/* Washi: the neighborhood map, printed like an insert */}
        <section className="m-washi relative overflow-hidden border-y border-seam">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/textures/wave.webp"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -left-14 w-[560px] max-w-none opacity-[0.12] mix-blend-multiply"
            style={{ filter: "invert(1)" }}
          />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
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
