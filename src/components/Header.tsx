import Link from "next/link";
import { telHref } from "@/lib/format";
import { MENU_HIDDEN } from "@/lib/flags";
import type { Location } from "@/lib/types";

const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit" },
  { href: "/contact", label: "Contact" },
].filter((item) => !(MENU_HIDDEN && item.href === "/menu"));

export function Header({ location }: { location: Location }) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-bamboo-800">
          {location.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-4 text-sm sm:gap-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={telHref(location.phone)}
                className="rounded-full bg-bamboo-700 px-3 py-1.5 font-medium text-white hover:bg-bamboo-800"
              >
                <span className="sm:hidden">Call</span>
                <span className="hidden sm:inline">{location.phone}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
