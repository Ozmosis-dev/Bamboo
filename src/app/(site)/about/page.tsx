import type { Metadata } from "next";
import { getCopy } from "@content/index";
import { getCurrentLocation, currentLocationSlug } from "@/lib/location";
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
  const copy = getCopy(currentLocationSlug());
  const location = await getCurrentLocation();

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
