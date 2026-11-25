import type { MetadataRoute } from "next";
import { MENU_HIDDEN, SITE_HIDDEN } from "@/lib/flags";
import { getCurrentLocation, siteUrl } from "@/lib/location";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const location = await getCurrentLocation();
  const base = siteUrl(location);

  return ["/", "/menu", "/about", "/visit", "/contact"]
    .filter((path) => !(MENU_HIDDEN && path === "/menu"))
    /* coming-soon mode trims Chattanooga to the homepage and menu */
    .filter(
      (path) =>
        !(
          SITE_HIDDEN &&
          location.slug === "chattanooga" &&
          !["/", "/menu"].includes(path)
        )
    )
    .map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: path === "/menu" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/menu" ? 0.9 : 0.6,
  }));
}
