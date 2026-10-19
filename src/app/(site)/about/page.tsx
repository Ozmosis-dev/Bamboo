import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCopy } from "@content/index";
import { MarketPageHeader } from "@/components/market/MarketPage";
import { getCurrentLocation, getSisterLocation, currentLocationSlug } from "@/lib/location";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const location = await getCurrentLocation();
  return pageMetadata(location, {
    title: "About",
    description: `The story behind ${location.name} in ${location.city}, ${location.state} — one kitchen philosophy, two cities.`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const slug = currentLocationSlug();
  const copy = getCopy(slug);
  const location = await getCurrentLocation();

  if (slug === "chattanooga") {
    const sister = await getSisterLocation();
    return (
      <>
        <MarketPageHeader
          eyebrow="Our story"
          kanji="物語 · 竹"
          title="One kitchen, two cities."
        />

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div data-fx="rise" className="space-y-8">
              <p className="m-serif text-2xl leading-relaxed sm:text-[1.7rem]">
                {copy.about.shared}
              </p>
              <p className="max-w-xl text-lg leading-relaxed text-tatami">
                {copy.about.local}
              </p>
            </div>
            <div data-fx="rise" className="relative overflow-hidden border border-seam">
              <Image
                src="/photos/nigiri.webp"
                alt="Nigiri and rolls from the counter"
                width={680}
                height={510}
                className="m-photo w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-char/70 via-transparent to-transparent"
              />
              <p className="m-eyebrow absolute bottom-4 left-5 !text-[0.6rem]">
                Cut to order · 握り
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-seam bg-char-deep m-seigaiha">
          <p
            aria-hidden
            className="m-ghost-kanji absolute -right-6 -top-10 text-[16rem]"
          >
            竹
          </p>
          <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-5 py-16 sm:px-8">
            <div data-fx="rise">
              <p className="m-eyebrow">The original</p>
              <p className="m-serif mt-4 text-2xl sm:text-3xl">
                {sister.name} — {sister.city}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-tatami">
                Where it started. Same fish standards, same kitchen philosophy,
                different room.
              </p>
            </div>
            <div data-fx="rise" className="flex flex-wrap gap-6">
              <a
                href={`https://${sister.domain}`}
                className="m-caps border border-seam px-7 py-3.5 text-[12px] text-washi transition-colors hover:border-gold hover:text-gold-soft"
              >
                Visit {sister.city}
              </a>
              <Link
                href="/menu"
                className="m-caps bg-verm px-7 py-3.5 text-[12px] text-washi transition-colors hover:bg-price"
              >
                See our menu
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <h1 className="pt-10 text-3xl font-semibold tracking-tight text-bamboo-800">
        About {location.name}
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
        <p>{copy.about.shared}</p>
        <p>{copy.about.local}</p>
      </div>
    </div>
  );
}
