import type { NextConfig } from "next";
import { MENU_HIDDEN } from "./src/lib/flags";

/* Legacy paths from the old Birmingham WordPress site. Only that deployment
 * needs them, but they're harmless 301s on Chattanooga too. */
const legacyRedirects = [
  // While the menu page is hidden (src/lib/flags.ts), its legacy paths land on
  // the home page with a temporary redirect so browsers don't cache the detour.
  { source: "/410-2", destination: MENU_HIDDEN ? "/" : "/menu", permanent: !MENU_HIDDEN },
  { source: "/menu-2", destination: MENU_HIDDEN ? "/" : "/menu", permanent: !MENU_HIDDEN },
  { source: "/menus", destination: MENU_HIDDEN ? "/" : "/menu", permanent: !MENU_HIDDEN },
  { source: "/about-us", destination: "/about", permanent: true },
  { source: "/contact-us", destination: "/contact", permanent: true },
  { source: "/location", destination: "/visit", permanent: true },
  { source: "/hours", destination: "/visit", permanent: true },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
