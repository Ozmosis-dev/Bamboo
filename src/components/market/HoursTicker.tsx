"use client";

import { useEffect, useState } from "react";
import type { HoursEntry } from "@/lib/types";
import { formatHoursEntry } from "@/lib/format";

const DAY_ORDER = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Does an entry's day label ("Mon–Thu", "Fri–Sat", "Sun") cover this day? */
function coversDay(days: string, dayIndex: number): boolean {
  const normalized = days.toLowerCase().replace(/\s/g, "");
  const [start, end] = normalized.split(/[–-]/);
  const from = DAY_ORDER.indexOf(start?.slice(0, 3));
  if (from === -1) return false;
  if (!end) return from === dayIndex;
  const to = DAY_ORDER.indexOf(end.slice(0, 3));
  if (to === -1) return false;
  /* the data's ranges don't wrap around the week */
  return dayIndex >= from && dayIndex <= to;
}

/** The restaurant's current weekday (Chattanooga — Eastern time). */
function todayIndex(): number {
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/New_York",
  }).format(new Date());
  return DAY_ORDER.indexOf(day.toLowerCase());
}

const ROTATE_MS = 4000;
const FADE_MS = 350;

/** Hours carousel for the hero strip: opens on today's hours, then rotates
 * through the rest of the week. The eyebrow reads "Tonight" while today's
 * hours are up, "Hours" for the other days. */
export function HoursTicker({ hours }: { hours: HoursEntry[] }) {
  /* today's entry first, then the remaining entries in their listed order */
  const [order, setOrder] = useState<HoursEntry[]>(hours);
  const [pos, setPos] = useState(0);
  const [shown, setShown] = useState(true);

  /* runs client-side only, so server and first client render agree */
  useEffect(() => {
    const today = todayIndex();
    const at = hours.findIndex((h) => coversDay(h.days, today));
    if (at > 0) setOrder([...hours.slice(at), ...hours.slice(0, at)]);
  }, [hours]);

  useEffect(() => {
    if (order.length < 2) return;
    const interval = setInterval(() => {
      setShown(false);
      setTimeout(() => {
        setPos((p) => (p + 1) % order.length);
        setShown(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [order]);

  const entry = order[pos];
  if (!entry) return null;
  const isToday = coversDay(entry.days, todayIndex());

  return (
    <>
      <p className="m-eyebrow !text-[0.6rem]">
        {isToday ? (
          <>
            Tonight <span className="m-kanji font-normal">· 今夜</span>
          </>
        ) : (
          <>
            Hours <span className="m-kanji font-normal">· 営業</span>
          </>
        )}
      </p>
      <p
        aria-live="polite"
        className="m-serif mt-1.5 text-lg leading-snug transition-all duration-300"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(4px)",
        }}
      >
        {formatHoursEntry(entry)}
      </p>
    </>
  );
}
