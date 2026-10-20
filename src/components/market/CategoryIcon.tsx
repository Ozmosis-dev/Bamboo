/** Hand-drawn line icons for the menu categories, keyed by category slug.
 * Single-weight strokes on currentColor so they tint with the brand tokens. */

const P = {
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
  stroke: "currentColor",
} as const;

const ICONS: Record<string, React.ReactNode> = {
  // A fish: body, tail, eye
  sashimi: (
    <>
      <path {...P} d="M3 12c3.5-4.5 9-5.5 13-2.5 1.2.9 2.2 1.7 3 2.5-.8.8-1.8 1.6-3 2.5-4 3-9.5 2-13-2.5Z" />
      <path {...P} d="M19 12c.8-1.6 1.8-2.6 3-3.5-.4 1.4-.4 5.6 0 7-1.2-.9-2.2-1.9-3-3.5Z" />
      <circle cx="7.2" cy="11.2" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  // Nigiri: fish draped over a rice mound
  nigiri: (
    <>
      <path {...P} d="M5 14.5c0-2.5 3-4.5 7-4.5s7 2 7 4.5V16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1.5Z" />
      <path {...P} d="M4 10.5C6 7.5 10 6 14 6.8c2.8.6 4.8 1.8 6 3.7" />
    </>
  ),
  // Maki roll cross-section
  rolls: (
    <>
      <circle {...P} cx="12" cy="12" r="8.5" />
      <circle {...P} cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  // Two small plates passing
  share: (
    <>
      <circle {...P} cx="9" cy="10" r="5.5" />
      <path {...P} d="M12.8 14.6a5.5 5.5 0 1 0 7.4-7.4" />
    </>
  ),
  // Skewer with three pieces
  skewers: (
    <>
      <path {...P} d="M4 20 20 4" />
      <circle {...P} cx="9.5" cy="14.5" r="2.1" />
      <circle {...P} cx="13.2" cy="10.8" r="2.1" />
      <circle {...P} cx="16.9" cy="7.1" r="2.1" />
    </>
  ),
  // A leaf with its vein
  salads: (
    <>
      <path {...P} d="M20 4c.5 8-3 15-10.5 16C5 20.5 4 17 4.5 14.5 6 8 13 4.5 20 4Z" />
      <path {...P} d="M5.5 18.5C9 14 13 10 18 6.5" />
    </>
  ),
  // Bowl, chopsticks, noodles
  "noodle-bowls": (
    <>
      <path {...P} d="M4 11h16c0 3.5-2 6.5-5 7.6V20H9v-1.4c-3-1.1-5-4.1-5-7.6Z" />
      <path {...P} d="M8 8.5C10 7 14 7 16.5 8.5M13 11 20.5 3M16 11l5-5.5" />
    </>
  ),
  // Coupe glass
  cocktails: (
    <>
      <path {...P} d="M5 5h14c0 3.5-3 6.5-7 6.5S5 8.5 5 5Z" />
      <path {...P} d="M12 11.5V19M8 19h8" />
      <circle cx="15.5" cy="3.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // Sake tokkuri and cup
  sake: (
    <>
      <path {...P} d="M9 4h4m-3.5 0c.4 2-.3 3-1.5 4.3C6.7 9.7 6 11 6 13c0 3.5 1.5 7 4.5 7S15 16.5 15 13c0-2-.7-3.3-2-4.7C11.8 7 11.1 6 11.5 4" />
      <path {...P} d="M17.5 15.5h3V17a3 3 0 0 1-3 3" />
    </>
  ),
  // Beer glass with head
  "on-tap": (
    <>
      <path {...P} d="M7 9h10l-1 11H8L7 9Z" />
      <path {...P} d="M6.5 9a3 3 0 0 1 2-5.2A3.5 3.5 0 0 1 15 3a2.8 2.8 0 0 1 2.5 6" />
    </>
  ),
  // Bottle and can
  "bottles-cans": (
    <>
      <path {...P} d="M8.5 3h3v4l1.2 2a3 3 0 0 1 .3 1.3V19a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 7 19v-8.7A3 3 0 0 1 7.3 9l1.2-2V3Z" />
      <path {...P} d="M15.5 8.5H20V19a1.5 1.5 0 0 1-1.5 1.5h-1.5A1.5 1.5 0 0 1 15.5 19V8.5ZM15.5 8.5 17 6.5h1.5L20 8.5" />
    </>
  ),
  // Tea cup with steam
  "zero-proof": (
    <>
      <path {...P} d="M4 11h13v3a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6v-3Z" />
      <path {...P} d="M17 12h2a2.5 2.5 0 0 1 0 5h-2.3M8 8c0-1.2 1-1.4 1-2.6M12 8c0-1.2 1-1.4 1-2.6" />
    </>
  ),
};

// Wine categories share a glass, with bubbles for the sparkling list
const wineGlass = (bubbles = false) => (
  <>
    <path {...P} d="M7 3h10c.3 3-.5 8-5 8s-5.3-5-5-8Z" />
    <path {...P} d="M12 11v8M8.5 19h7" />
    {bubbles && (
      <>
        <circle cx="10.5" cy="6" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="13.5" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="4.8" r="0.5" fill="currentColor" stroke="none" />
      </>
    )}
  </>
);
ICONS["asian-wine"] = wineGlass();
ICONS["white-wine"] = wineGlass();
ICONS["red-wine"] = wineGlass();
ICONS["bubbles-rose"] = wineGlass(true);

// Fallback: crossed chopsticks over a plate (the brand mark's gesture)
const fallback = (
  <>
    <circle {...P} cx="11" cy="13" r="7" />
    <path {...P} d="M8 20.5 15.5 3M10.5 20.8 16.5 3.5" />
  </>
);

export function CategoryIcon({
  slug,
  className = "h-5 w-5",
}: {
  slug: string;
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      {ICONS[slug] ?? fallback}
    </svg>
  );
}
