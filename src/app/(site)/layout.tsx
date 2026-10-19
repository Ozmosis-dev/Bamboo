import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { MarketFooter } from "@/components/market/MarketFooter";
import { MarketHeader } from "@/components/market/MarketHeader";
import {
  currentLocationSlug,
  getCurrentLocation,
  getSisterLocation,
} from "@/lib/location";
import { restaurantJsonLd } from "@/lib/seo";

export const revalidate = 300;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const market = currentLocationSlug() === "chattanooga";
  const [location, sister] = await Promise.all([
    getCurrentLocation(),
    getSisterLocation(),
  ]);

  return (
    <>
      <JsonLd data={restaurantJsonLd(location)} />
      <AnnouncementBanner location={location} />
      {market ? (
        <MarketHeader location={location} />
      ) : (
        <Header location={location} />
      )}
      <main className="flex-1">{children}</main>
      {market ? (
        <MarketFooter location={location} sister={sister} />
      ) : (
        <Footer location={location} sister={sister} />
      )}
    </>
  );
}
