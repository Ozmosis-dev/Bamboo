import type { Location } from "@/lib/types";

export function AnnouncementBanner({ location }: { location: Location }) {
  if (!location.announcement) return null;
  return (
    <div className="bg-bamboo-700 px-4 py-2 text-center text-sm text-white">
      {location.announcement}
    </div>
  );
}
