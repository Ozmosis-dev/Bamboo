import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getCurrentLocation, getSisterLocation } from "@/lib/location";
import { restaurantJsonLd } from "@/lib/seo";

export const revalidate = 300;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, sister] = await Promise.all([
    getCurrentLocation(),
    getSisterLocation(),
  ]);

  return (
    <>
      <JsonLd data={restaurantJsonLd(location)} />
      <AnnouncementBanner location={location} />
      <Header location={location} />
      <main className="flex-1">{children}</main>
      <Footer location={location} sister={sister} />
    </>
  );
}
