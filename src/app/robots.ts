import type { MetadataRoute } from "next";
import { getCurrentLocation, siteUrl } from "@/lib/location";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const location = await getCurrentLocation();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${siteUrl(location)}/sitemap.xml`,
  };
}
