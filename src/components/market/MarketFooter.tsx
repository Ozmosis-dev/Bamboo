import { formatHoursEntry, telHref } from "@/lib/format";
import type { Location } from "@/lib/types";
import { Lockup } from "./Lockup";

export function MarketFooter({
  location,
  sister,
}: {
  location: Location;
  sister: Location;
}) {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-seam bg-char-deep">
      <p
        aria-hidden
        className="m-ghost-kanji absolute -right-10 -top-16 text-[22rem]"
      >
        竹
      </p>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[auto_1fr_1fr_1fr]">
        <div className="text-xl">
          <Lockup />
        </div>

        <div>
          <p className="m-eyebrow">Find us</p>
          <p className="mt-4 leading-relaxed text-tatami">
            {location.address_line1}
            <br />
            {location.city}, {location.state} {location.zip}
          </p>
          <p className="mt-3">
            <a
              href={telHref(location.phone)}
              className="text-washi underline decoration-seam underline-offset-4 hover:decoration-gold-soft"
            >
              {location.phone}
            </a>
          </p>
          {location.map_url && (
            <a
              href={location.map_url}
              className="m-caps mt-4 inline-block border-b border-gold pb-1 text-xs text-gold-soft hover:text-washi"
            >
              Open in Maps
            </a>
          )}
        </div>

        <div>
          <p className="m-eyebrow">Hours</p>
          <ul className="mt-4 space-y-1.5 text-tatami">
            {location.hours.map((entry) => (
              <li key={entry.days}>{formatHoursEntry(entry)}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="m-eyebrow">Follow</p>
          <ul className="mt-4 space-y-1.5">
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
          <p className="mt-6 text-sm text-tatami">
            In {sister.city}?{" "}
            <a
              href={`https://${sister.domain}`}
              className="text-washi underline decoration-seam underline-offset-4 hover:decoration-gold-soft"
            >
              {sister.name}
            </a>
          </p>
        </div>
      </div>

      <div className="relative border-t border-seam">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <p className="text-xs text-tatami/80">
            © {new Date().getFullYear()} {location.name}
          </p>
          <p aria-hidden className="m-serif text-sm tracking-[0.35em] text-verm">
            竹 灯 味
          </p>
        </div>
      </div>
    </footer>
  );
}
