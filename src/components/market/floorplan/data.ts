/**
 * Layout data for the Bamboo on Market 3D floor model.
 *
 * All coordinates are in feet, traced from the architect's A1-1 floor plan
 * (elemi, release 01 Sept 2026). Plan origin is the building's top-left
 * corner: +x runs east (right on the sheet), +z runs south (down the sheet).
 * The model group recenters the footprint before rendering, so data here can
 * stay in plan coordinates.
 *
 * This is a stylized presentation maquette, not a construction document —
 * dimensions are faithful to the plan's proportions, not survey-accurate.
 */

export const PLAN = {
  width: 100,
  depth: 72,
  /** world-space offset applied to the whole model so it orbits around 0,0 */
  center: [50, 36] as const,
};

/* ---------------------------------------------------------------- palette */

export const COLORS = {
  verm: "#b5341c",
  vermDeep: "#8e2715",
  gold: "#b08d3e",
  goldSoft: "#c8a858",
  char: "#161514",
  charDeep: "#0f0e0d",
  smoke: "#232120",
  seam: "#363330",
  tatami: "#c9b18c",
  washi: "#f3ede2",
  chrome: "#c7ccd1",
  wood: "#8a5a33",
  woodDark: "#5e3d22",
  leather: "#7d2f23",
  glass: "#aebfc4",
  concrete: "#2e2b28",
  deck: "#a88a62",
  bamboo: "#b09a56",
} as const;

/* ------------------------------------------------------------------ walls */

export type WallSeg = {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  h: number;
  t: number;
  kind: "solid" | "glass" | "low";
};

const EXT_H = 6.5;
const INT_H = 4.5;
const EXT_T = 0.7;
const INT_T = 0.45;

function seg(
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  kind: WallSeg["kind"] = "solid",
  h = kind === "solid" ? EXT_H : kind === "glass" ? EXT_H : 3,
  t = kind === "glass" ? 0.3 : EXT_T,
): WallSeg {
  return { x1, z1, x2, z2, h, t, kind };
}

function inner(x1: number, z1: number, x2: number, z2: number): WallSeg {
  return { x1, z1, x2, z2, h: INT_H, t: INT_T, kind: "solid" };
}

export const WALLS: WallSeg[] = [
  // north (top of sheet) — storefront glazing at both dining patios
  seg(0, 0, 8, 0),
  seg(8, 0, 55, 0, "glass"),
  seg(55, 0, 68, 0),
  seg(68, 0, 100, 0, "glass"),
  // east (Market St) — glazing with the entry cut out at z 48–54
  seg(100, 0, 100, 48, "glass"),
  seg(100, 54, 100, 72, "glass"),
  // south — party wall (adjacent tenant not in scope)
  seg(0, 72, 100, 72),
  // west — service side
  seg(0, 0, 0, 72),

  // back-of-house partitions (cutaway height)
  inner(0, 8, 14, 8),
  inner(14, 8, 14, 18),
  inner(0, 18, 14, 18),
  inner(0, 20, 13, 20),
  inner(13, 20, 13, 30),
  inner(0, 30, 20, 30),
  inner(20, 30, 20, 42),
  inner(0, 42, 20, 42),
  inner(10, 30, 10, 42),
  inner(0, 44, 22, 44),
  inner(22, 44, 22, 48),
  inner(22, 52, 22, 72),
];

/** low rails separating patios from the dining room */
export const RAILS: Array<[number, number, number, number]> = [
  [8, 10, 55, 10],
  [70, 16, 100, 16],
  [82, 28, 82, 56],
  [84, 60, 84, 72],
  [84, 60, 100, 60],
];

/* ------------------------------------------------------------ floor zones */

export type Zone = {
  x: number;
  z: number;
  w: number;
  d: number;
  color: string;
  kind: "deck" | "slab" | "mat";
};

export const ZONES: Zone[] = [
  // patio decking
  { x: 8, z: 0.5, w: 47, d: 9.5, color: COLORS.deck, kind: "deck" },
  { x: 68, z: 0.5, w: 32, d: 15.5, color: COLORS.deck, kind: "deck" },
  { x: 82, z: 28, w: 18, d: 28, color: COLORS.deck, kind: "deck" },
  { x: 84, z: 60, w: 16, d: 12, color: COLORS.deck, kind: "deck" },
  // kitchen + BOH slab
  { x: 0, z: 44, w: 22, d: 28, color: COLORS.charDeep, kind: "slab" },
  // tatami runner under the sushi bar
  { x: 29, z: 43, w: 17, d: 17, color: COLORS.smoke, kind: "mat" },
  // spirits bar apron
  { x: 50, z: 62.5, w: 32, d: 9, color: COLORS.smoke, kind: "mat" },
];

/* -------------------------------------------------------------- furniture */

export type Table = { x: number; z: number; w: number; d: number };
/** chair: position + facing (radians, 0 faces −z i.e. plan-north) */
export type Chair = { x: number; z: number; rot: number };
export type Stool = { x: number; z: number };

function fourTop(x: number, z: number, tables: Table[], chairs: Chair[]) {
  tables.push({ x, z, w: 2.9, d: 2.9 });
  chairs.push(
    { x, z: z - 2.3, rot: Math.PI },
    { x, z: z + 2.3, rot: 0 },
    { x: x - 2.3, z, rot: Math.PI / 2 },
    { x: x + 2.3, z, rot: -Math.PI / 2 },
  );
}

function twoTop(x: number, z: number, tables: Table[], chairs: Chair[], axis: "x" | "z" = "z") {
  tables.push({ x, z, w: 2.4, d: 2.4 });
  if (axis === "z") {
    chairs.push({ x, z: z - 2, rot: Math.PI }, { x, z: z + 2, rot: 0 });
  } else {
    chairs.push({ x: x - 2, z, rot: Math.PI / 2 }, { x: x + 2, z, rot: -Math.PI / 2 });
  }
}

export const TABLES: Table[] = [];
export const CHAIRS: Chair[] = [];
export const STOOLS: Stool[] = [];

// north dining patio — 2-tops along the storefront
for (const x of [13, 20, 27, 34, 41, 48]) twoTop(x, 5, TABLES, CHAIRS);

// northwest dining room — grid of 4-tops
for (const x of [18, 26, 34]) for (const z of [14, 22, 30]) fourTop(x, z, TABLES, CHAIRS);
twoTop(40, 36, TABLES, CHAIRS, "x");

// center dining east of the sushi bar
for (const x of [48, 56, 64]) for (const z of [50, 58]) fourTop(x, z, TABLES, CHAIRS);

// northeast dining patio
for (const x of [74, 82, 90, 97]) fourTop(x, 6, TABLES, CHAIRS);
for (const x of [78, 86, 94]) twoTop(x, 12.5, TABLES, CHAIRS, "x");

// east dining patio — 2-tops in two columns
for (const z of [32, 40, 48]) {
  twoTop(87, z, TABLES, CHAIRS, "x");
  twoTop(95, z, TABLES, CHAIRS, "x");
}

// counter rail seating against the stair core
for (let i = 0; i < 7; i++) STOOLS.push({ x: 48.5 + i * 2.7, z: 44.6 });

// sushi bar stools (east face + south return)
for (let i = 0; i < 5; i++) STOOLS.push({ x: 44.8, z: 46.5 + i * 2.4 });
for (const x of [33, 36]) STOOLS.push({ x, z: 48.8 });

// spirits bar stools
for (let i = 0; i < 9; i++) STOOLS.push({ x: 54 + i * 3, z: 64.4 });

/* booths along the east wall south of the stair core */
export const BOOTHS: Array<{ z: number }> = [22, 27.2, 32.4, 37.6, 42.8].map((z) => ({ z }));
export const BOOTH_X = 76; // table centerline

/* ---------------------------------------------------------------- objects */

export type Block = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  label?: string;
};

export const BLOCKS: Block[] = [
  // existing stair / elevator core — hatched "NOT IN SCOPE" on the plan
  { x: 47, z: 20, w: 19, d: 22, h: EXT_H, color: COLORS.smoke, label: "EXISTING STAIR" },
  // walk-ins and dry goods
  { x: 24, z: 48, w: 6, d: 8, h: 4.5, color: COLORS.seam, label: "COOLER" },
  { x: 24, z: 58, w: 6, d: 8, h: 4.5, color: COLORS.seam, label: "FREEZER" },
  { x: 30.5, z: 58, w: 5.5, d: 8, h: 4.2, color: COLORS.concrete },
  // P.O.S. station
  { x: 23, z: 36, w: 6, d: 5, h: 3.4, color: COLORS.concrete, label: "P.O.S." },
  // kitchen lines (stainless)
  { x: 1.5, z: 46, w: 18, d: 3.2, h: 4.8, color: COLORS.chrome },
  { x: 2, z: 53, w: 16, d: 3, h: 3, color: COLORS.chrome },
  { x: 2, z: 60, w: 16, d: 3, h: 3, color: COLORS.chrome },
  // server station beside the spirits bar
  { x: 46.5, z: 64.5, w: 4.5, d: 6, h: 3.4, color: COLORS.woodDark },
];

/* pendant cone lights (x, z, y = height of cone tip) */
export const PENDANTS: Array<[number, number]> = [
  // over the spirits bar
  [56, 67.5],
  [61, 67.5],
  [66, 67.5],
  [71, 67.5],
  [76, 67.5],
  // along the booth wall
  [80.5, 23],
  [80.5, 28.2],
  [80.5, 33.4],
  [80.5, 38.6],
  [80.5, 43.8],
];

/* bamboo planter clusters */
export const PLANTERS: Array<[number, number]> = [
  [97.2, 45.5],
  [97.2, 57],
  [69.5, 2.5],
  [9.5, 2.5],
];

/* ----------------------------------------------------------------- labels */

export type Label = { x: number; z: number; text: string; minor?: boolean };

export const LABELS: Label[] = [
  { x: 30, z: 4.5, text: "DINING PATIO" },
  { x: 26, z: 23, text: "DINING" },
  { x: 11, z: 57, text: "KITCHEN" },
  { x: 38, z: 51.5, text: "SUSHI BAR" },
  { x: 56, z: 54, text: "DINING" },
  { x: 65, z: 69.5, text: "SPIRITS BAR" },
  { x: 86, z: 9, text: "DINING PATIO" },
  { x: 91, z: 41, text: "DINING PATIO" },
  { x: 92, z: 66.5, text: "WAITING PATIO", minor: true },
  { x: 56.5, z: 31, text: "STAIR · N.I.C.", minor: true },
  { x: 7, z: 13, text: "DRY STORAGE", minor: true },
  { x: 6.5, z: 25, text: "OFFICE", minor: true },
  { x: 10, z: 36, text: "W.C.", minor: true },
  { x: 76.5, z: 56.5, text: "HOST", minor: true },
];
