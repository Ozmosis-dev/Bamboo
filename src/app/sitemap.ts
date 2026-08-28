import type { MetadataRoute } from "next";
import { getCurrentLocation, siteUrl } from "@/lib/location";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const location = await getCurrentLocation();
  const base = siteUrl(location);

  return ["/", "/menu", "/about", "/visit", "/contact"].map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: path === "/menu" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/menu" ? 0.9 : 0.6,
  }));
}
