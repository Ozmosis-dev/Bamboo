import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { MenuBrowser } from "@/components/MenuBrowser";
import { MarketMenu } from "@/components/market/MarketMenu";
import { getCurrentLocation, currentLocationSlug } from "@/lib/location";
import { getMenuForLocation } from "@/lib/menu";
import { menuJsonLd, pageMetadata } from "@/lib/seo";
import { MENU_HIDDEN } from "@/lib/flags";
import { redirect } from "next/navigation";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  if (MENU_HIDDEN) return {};
  const location = await getCurrentLocation();
  return pageMetadata(location, {
    title: "Menu",
    description: `Full menu at ${location.name} in ${location.city} — sushi, hot food, cocktails, sake, and beer, with prices and dietary options.`,
    path: "/menu",
  });
}

export default async function MenuPage() {
  // Temporary 307 home while hidden, so indexed /menu links don't 404.
  if (MENU_HIDDEN) redirect("/");
  const slug = currentLocationSlug();
  const [location, menu] = await Promise.all([
    getCurrentLocation(),
    getMenuForLocation(slug),
  ]);

  if (slug === "chattanooga") {
    return (
      <>
        <JsonLd data={menuJsonLd(location, menu)} />
        <section className="m-verm relative overflow-hidden">
          <span
            aria-hidden
            className="m-kanji absolute -top-7 right-2 text-[7.5rem] leading-none text-washi opacity-15 sm:right-10"
          >
            献立
          </span>
          <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-10 gap-y-4 px-5 py-8 sm:px-8">
            <div>
              <h1 className="m-serif text-4xl sm:text-5xl">Menu</h1>
              <p className="m-caps mt-2 text-[10.5px] text-washi/85">
                Dinner · changes with the fish
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  ["/menus/bamboo-food-menu.pdf", "Food PDF"],
                  ["/menus/bamboo-drinks-menu.pdf", "Drinks PDF"],
                ] as const
              ).map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="m-caps inline-flex items-center gap-2.5 border border-washi/50 px-4 py-2.5 text-[11px] text-washi transition-colors hover:border-washi hover:bg-washi/10"
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
        </section>
        <div className="relative pb-10">
          <div aria-hidden className="m-paper-dark" />
          <div className="relative">
            <MarketMenu menu={menu} />
          </div>
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
