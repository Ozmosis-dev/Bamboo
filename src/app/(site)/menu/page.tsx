import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { MenuBrowser } from "@/components/MenuBrowser";
import { MarketMenu } from "@/components/market/MarketMenu";
import { getCurrentLocation, currentLocationSlug } from "@/lib/location";
import { getMenuForLocation } from "@/lib/menu";
import { menuJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const location = await getCurrentLocation();
  return pageMetadata(location, {
    title: "Menu",
    description: `Full menu at ${location.name} in ${location.city} — sushi, hot food, cocktails, sake, and beer, with prices and dietary options.`,
    path: "/menu",
  });
}

export default async function MenuPage() {
  const slug = currentLocationSlug();
  const [location, menu] = await Promise.all([
    getCurrentLocation(),
    getMenuForLocation(slug),
  ]);

  if (slug === "chattanooga") {
    return (
      <>
        <JsonLd data={menuJsonLd(location, menu)} />
        <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
          <div className="flex items-center gap-5">
            <span aria-hidden className="h-px w-14 bg-verm" />
            <p className="m-eyebrow">The Menu · 献立</p>
          </div>
          <h1 className="m-serif mt-5 text-5xl sm:text-6xl">Menu</h1>
          <p className="mt-4 max-w-xl leading-relaxed text-tatami">
            Served at {location.name}, {location.city}. Items and prices change
            with the fish.
          </p>
        </div>
        <div className="pb-10">
          <MarketMenu menu={menu} />
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <JsonLd data={menuJsonLd(location, menu)} />
      <h1 className="pt-10 text-3xl font-semibold tracking-tight text-bamboo-800">
        Menu
      </h1>
      <p className="mt-2 pb-6 text-ink-soft">
        Served at {location.name}, {location.city}. Menu items and prices are
        updated regularly.
      </p>
      <MenuBrowser menu={menu} />
      <p className="mt-12 border-t border-line pt-4 text-xs text-ink-soft">
        *Consuming raw or undercooked meats, poultry, seafood, or shellfish may
        increase risk of foodborne illness.
      </p>
    </div>
  );
}
