import { formatHoursEntry, telHref } from "@/lib/format";
import type { Location } from "@/lib/types";

export function Footer({
  location,
  sister,
}: {
  location: Location;
  sister: Location;
}) {
  return (
    <footer className="mt-16 border-t border-line bg-bamboo-50">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm text-ink-soft sm:grid-cols-3">
        <div>
          <p className="font-semibold text-ink">{location.name}</p>
          <p>
            {location.address_line1}
            <br />
            {location.city}, {location.state} {location.zip}
          </p>
          <p className="mt-2">
            <a href={telHref(location.phone)} className="hover:text-ink">
              {location.phone}
            </a>
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink">Hours</p>
          <ul className="mt-1 space-y-0.5">
            {location.hours.map((entry) => (
              <li key={entry.days}>{formatHoursEntry(entry)}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink">Follow</p>
          <ul className="mt-1 space-y-0.5">
            {location.social.instagram && (
              <li>
                <a href={location.social.instagram} className="hover:text-ink">
                  Instagram
                </a>
              </li>
            )}
            {location.social.facebook && (
              <li>
                <a href={location.social.facebook} className="hover:text-ink">
                  Facebook
                </a>
              </li>
            )}
          </ul>
          <p className="mt-4">
            Also visit{" "}
            <a href={`https://${sister.domain}`} className="underline hover:text-ink">
              {sister.name} — {sister.city}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
