"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { telHref } from "@/lib/format";
import { MENU_HIDDEN } from "@/lib/flags";
import type { Location } from "@/lib/types";
import { Lockup } from "./Lockup";

const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit" },
  { href: "/contact", label: "Contact" },
].filter((item) => !(MENU_HIDDEN && item.href === "/menu"));

export function MarketHeader({ location }: { location: Location }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock scroll while the overlay is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div aria-hidden className="relative z-50 h-[3px] bg-verm" />
      <div className="relative z-50 border-b border-seam bg-char/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link
            href="/"
            aria-label={`${location.name} — home`}
            className="flex items-center gap-3.5 text-[15px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-mark-white.png"
              alt=""
              aria-hidden
              className="h-10 w-auto"
            />
            <Lockup />
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`m-caps group relative text-[12.5px] transition-colors ${
                        active ? "text-washi" : "text-tatami hover:text-washi"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={`absolute -bottom-1.5 left-0 h-px bg-gold-soft transition-all duration-300 ${
                          active ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
              <li>
                <a
                  href={telHref(location.phone)}
                  className="m-caps inline-block bg-verm px-5 py-2.5 text-[12.5px] text-washi transition-colors hover:bg-price"
                >
                  {location.phone}
                </a>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-6 bg-washi transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-washi transition-transform duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-char-deep transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div aria-hidden className="m-paper-dark" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/textures/wave.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 w-[560px] max-w-none -translate-x-1/2 opacity-[0.12]"
        />
        <nav aria-label="Mobile" className="relative flex h-full flex-col px-8 pt-28">
          <ul className="space-y-2">
            {nav.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
                className={`border-b border-seam transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="m-serif flex items-baseline justify-between py-5 text-3xl"
                >
                  {item.label}
                  <span aria-hidden className="m-eyebrow">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={telHref(location.phone)}
            style={{ transitionDelay: open ? "360ms" : "0ms" }}
            className={`m-caps mt-10 inline-block self-start bg-verm px-7 py-3.5 text-sm text-washi transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Call {location.phone}
          </a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-full-white.png"
            alt=""
            aria-hidden
            className="pointer-events-none mb-10 mt-auto w-36 self-end opacity-90"
          />
        </nav>
      </div>
    </header>
  );
}
