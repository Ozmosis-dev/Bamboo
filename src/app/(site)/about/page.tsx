import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCopy } from "@content/index";
import { MarketPageHeader } from "@/components/market/MarketPage";
import { telHref } from "@/lib/format";
import { MENU_HIDDEN } from "@/lib/flags";
import { getCurrentLocation, getSisterLocation, currentLocationSlug } from "@/lib/location";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/content";
import { getSiteImages } from "@/lib/images";

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
    const [sister, content, siteImages] = await Promise.all([
      getSisterLocation(),
      getSiteContent(slug),
      getSiteImages(),
    ]);
    return (
      <>
        <MarketPageHeader
          eyebrow="Our story"
          kanji="物語 · 竹"
          title="One kitchen, two cities."
        />

        {/* Full-bleed room — the image speaks for itself */}
        <section className="relative mt-16 h-[46vh] min-h-[340px] overflow-hidden border-y border-seam sm:h-[56vh]">
          <Image
            src={siteImages.slots.dining_room}
            alt="The dining room at night — canvas canopy ceiling, lantern light, red banquette"
            fill
            sizes="100vw"
            data-parallax="0.14"
            className="m-photo scale-110 object-cover object-center"
          />
        </section>

        {/* Washi: the idea */}
        <section className="m-washi relative overflow-hidden">
          <span
            aria-hidden
            className="m-kanji absolute -right-10 -top-14 text-[17rem] leading-none text-verm opacity-[0.07]"
          >
            竹
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/textures/wave.webp"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -right-16 w-[620px] max-w-none opacity-[0.11] mix-blend-multiply"
            style={{ filter: "invert(1)" }}
          />
          <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
            <div data-fx="rise" className="flex items-center gap-5">
              <span aria-hidden className="h-px w-14 bg-verm" />
              <p className="m-eyebrow">
                The idea <span className="m-kanji font-normal">· 簡素</span>
              </p>
            </div>
            <p data-fx="rise" className="m-serif mt-10 max-w-3xl text-3xl leading-snug sm:text-[2.6rem]">
              {content.about_shared}
            </p>
            <p data-fx="rise" className="m-soft mt-10 max-w-xl text-lg leading-relaxed">
              {content.about_local}
            </p>
          </div>
        </section>

        {/* Two cities, one standard */}
        <section className="relative">
          <div aria-hidden className="m-paper-dark" />
          <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div className="grid gap-y-14 md:grid-cols-[1fr_1px_1fr] md:gap-x-14">
            <div data-fx="rise">
              <p className="m-eyebrow">The original</p>
              <p className="m-serif mt-6 text-4xl sm:text-5xl">{sister.name}</p>
              <p className="m-caps mt-5 text-[12px] text-tatami">
                {sister.address_line1} · {sister.city}
              </p>
              <a
                href={`https://${sister.domain}`}
                className="m-caps group mt-8 inline-flex items-center gap-3 text-[12px] text-washi hover:text-gold-soft"
              >
                Visit the {sister.city} site
                <span aria-hidden className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-14" />
              </a>
            </div>
            <div aria-hidden className="hidden bg-seam md:block" />
            <div data-fx="rise">
              <p className="m-eyebrow">The second home · now</p>
              <p className="m-serif mt-6 text-4xl sm:text-5xl">{location.name}</p>
              <p className="m-caps mt-5 text-[12px] text-tatami">
                {location.address_line1} · {location.city}
              </p>
              <Link
                href="/visit"
                className="m-caps group mt-8 inline-flex items-center gap-3 text-[12px] text-washi hover:text-gold-soft"
              >
                Plan a visit
                <span aria-hidden className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-14" />
              </Link>
            </div>
          </div>
          </div>
        </section>

        {/* Vermilion: come eat */}
        <section className="m-verm relative overflow-hidden">
          <span
            aria-hidden
            className="m-kanji absolute -bottom-16 -right-8 text-[15rem] leading-none text-washi opacity-10"
          >
            味
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/textures/wave.webp"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -left-14 w-[640px] max-w-none opacity-[0.13]"
          />
          <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-20 sm:px-8 sm:py-24">
            <p data-fx="rise" className="m-serif max-w-2xl text-3xl leading-snug sm:text-5xl">
              Dinner, Monday through Saturday. Walk-ins welcome.
            </p>
            <div data-fx="rise" className="flex flex-wrap gap-5">
              {!MENU_HIDDEN && (
                <Link
                  href="/menu"
                  className="m-caps bg-char px-8 py-4 text-[13px] text-washi transition-colors hover:bg-char-deep"
                >
                  See the menu
                </Link>
              )}
              <a
                href={telHref(location.phone)}
                className="m-caps border border-washi/60 px-8 py-4 text-[13px] text-washi transition-colors hover:border-washi"
              >
                Call {location.phone}
              </a>
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
