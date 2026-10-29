"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Location } from "@/lib/types";
import type { SiteContent } from "@/lib/content";
import FloorPlanViewer from "./floorplan/FloorPlanViewer";
import { MarketMap } from "./MarketMap";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Pre-opening panel above the homepage hero (COMING_SOON flag).
 *
 * A full-viewport announcement — construction note, target open date — over
 * the real Market St block (aerial photo, filtered into the site palette and
 * feathered into the background), with the storefront render opening the
 * live, orbitable 3D room in a lightbox. The neighborhood map continues in
 * the same dark room directly beneath, rising in on scroll, so announcement
 * and map read as one piece. Delete by flipping the flag.
 */
export function ComingSoon({
  content,
  location,
  poster,
  backdrop,
}: {
  content: SiteContent;
  location: Location;
  poster: string;
  backdrop: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const panel = wrap.querySelector("[data-cs-panel]");
        if (!panel) return;

        // Load reveal, after the intro curtain hands off (same contract as
        // MarketFx's [data-hero] reveal).
        let introCleanup: (() => void) | undefined;
        const els = gsap.utils.toArray<HTMLElement>("[data-cs]", wrap);
        const reveal = gsap.fromTo(
          els,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "all",
            paused: true,
          }
        );
        const introEl = document.querySelector("[data-intro]");
        if (introEl && !introEl.hasAttribute("data-intro-done")) {
          const start = () => reveal.play();
          window.addEventListener("bamboo:intro-done", start, { once: true });
          introCleanup = () =>
            window.removeEventListener("bamboo:intro-done", start);
        } else {
          reveal.play();
        }

        // Gentle parallax on the aerial backdrop as the panel scrolls away.
        gsap.to("[data-cs-bg]", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Map section rises in as it enters, continuing the same room.
        const mapEls = gsap.utils.toArray<HTMLElement>("[data-cs-m]", wrap);
        if (mapEls.length) {
          gsap.fromTo(
            mapEls,
            { y: 44, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.14,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: "[data-cs-map]",
                start: "top 78%",
                once: true,
              },
            }
          );
        }

        return () => introCleanup?.();
      });
      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  // Lightbox: lock the page scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative bg-char-deep">
      <section
        data-cs-panel
        className="relative flex min-h-dvh flex-col overflow-hidden"
        aria-label="Opening soon"
      >
        {/* the real block on Market St, filtered into the site's lacquer-and-
            candlelight palette and feathered out before the next section */}
        <div
          aria-hidden
          data-cs-bg
          className="pointer-events-none absolute inset-x-0 -top-[6%] h-[106%]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 30%, rgba(0,0,0,0.5) 68%, transparent 96%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 30%, rgba(0,0,0,0.5) 68%, transparent 96%)",
          }}
        >
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
            style={{
              filter:
                "grayscale(0.55) sepia(0.38) brightness(0.52) contrast(1.08) saturate(1.15)",
            }}
          />
          <div aria-hidden className="m-paper-dark" />
        </div>
        {/* candlelit vignette over the photo, echoing the model viewer's stage */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 70% at 62% 38%, rgba(21,18,16,0.55) 0%, rgba(15,14,13,0.86) 78%)",
          }}
        />
        {/* ghost crest behind the composition */}
        <p
          aria-hidden
          className="m-ghost-kanji pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] text-[22rem] leading-none sm:text-[30rem]"
        >
          竹
        </p>
        <p
          aria-hidden
          className="m-tategaki absolute left-5 top-28 hidden text-lg lg:block"
        >
          近日開店
        </p>
        <p
          aria-hidden
          className="m-tategaki absolute right-5 top-28 hidden text-lg lg:block"
        >
          鮨 · 竹 · 灯
        </p>

        <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-10 pt-20 text-center sm:px-8">
          <div data-cs className="flex flex-col items-center gap-4">
            <span aria-hidden className="h-10 w-px bg-gradient-to-b from-transparent to-verm" />
            <p className="m-eyebrow">
              Under construction <span className="m-kanji font-normal">· 建設中</span>
            </p>
          </div>

          <h2
            data-cs
            className="m-serif mt-7 max-w-3xl text-balance text-4xl leading-[1.12] sm:text-6xl"
          >
            {content.coming_heading}
          </h2>

          <p
            data-cs
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-tatami sm:text-lg"
          >
            {content.coming_subheading}
          </p>

          {/* the room on its plinth — a wide still that opens the live model */}
          <div data-cs className="mt-10 w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative block w-full overflow-hidden border border-seam transition-colors hover:border-gold"
              aria-haspopup="dialog"
            >
              <span className="relative block aspect-[2/1] w-full">
                <Image
                  src={poster}
                  alt="Rendering of the Bamboo on Market storefront on Market Street"
                  fill
                  priority
                  sizes="(min-width: 640px) 42rem, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-char-deep/80 via-transparent to-char-deep/35"
                />
                {/* gold corner ticks */}
                {(
                  [
                    "left-3 top-3 border-l border-t",
                    "right-3 top-3 border-r border-t",
                    "bottom-3 left-3 border-b border-l",
                    "bottom-3 right-3 border-b border-r",
                  ] as const
                ).map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`absolute h-4 w-4 border-gold/60 transition-colors duration-300 group-hover:border-gold ${pos}`}
                  />
                ))}
              </span>
              <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-5">
                <span className="m-eyebrow !text-[0.6rem]">
                  The room <span className="m-kanji font-normal">· 間取り</span>
                </span>
                <span className="m-caps inline-flex items-center gap-3.5 bg-verm px-6 py-3 text-[12px] text-washi transition-colors group-hover:bg-price">
                  <span aria-hidden className="m-cube shrink-0">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </span>
                  Step inside the 3D render
                  <span
                    aria-hidden
                    className="h-px w-6 bg-washi/70 transition-all duration-300 group-hover:w-10"
                  />
                </span>
              </span>
            </button>
          </div>

          {/* opening-date line, set like a theatre bill */}
          <div
            data-cs
            className="mt-8 flex flex-col items-center gap-1.5 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="m-eyebrow !text-[0.6rem]">Opening</span>
            <span className="m-serif text-2xl text-gold-soft">
              {content.coming_open_date}
            </span>
          </div>
        </div>

        {/* scroll cue */}
        <div
          data-cs
          aria-hidden
          className="relative mx-auto flex flex-col items-center gap-3 pb-7"
        >
          <p className="m-caps text-[10px] text-tatami/70">Scroll</p>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ---------------------------------------------- 3D room lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Interactive 3D model of the restaurant"
          className="fixed inset-0 z-[120] bg-char-deep"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 70% at 50% 30%, rgba(43,37,32,0.9) 0%, var(--color-char-deep) 75%)",
            }}
          />
          <div className="absolute inset-0">
            <FloorPlanViewer />
          </div>

          <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-start justify-between px-5 pt-6 sm:px-8">
            <div>
              <p className="m-eyebrow !text-[0.6rem]">
                {location.address_line1} · {location.city}
              </p>
              <p className="m-serif mt-1.5 text-xl tracking-[0.08em]">
                The Room <span className="m-kanji text-sm text-gold">· 間取り</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="m-caps pointer-events-auto inline-flex items-center gap-3 border border-seam px-4 py-2.5 text-[11px] text-washi transition-colors hover:border-gold hover:text-gold-soft"
            >
              Close
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          </header>

          <footer className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-5">
            <p className="m-caps text-[10px] text-tatami/70">
              Drag to orbit · Scroll to zoom · Right-drag to pan
            </p>
          </footer>
        </div>
      )}

      {/* ------------------------------------------ neighborhood map */}
      <section
        data-cs-map
        aria-label="Map to the restaurant"
        className="relative px-5 pb-24 pt-2 sm:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div data-cs-m className="flex flex-col items-center text-center">
            <span aria-hidden className="h-10 w-px bg-gradient-to-b from-transparent to-gold" />
            <p className="m-eyebrow mt-4">
              Where we are <span className="m-kanji font-normal">· 所在地</span>
            </p>
            <h2 className="m-serif mt-5 text-balance text-3xl sm:text-4xl">
              {content.coming_map_heading}
            </h2>
            <p className="m-caps mt-3 text-[11px] text-tatami">
              {location.address_line1} · {location.city}
            </p>
          </div>
          <div data-cs-m className="mt-10">
            <MarketMap variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
