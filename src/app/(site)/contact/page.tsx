import type { Metadata } from "next";
import { formatHoursEntry, telHref } from "@/lib/format";
import { getCurrentLocation } from "@/lib/location";
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
