import type { NextConfig } from "next";

/* Legacy paths from the old Birmingham WordPress site. Only that deployment
 * needs them, but they're harmless 301s on Chattanooga too. */
const legacyRedirects = [
  { source: "/410-2", destination: "/menu", permanent: true },
  { source: "/menu-2", destination: "/menu", permanent: true },
  { source: "/menus", destination: "/menu", permanent: true },
  { source: "/about-us", destination: "/about", permanent: true },
  { source: "/contact-us", destination: "/contact", permanent: true },
  { source: "/location", destination: "/visit", permanent: true },
  { source: "/hours", destination: "/visit", permanent: true },
];

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
