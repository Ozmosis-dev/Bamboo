import type { Metadata } from "next";
import { MENU_HIDDEN } from "@/lib/flags";
import { siteUrl } from "@/lib/location";
import { isClosedEntry } from "@/lib/format";
import type { Location, LocationSlug, ResolvedMenuSection } from "@/lib/types";

/* Coordinates are static per location (addresses effectively never change).
 * Placeholder values until the real Chattanooga address is confirmed. */
const GEO: Record<LocationSlug, { latitude: number; longitude: number }> = {
  birmingham: { latitude: 33.5186, longitude: -86.8073 },
  chattanooga: { latitude: 35.0485, longitude: -85.3097 },
};

const CITY_DESCRIPTOR: Record<LocationSlug, string> = {
  birmingham: "Sushi & Japanese Kitchen in Birmingham, AL",
  chattanooga: "Asian Fusion Restaurant in Chattanooga, TN",
};

const CUISINES: Record<LocationSlug, string[]> = {
  birmingham: ["Japanese", "Sushi"],
  chattanooga: ["Asian Fusion", "Asian", "Sushi"],
};

export function pageMetadata(
  location: Location,
  {
    title,
    description,
    path,
  }: { title?: string; description: string; path: string }
): Metadata {
  const base = siteUrl(location);
  const fullTitle = title
    ? `${title} | ${location.name} — ${CITY_DESCRIPTOR[location.slug]}`
    : `${location.name} — ${CITY_DESCRIPTOR[location.slug]}`;
  return {
    metadataBase: new URL(base),
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: location.name,
      type: "website",
      locale: "en_US",
    },
  };
}

/** Weekly hours as schema.org OpeningHoursSpecification. Day ranges in the
 * hours JSON use 'Mon–Thu' style labels; map them to schema day URIs. */
const DAY_MAP: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function expandDays(days: string): string[] {
  const normalized = days.toLowerCase().replace(/\s/g, "");
  const [start, end] = normalized.split(/[–-]/);
  if (!end) {
    return DAY_MAP[start] ? [DAY_MAP[start]] : [];
  }
  const from = DAY_ORDER.indexOf(start);
  const to = DAY_ORDER.indexOf(end);
  if (from === -1 || to === -1) return [];
  return DAY_ORDER.slice(from, to + 1).map((d) => DAY_MAP[d]);
}

function openingHours(location: Location) {
  return location.hours
    .filter((entry) => !isClosedEntry(entry))
    .map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: expandDays(entry.days),
      opens: entry.open,
      closes: entry.close,
    }));
}

export function restaurantJsonLd(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl(location)}/#restaurant`,
    name: location.name,
    url: siteUrl(location),
    telephone: location.phone,
    servesCuisine: CUISINES[location.slug],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address_line1,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      ...GEO[location.slug],
    },
    openingHoursSpecification: openingHours(location),
    sameAs: [location.social.instagram, location.social.facebook].filter(Boolean),
    ...(MENU_HIDDEN ? {} : { hasMenu: `${siteUrl(location)}/menu` }),
  };
}

/** Menu schema built from the same resolved menu the page renders, so displayed
 * and structured-data prices can never disagree. */
export function menuJsonLd(location: Location, menu: ResolvedMenuSection[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${siteUrl(location)}/menu#menu`,
    name: `${location.name} Menu`,
    inLanguage: "en-US",
    hasMenuSection: menu.map((section) => ({
      "@type": "MenuSection",
      name: section.category.name,
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        ...(item.price !== null
          ? {
              offers: {
                "@type": "Offer",
                price: item.price.toFixed(2),
                priceCurrency: "USD",
              },
            }
          : {}),
      })),
    })),
  };
}
