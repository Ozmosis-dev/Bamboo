import type { Metadata } from "next";
import Image from "next/image";
import { getCopy } from "@content/index";
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

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_auto]">
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
                <p className="m-serif mt-5 text-3xl leading-snug">
                  {location.address_line1}
                  <br />
                  {location.city}, {location.state} {location.zip}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-6">
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

              <div data-fx="rise" className="mt-14">
                <p className="m-eyebrow">Parking &amp; directions</p>
                <p className="mt-5 max-w-lg leading-relaxed text-tatami">
                  {copy.visitNotes}
                </p>
              </div>
            </div>

            <div
              data-fx="rise"
              className="relative hidden w-[360px] overflow-hidden border border-seam lg:block"
            >
              <Image
                src="/brand/hero-door.webp"
                alt="The vermilion front door on Market Street"
                fill
                sizes="360px"
                className="m-photo object-cover object-[62%_center]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-char/75 via-transparent to-char/20"
              />
              <p className="m-eyebrow absolute bottom-4 left-5 !text-[0.6rem]">
                Look for the red door
              </p>
            </div>
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
