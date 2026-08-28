import type { HoursEntry, ResolvedMenuItem } from "@/lib/types";

export function formatPrice(item: Pick<ResolvedMenuItem, "price" | "price_note">): string {
  const parts: string[] = [];
  if (item.price !== null) parts.push(`$${item.price.toFixed(2)}`);
  if (item.price_note) parts.push(item.price_note);
  return parts.join(" · ");
}

export function isClosedEntry(entry: HoursEntry): boolean {
  return entry.open.toLowerCase() === "closed";
}

/** '11:00' → '11 am', '21:30' → '9:30 pm' */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour12}:${String(m).padStart(2, "0")} ${period}` : `${hour12} ${period}`;
}

export function formatHoursEntry(entry: HoursEntry): string {
  if (isClosedEntry(entry)) return `${entry.days}: Closed`;
  return `${entry.days}: ${formatTime(entry.open)}–${formatTime(entry.close)}`;
}

export function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}
