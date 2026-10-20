import type { Metadata } from "next";
import { MarketMarquee } from "@/components/market/MarketMarquee";
import { MarketPageHeader } from "@/components/market/MarketPage";
import { formatHoursEntry, telHref } from "@/lib/format";
import { getCurrentLocation, currentLocationSlug } from "@/lib/location";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const location = await getCurrentLocation();
  return pageMetadata(location, {
    title: "Contact",
    description: `Call or find ${location.name} in ${location.city}, ${location.state}. Phone, address, hours, and social links.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const location = await getCurrentLocation();

  if (currentLocationSlug() === "chattanooga") {
    return (
      <>
        <MarketPageHeader
          eyebrow="Contact"
          kanji="連絡 · 竹"
          title="Pick up the phone."
          lead="No reservation system, no forms — the fastest way to reach us is a call. We'll pick up between prep and service."
        />

        {/* Vermilion: the number IS the page */}
        <section className="m-verm relative mt-16 overflow-hidden border-y border-seam">
          <span
            aria-hidden
            className="m-kanji absolute -bottom-20 -right-6 text-[18rem] leading-none text-washi opacity-10"
          >
            電
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/textures/wave.webp"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-8 -left-12 w-[720px] max-w-none opacity-[0.13]"
          />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <p data-fx="rise" className="m-eyebrow">
              By phone · Tue–Sat
            </p>
            <a
              data-fx="rise"
              href={telHref(location.phone)}
              className="group mt-6 block"
            >
              <span className="m-serif block text-[13vw] leading-none transition-transform duration-300 group-hover:translate-x-3 sm:text-7xl lg:text-8xl">
                {location.phone}
              </span>
              <span className="m-caps mt-6 inline-flex items-center gap-3 text-[12px] text-washi/90">
                Tap to call
                <span
                  aria-hidden
                  className="h-px w-10 bg-washi/70 transition-all duration-300 group-hover:w-16"
                />
              </span>
            </a>
          </div>
        </section>

        {/* From the kitchen: seamless marquee */}
        <MarketMarquee />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <h1 className="pt-10 text-3xl font-semibold tracking-tight text-bamboo-800">
        Contact
      </h1>

      <p className="mt-6 text-lg text-ink-soft">
        The fastest way to reach us is by phone.
      </p>
      <a
        href={telHref(location.phone)}
        className="mt-4 inline-block rounded-full bg-bamboo-700 px-5 py-2.5 font-medium text-white hover:bg-bamboo-800"
      >
        Call {location.phone}
      </a>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bamboo-800">Address</h2>
        <p className="mt-3 text-ink-soft">
          {location.address_line1}
          <br />
          {location.city}, {location.state} {location.zip}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bamboo-800">Hours</h2>
        <ul className="mt-3 space-y-1 text-ink-soft">
          {location.hours.map((entry) => (
            <li key={entry.days}>{formatHoursEntry(entry)}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bamboo-800">Social</h2>
        <ul className="mt-3 space-y-1">
          {location.social.instagram && (
            <li>
              <a href={location.social.instagram} className="text-bamboo-700 underline">
                Instagram
              </a>
            </li>
          )}
          {location.social.facebook && (
            <li>
              <a href={location.social.facebook} className="text-bamboo-700 underline">
                Facebook
              </a>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
