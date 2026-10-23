/** Category slugs that belong to the kitchen; everything else is the bar. */
export const FOOD_SLUGS = [
  "sashimi",
  "nigiri",
  "rolls",
  "share",
  "skewers",
  "salads",
  "noodle-bowls",
];

/** The bar half, in display order: cocktails lead, then sake, then beer and
 * wine. Each group gets its own divider band on the menu page. */
export const DRINK_GROUPS: { title: string; glyph: string; slugs: string[] }[] = [
  { title: "Cocktails", glyph: "盃", slugs: ["cocktails"] },
  { title: "Sake", glyph: "酒", slugs: ["sake"] },
  {
    title: "Beer & Wine",
    glyph: "杯",
    slugs: [
      "on-tap",
      "bottles-cans",
      "bubbles-rose",
      "white-wine",
      "red-wine",
      "asian-wine",
      "zero-proof",
    ],
  },
];

/** Kanji glyphs for menu sections we can name confidently; others go without. */
export const SECTION_KANJI: Record<string, string> = {
  sashimi: "刺身",
  nigiri: "握り",
  rolls: "巻",
  skewers: "串",
  salads: "菜",
  "noodle-bowls": "麺",
  sake: "酒",
  cocktails: "盃",
};
