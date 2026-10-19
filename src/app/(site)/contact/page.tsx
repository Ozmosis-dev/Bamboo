import type { Metadata } from "next";
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

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <a
            data-fx="rise"
            href={telHref(location.phone)}
            className="group flex flex-col gap-2 border-y border-seam py-10 transition-colors hover:border-gold/50 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <span className="m-serif text-4xl transition-transform duration-300 group-hover:translate-x-2 sm:text-6xl">
              {location.phone}
            </span>
            <span className="m-caps inline-flex items-center gap-3 text-[12px] text-gold-soft">
              Call us
              <span
                aria-hidden
                className="h-px w-10 bg-gold transition-all duration-300 group-hover:w-16"
              />
            </span>
          </a>

          <div data-fx-group className="mt-16 grid gap-12 sm:grid-cols-3">
            <div>
              <p className="m-eyebrow">Address</p>
              <p className="mt-5 leading-relaxed text-tatami">
                {location.address_line1}
                <br />
                {location.city}, {location.state} {location.zip}
              </p>
            </div>
            <div>
              <p className="m-eyebrow">Hours</p>
              <ul className="mt-5 space-y-1.5 text-tatami">
                {location.hours.map((entry) => (
                  <li key={entry.days}>{formatHoursEntry(entry)}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="m-eyebrow">Follow</p>
              <ul className="mt-5 space-y-1.5">
                {location.social.instagram && (
                  <li>
                    <a
                      href={location.social.instagram}
                      className="text-tatami hover:text-washi"
                    >
                      Instagram
                    </a>
                  </li>
                )}
                {location.social.facebook && (
                  <li>
                    <a
                      href={location.social.facebook}
                      className="text-tatami hover:text-washi"
                    >
                      Facebook
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
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
