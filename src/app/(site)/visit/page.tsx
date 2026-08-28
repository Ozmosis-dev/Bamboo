import type { Metadata } from "next";
import { getCopy } from "@content/index";
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
  const location = await getCurrentLocation();
  const copy = getCopy(currentLocationSlug());

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
