import { formatHoursEntry, telHref } from "@/lib/format";
import type { Location } from "@/lib/types";

function PinIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function FollowIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" stroke="none">
      <path d="M13.4 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.3-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H8v2.8h2.4V21h3Z" />
    </svg>
  );
}

function Eyebrow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="m-eyebrow flex items-center gap-2.5">
      <span className="text-gold">{icon}</span>
      {children}
    </p>
  );
}

export function MarketFooter({
  location,
  sister,
}: {
  location: Location;
  sister: Location;
}) {
  return (
    <footer className="relative overflow-hidden border-t border-seam bg-char-deep">
      <p
        aria-hidden
        className="m-ghost-kanji absolute -right-10 -top-16 text-[22rem]"
      >
        竹
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/textures/wave.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-16 w-[640px] max-w-none opacity-[0.08]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[auto_1fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-full-white.png"
            alt={location.name}
            className="h-36 w-auto"
          />
        </div>

        <div>
          <Eyebrow icon={<PinIcon />}>Find us</Eyebrow>
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
          <Eyebrow icon={<ClockIcon />}>Hours</Eyebrow>
          <ul className="mt-4 space-y-1.5 text-tatami">
            {location.hours.map((entry) => (
              <li key={entry.days}>{formatHoursEntry(entry)}</li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow icon={<FollowIcon />}>Follow</Eyebrow>
          <ul className="mt-4 space-y-2.5">
            {location.social.instagram && (
              <li>
                <a
                  href={location.social.instagram}
                  className="flex items-center gap-2.5 text-tatami hover:text-washi"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              </li>
            )}
            {location.social.facebook && (
              <li>
                <a
                  href={location.social.facebook}
                  className="flex items-center gap-2.5 text-tatami hover:text-washi"
                >
                  <FacebookIcon />
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

      <div className="relative">
        <div aria-hidden className="h-[3px] bg-verm" />
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <p className="m-caps text-[10.5px] text-tatami/90">
            © {new Date().getFullYear()} {location.name}
          </p>
          <p aria-hidden className="m-kanji text-sm tracking-[0.35em] text-verm">
            竹 灯 味
          </p>
        </div>
      </div>
    </footer>
  );
}
