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
