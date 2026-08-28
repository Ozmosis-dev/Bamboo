import { createPublicClient } from "@/lib/supabase/public";
import type { Location, LocationSlug } from "@/lib/types";

/** Which location this build renders. Set per Vercel project. */
export function currentLocationSlug(): LocationSlug {
  const slug = process.env.NEXT_PUBLIC_LOCATION;
  if (slug !== "birmingham" && slug !== "chattanooga") {
    throw new Error(
      `NEXT_PUBLIC_LOCATION must be 'birmingham' or 'chattanooga', got: ${slug}`
    );
  }
  return slug;
}

export function sisterLocationSlug(slug: LocationSlug): LocationSlug {
  return slug === "birmingham" ? "chattanooga" : "birmingham";
}

/** Canonical origin for this site. NEXT_PUBLIC_SITE_URL wins (lets previews and
 * local dev set their own), falling back to the location's production domain. */
export function siteUrl(location: Location): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? `https://${location.domain}`;
}

export async function getLocation(slug: LocationSlug): Promise<Location> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data as Location;
}

export async function getCurrentLocation(): Promise<Location> {
  return getLocation(currentLocationSlug());
}

export async function getSisterLocation(): Promise<Location> {
  return getLocation(sisterLocationSlug(currentLocationSlug()));
}
