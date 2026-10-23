import type { Metadata } from "next";
import Link from "next/link";
import { getCopy } from "@content/index";
import { MarketHome } from "@/components/market/MarketHome";
import { getSiteContent } from "@/lib/content";
import { getSiteImages } from "@/lib/images";
import { formatHoursEntry, formatPrice, telHref } from "@/lib/format";
import { getCurrentLocation, getSisterLocation, currentLocationSlug } from "@/lib/location";
import { getMenuForLocation } from "@/lib/menu";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const location = await getCurrentLocation();
  return pageMetadata(location, {
    description: `${location.name} — sushi and Japanese kitchen at ${location.address_line1}, ${location.city}, ${location.state}. Fresh fish, hot bowls, sake, and cocktails.`,
    path: "/",
  });
}

export default async function HomePage() {
  const slug = currentLocationSlug();
  const copy = getCopy(slug);
  const [location, sister, menu] = await Promise.all([
    getCurrentLocation(),
    getSisterLocation(),
    getMenuForLocation(slug),
  ]);

  if (slug === "chattanooga") {
    const [content, siteImages] = await Promise.all([
      getSiteContent(slug),
      getSiteImages(),
    ]);
    return (
      <MarketHome
        content={content}
        location={location}
        sister={sister}
        menu={menu}
        images={siteImages.slots}
        gallery={siteImages.gallery}
      />
    );
  }

  // Featured highlights: first item of each section, up to 4.
  const highlights = menu.slice(0, 4).flatMap((s) => s.items.slice(0, 1));

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="py-16 sm:py-24">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-bamboo-800 sm:text-5xl">
          {copy.hero.heading}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">{copy.hero.subheading}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="rounded-full bg-bamboo-700 px-5 py-2.5 font-medium text-white hover:bg-bamboo-800"
          >
            See the menu
          </Link>
          <a
            href={telHref(location.phone)}
            className="rounded-full border border-line px-5 py-2.5 font-medium text-ink hover:border-bamboo-600"
          >
            Call {location.phone}
          </a>
        </div>
      </section>

      <section className="border-t border-line py-12">
        <p className="max-w-2xl text-ink-soft">{copy.intro}</p>
      </section>

      <section className="border-t border-line py-12">
        <h2 className="text-xl font-semibold text-bamboo-800">From the menu</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {highlights.map((item) => (
            <li key={item.id} className="rounded-lg border border-line p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{item.name}</h3>
                <p className="shrink-0 text-sm font-medium tabular-nums">
                  {formatPrice(item)}
                </p>
              </div>
              {item.description && (
                <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
              )}
            </li>
          ))}
        </ul>
        <Link href="/menu" className="mt-4 inline-block text-sm font-medium text-bamboo-700 underline">
          Full menu →
        </Link>
      </section>

      <section className="grid gap-8 border-t border-line py-12 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-bamboo-800">Hours</h2>
          <ul className="mt-3 space-y-1 text-ink-soft">
            {location.hours.map((entry) => (
              <li key={entry.days}>{formatHoursEntry(entry)}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-bamboo-800">Find us</h2>
          <p className="mt-3 text-ink-soft">
            {location.address_line1}
            <br />
            {location.city}, {location.state} {location.zip}
          </p>
          {location.map_url && (
            <a
              href={location.map_url}
              className="mt-2 inline-block text-sm font-medium text-bamboo-700 underline"
            >
              Open in Maps
            </a>
          )}
          <p className="mt-6 text-sm text-ink-soft">
            In {sister.city}? Visit our sister restaurant,{" "}
            <a href={`https://${sister.domain}`} className="underline">
              {sister.name}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
