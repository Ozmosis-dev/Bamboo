import type { LocationSlug } from "@/lib/types";
import type { SiteCopy } from "./types";
import { copy as birmingham } from "./birmingham/copy";
import { copy as chattanooga } from "./chattanooga/copy";

const bySlug: Record<LocationSlug, SiteCopy> = { birmingham, chattanooga };

export function getCopy(slug: LocationSlug): SiteCopy {
  return bySlug[slug];
}
