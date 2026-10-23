"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Menu" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/locations", label: "Hours & Info" },
  { href: "/admin/content", label: "Page Content" },
  { href: "/admin/photos", label: "Photos" },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="-mb-px flex gap-1 overflow-x-auto">
      {nav.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-bamboo-700 text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
