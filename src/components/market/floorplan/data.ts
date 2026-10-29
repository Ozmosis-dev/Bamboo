/**
 * Layout data for the Bamboo on Market 3D floor model.
 *
 * Traced from the architect's A1-1 floor plan (elemi, release 01 Sept 2026)
 * rasterized at 200 DPI, where the sheet's 1/4" = 1'-0" scale gives exactly
 * 50 px per foot. Origin: the building's west face (x=0) and north face at
 * the sidewalk line (z=0). +x runs east, +z runs south. Units are feet.
 *
 * Key geometry (from the plan):
 *  - envelope: x 0→105.5; south wall z=70 west of x≈30, z=66.3 east of it
 *  - north dining patio: a 5.4'-deep sidewalk strip, x 6→49, six 2-tops
 *  - existing stair core (N.I.C.): x 49→77, z 0→36, with two counter rails
 *    (7 seats on its south face, 6 on its east face)
 *  - sushi bar: C-shaped counter wrapping the storage room; 5 stools on the
 *    north arm + 10 on the east arm
 *  - spirits bar: 25'-0" + 2'-6" flaps, 13 stools north + 4 on the east end
 *  - east dining: column of three 4-tops; east patio with two booth pairs
 *  - entry: vestibule at the southeast, off the waiting patio
 */

export const PLAN = {
  width: 105.5,
  depth: 70,
  center: [52.75, 35] as const,
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
  brick: "#8c4a38",
} as const;

/* ------------------------------------------------------------------ walls */

export type WallSeg = {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  h: number;
  t: number;
  kind: "solid" | "glass" | "low" | "brick";
};

const EXT_H = 6.5;
const INT_H = 4.5;
const EXT_T = 0.8;
const INT_T = 0.45;

function W(
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  kind: WallSeg["kind"],
  h?: number,
  t?: number,
): WallSeg {
  return {
    x1, z1, x2, z2, kind,
    h: h ?? (kind === "low" ? 3 : kind === "solid" || kind === "brick" ? EXT_H : EXT_H),
    t: t ?? (kind === "glass" ? 0.3 : kind === "low" ? 0.3 : EXT_T),
  };
}

function inner(x1: number, z1: number, x2: number, z2: number, h = INT_H): WallSeg {
  return { x1, z1, x2, z2, h, t: INT_T, kind: "solid" };
}

export const WALLS: WallSeg[] = [
  /* ---- envelope ---- */
  // west + south faces cut low (dollhouse cutaway) so the room stays visible
  W(0, 5.4, 0, 70, "brick", 1.5),
  // north: storefront behind the sidewalk patio, door openings at both ends
  W(9, 5.4, 45, 5.4, "glass"),
  W(0, 5.4, 6, 5.4, "brick"),
  W(6, 5.4, 9, 5.4, "glass", 6.5, 0.2), // door bay (103/104 corridor)
  W(45, 5.4, 49, 5.4, "glass", 6.5, 0.2),
  // north face of the stair-core band (existing building, N.I.C.)
  W(49, 0, 77, 0, "brick"),
  // east dining onto the NE patio: brick-pier storefront (see STOREFRONTS),
  // with a door gap at x 87.5–90.5
  // east face (Market St — the front): the patios are OPEN to the street
  // behind fences; the building face sits at x=97.4, where brick flanks
  // frame the recessed front door (z 44.8–48.6 opening)
  W(97.4, 43.1, 97.4, 44.8, "brick"),
  W(97.4, 48.6, 97.4, 51.6, "brick"),
  // south party wall: z=70 west of the demise step, z=66.3 east of it
  W(0, 70, 30, 70, "brick", 1.5),
  W(30, 66.3, 30, 70, "brick", 1.5),
  W(30, 66.3, 105.5, 66.3, "brick", 1.5),

  /* ---- patio railings (open-air edges) ---- */
  // sidewalk patio street edge, gates at both ends
  W(6, 0, 7.5, 0, "low"),
  W(10.5, 0, 45, 0, "low"),
  W(48, 0, 49, 0, "low"),
  W(6, 0, 6, 5.4, "low"),
  W(49, 0, 49, 5.4, "low"),
  // NE patio street edges, gate at x 88–91
  W(77, 0, 87.5, 0, "low"),
  W(90.5, 0, 105.5, 0, "low"),
  // east street edge: open fence the full length of the dining patio,
  // with a sidewalk gate at z 37.5–40.5
  W(105.5, 0, 105.5, 37.5, "low"),
  W(105.5, 40.5, 105.5, 43.1, "low"),
  // entry walk edges flanking the front gate (z 44.8–48.6)
  W(105.5, 43.1, 105.5, 44.8, "low"),
  W(105.5, 48.6, 105.5, 51.6, "low"),
  // waiting patio street edge
  W(105.5, 51.6, 105.5, 66.3, "low"),

  /* ---- interior ---- */
  // dry storage: east wall aligned with the office line (door 104 at its
  // north end), door 103 near the east end of its south wall
  inner(0, 15.6, 7, 15.6),
  inner(9.75, 8.6, 9.75, 15.6),
  // manager's office (9'-9" wide), door on its east wall
  inner(0, 17, 9.75, 17),
  inner(9.75, 17, 9.75, 20),
  inner(9.75, 23, 9.75, 26),
  inner(0, 26, 9.75, 26),
  // bathrooms (per plan): two mirrored rooms sharing the center plumbing
  // wall at x 12.75 (lav counters back to back on it), entered through
  // side-by-side doors off the dining side flanking that wall. The east
  // bathroom wall is shared with the P.O.S. station, and the open corridor
  // south of the block (grease interceptor in the floor) leads to the
  // kitchen.
  inner(0, 26, 9.9, 26, 5.4), // b1 north wall; its door at x 9.9–12.5
  inner(15.4, 26, 25.6, 26, 5.4), // b2 north wall; its door at x 13.0–15.4
  inner(12.75, 26, 12.75, 36.3, 5.4), // center plumbing wall (middle jamb)
  inner(25.6, 26, 25.6, 36.3, 5.4), // east wall, shared with the P.O.S.
  inner(0, 36.3, 25.6, 36.3, 5.4), // south wall
  // kitchen north wall, wide pass to the dining room at x 13–17.8
  inner(0, 42.7, 13, 42.7),
  // P.O.S. station: enclosed against the east bathroom wall, entered from
  // the kitchen corridor through the gap at its southwest corner
  inner(25.6, 30, 33.5, 30, 5.4),
  inner(33.5, 30, 33.5, 36.3, 5.4),
  inner(27.2, 36.3, 33.5, 36.3, 5.4), // entry gap at x 25.6–27.2
  // existing demising stubs between the two dining rooms
  { x1: 14.2, z1: 13.8, x2: 26.2, z2: 13.8, h: 5.5, t: 1.1, kind: "solid" },
  { x1: 42.0, z1: 13.8, x2: 49.0, z2: 13.8, h: 5.5, t: 1.1, kind: "solid" },
  // entry sequence at the southeast: glazed divider screens the entry walk
  // from the dining patio; low rails separate it from the waiting patio
  inner(93.5, 43.1, 97.4, 43.1, EXT_H),
  W(97.4, 43.1, 105.5, 43.1, "glass", EXT_H, 0.3),
  W(97.4, 51.6, 99, 51.6, "low"),
  W(103, 51.6, 105.5, 51.6, "low"),
];

/* walk-in rooms rendered as walled boxes */
export const ROOMS: Array<{ x: number; z: number; w: number; d: number; label?: string }> = [
  { x: 17.8, z: 43.6, w: 6.9, d: 10.8, label: "COOLER" },
  { x: 17.8, z: 54.6, w: 6.9, d: 9.7, label: "FREEZER" },
  { x: 25.4, z: 52.9, w: 16.7, d: 11.4, label: "STORAGE" },
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
  // patios (decking)
  { x: 6, z: 0, w: 43, d: 5.4, color: COLORS.deck, kind: "deck" },
  { x: 77, z: 0, w: 28.5, d: 13.4, color: COLORS.deck, kind: "deck" },
  { x: 97.4, z: 13.4, w: 8.1, d: 29.7, color: COLORS.deck, kind: "deck" },
  { x: 97.4, z: 43.1, w: 8.1, d: 8.5, color: COLORS.deck, kind: "deck" }, // entry walk
  { x: 97.4, z: 51.6, w: 8.1, d: 14.7, color: COLORS.deck, kind: "deck" },
  // kitchen + BOH slab
  { x: 0, z: 42.7, w: 25, d: 27.3, color: COLORS.charDeep, kind: "slab" },
  // mats under the two bars
  { x: 24.5, z: 42.7, w: 21.5, d: 19.5, color: COLORS.smoke, kind: "mat" },
  { x: 50, z: 56.5, w: 40, d: 9.8, color: COLORS.smoke, kind: "mat" },
];

/* -------------------------------------------------------------- furniture */

export type Table = { x: number; z: number; w: number; d: number };
export type Chair = { x: number; z: number; rot: number };
export type Stool = { x: number; z: number; rot: number };

export const TABLES: Table[] = [];
export const CHAIRS: Chair[] = [];
export const STOOLS: Stool[] = [];

/* Chair rotation = the direction the chair FACES: d = (sin rot, cos rot).
   N faces -z (street side), S faces +z, E faces +x, W faces -x. The seat
   back is rendered opposite the facing, so a chair always faces its table. */
const R = { N: Math.PI, S: 0, E: Math.PI / 2, W: -Math.PI / 2 };

function fourTop(x: number, z: number) {
  TABLES.push({ x, z, w: 2.9, d: 2.9 });
  CHAIRS.push(
    { x, z: z - 2.3, rot: R.S }, // north of the table, facing south
    { x, z: z + 2.3, rot: R.N },
    { x: x - 2.3, z, rot: R.E }, // west of the table, facing east
    { x: x + 2.3, z, rot: R.W },
  );
}

/** 2-top with chairs on the east/west ends (as drawn on the patio) */
function twoTopEW(x: number, z: number) {
  TABLES.push({ x, z, w: 2.2, d: 2.4 });
  CHAIRS.push({ x: x - 2, z, rot: R.E }, { x: x + 2, z, rot: R.W });
}

// north sidewalk patio — six 2-tops tight to the facade
for (const x of [7.5, 22.0, 27.9, 33.5, 39.6, 45.8]) twoTopEW(x, 2.6);

// northwest dining room (10 4-tops + one 2-top, as scattered on the plan)
for (const [x, z] of [
  [17.6, 9.5], [24.5, 9.5], [31.7, 9.5], [44.3, 9.5],
  [27.0, 19.3], [34.1, 19.3], [44.8, 20.2],
  [30.6, 27.0], [45.0, 26.1], [45.0, 34.1],
] as const) fourTop(x, z);
twoTopEW(20.3, 17.2);

// center dining — single row of four 4-tops south of the core
for (const x of [52.1, 59.3, 66.3, 73.5]) fourTop(x, 48.8);

// east dining room — column of three 4-tops
for (const z of [19.6, 29.4, 39.3]) fourTop(93.8, z);

// northeast patio — three 4-tops
for (const x of [83.3, 94.8, 102.0]) fourTop(x, 8.6);

// stair-core bench seating: a long banquette against the core wall with
// individual 2-top tables and a chair across from each (per the plan)
export const BENCH_SOUTH = { x1: 49, x2: 77, z: 36.6, depth: 1.6 };
export const BENCH_EAST = { z1: 15.4, z2: 35.9, x: 77.6, depth: 1.6 };
export const BENCH_TABLES_S: Array<[number, number]> = [];
export const BENCH_TABLES_E: Array<[number, number]> = [];
for (const x of [49.9, 54.3, 58.8, 63.3, 67.8, 72.3, 76.1]) {
  BENCH_TABLES_S.push([x, 39.2]);
  CHAIRS.push({ x, z: 41.0, rot: R.N });
}
for (const z of [17.5, 20.8, 24.1, 27.4, 30.7, 34.0]) {
  BENCH_TABLES_E.push([80.2, z]);
  CHAIRS.push({ x: 82.0, z, rot: R.W }); // east of the table, facing west
}

// sushi bar stools: 5 on the north arm, 10 down the east arm
for (const x of [35.1, 37.3, 39.5, 41.7, 43.9]) STOOLS.push({ x, z: 42.6, rot: R.S });
for (let i = 0; i < 10; i++) STOOLS.push({ x: 46.0, z: 44.5 + i * 1.85, rot: R.W });

// spirits bar stools: 13 along the front, 4 on the east return
for (let i = 0; i < 13; i++) STOOLS.push({ x: 59.6 + i * 2.35, z: 57.3, rot: R.S });
for (const z of [59.4, 61.1, 62.9, 64.8]) STOOLS.push({ x: 89.2, z, rot: R.W });

/* east dining patio: wall banquette against the storefront divider with
   square tables and a single facing chair each (2-table + 3-table clusters) */
export const PATIO_BENCHES: Array<{ z1: number; z2: number }> = [
  { z1: 18.2, z2: 23.6 },
  { z1: 26.1, z2: 34.1 },
];
export const PATIO_BENCH_X = 98.1; // bench centerline against the divider
export const PATIO_BENCH_TABLES: Array<[number, number]> = [];
for (const z of [19.6, 22.2, 27.5, 30.1, 32.7]) {
  PATIO_BENCH_TABLES.push([100.2, z]);
  CHAIRS.push({ x: 102.3, z, rot: R.W }); // east of the table, facing west
}

/* brick-pier + glass storefront runs (the facade in the exterior photo).
   Each run is either north–south (fixed x, z1→z2) or east–west (fixed z,
   x1→x2). Together they wrap the whole patio-facing shell: the east dining
   patio, the entry-door flanks' neighbor bays, the waiting patio / spirits
   bar front, and the NE patio face with its door gap at x 87.5–90.5. */
export type StorefrontRun =
  | { x: number; z1: number; z2: number }
  | { z: number; x1: number; x2: number };

export const STOREFRONT_PIERS = { every: 5.6, w: 1.2 };

export const STOREFRONTS: StorefrontRun[] = [
  { x: 97.4, z1: 13.4, z2: 43.1 }, // east dining patio
  { x: 97.4, z1: 51.6, z2: 66.3 }, // waiting patio / spirits bar front
  { z: 13.4, x1: 77, x2: 87.5 }, // NE patio, west of the doors
  { z: 13.4, x1: 90.5, x2: 97.4 }, // NE patio, east of the doors
];

/* ---------------------------------------------------------------- objects */

export type Block = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
};

export const BLOCKS: Block[] = [
  // kitchen: center island + north sinks (the hood line is built in detail
  // by the KitchenDetail component)
  { x: 8.3, z: 44.5, w: 3.4, d: 19, h: 3, color: COLORS.chrome },
  { x: 4.2, z: 43.1, w: 9, d: 2.2, h: 3, color: COLORS.chrome },
  // server station west of the spirits bar
  { x: 50.3, z: 59.5, w: 6.8, d: 4, h: 3.4, color: COLORS.woodDark },
];

/* spirits bar structural pieces (built in the model component) */
export const SPIRITS = {
  front: { x1: 58.5, x2: 88.4, z: 58.6, depth: 2.2 },
  back: { x1: 58.5, x2: 88.4, z: 63.6, depth: 2.0 },
  flapW: { x1: 57.2, x2: 58.5 },
  returnE: { z1: 58.6, z2: 66.0, x: 88.4, depth: 2.0 },
};

/* sushi bar C-shape: north arm, east arm, inner prep counter */
export const SUSHI = {
  north: { x1: 25.2, x2: 44.8, z1: 43.6, z2: 45.6 },
  east: { x1: 42.8, x2: 44.8, z1: 45.6, z2: 61.5 },
  inner: { x1: 25.4, x2: 42.1, z1: 52.9, z2: 54.3 },
};

/* pendant cone lights over seating (x, z) */
export const PENDANTS: Array<[number, number]> = [
  // spirits bar
  [61, 59.6], [66.5, 59.6], [72, 59.6], [77.5, 59.6], [83, 59.6],
  // sushi bar north arm
  [33, 44.6], [39, 44.6],
  // core rails
  [53, 37.3], [61, 37.3], [69, 37.3], [76, 37.3],
  // east dining column
  [93.8, 19.6], [93.8, 29.4], [93.8, 39.3],
];

/* bamboo planter clusters */
export const PLANTERS: Array<[number, number]> = [
  // east patio + waiting patio (per plan's grey planter boxes)
  [99.6, 16.0], [99.7, 35.6], [103.8, 53.5],
  // sidewalk patio, between the tables (per the facade photo)
  [14.5, 1.1], [29.5, 1.1], [43.0, 1.1],
  // NE patio corners
  [79.0, 1.1], [103.5, 1.1],
  // flanking the front entrance
  [104.4, 43.6], [104.4, 49.8],
  // inside, at the patio corridor doors
  [8, 6.8], [47.5, 6.8],
];

/* structural columns (core corners, demise line) */
export const COLUMNS: Array<[number, number]> = [
  [49.4, 15.0], [76.6, 15.0], [49.4, 35.6], [76.6, 35.6],
  [51.0, 65.9], [75.3, 65.9],
];

/* restroom fixtures: toilets (rot = facing, same convention as chairs)
   and the back-to-back lav counter on the spine wall */
export const TOILETS: Array<{ x: number; z: number; rot: number }> = [
  { x: 1.15, z: 28.8, rot: Math.PI / 2 }, // west bathroom, on the west wall
  { x: 1.15, z: 34.2, rot: Math.PI / 2 },
  { x: 24.45, z: 33.6, rot: -Math.PI / 2 }, // east bathroom, on its east wall
];
export const LAV = { x: 12.75, z1: 29.2, z2: 32.8 };

export const HOST_STAND = { x: 82.5, z: 48.7 };
export const WH_POS: [number, number] = [2.0, 68.6];
export const CORE = { x: 49, z: 0, w: 28, d: 36 };
export const POS_DESK = { x: 27.6, z: 30.8, w: 5.4, d: 3.6 };

/* ----------------------------------------------------------------- labels */

export type Label = { x: number; z: number; text: string; minor?: boolean };

export const LABELS: Label[] = [
  { x: 27, z: 2.7, text: "DINING PATIO" },
  { x: 28, z: 16, text: "DINING" },
  { x: 62, z: 52, text: "DINING" },
  { x: 90, z: 24, text: "DINING" },
  { x: 90, z: 6, text: "DINING PATIO" },
  { x: 101.5, z: 25.5, text: "DINING PATIO", minor: true },
  { x: 101.5, z: 58.5, text: "WAITING PATIO", minor: true },
  { x: 35, z: 49, text: "SUSHI BAR" },
  { x: 73, z: 61.5, text: "SPIRITS BAR" },
  { x: 9, z: 56, text: "KITCHEN" },
  { x: 63, z: 24, text: "STAIR · N.I.C.", minor: true },
  { x: 6.5, z: 10.5, text: "DRY STORAGE", minor: true },
  { x: 5, z: 21.5, text: "OFFICE", minor: true },
  { x: 6.2, z: 31.5, text: "W.C.", minor: true },
  { x: 19.5, z: 31.5, text: "W.C.", minor: true },
  { x: 82.5, z: 46.8, text: "HOST", minor: true },
  { x: 29.5, z: 33.2, text: "P.O.S.", minor: true },
  { x: 53.5, z: 61.5, text: "SERVER", minor: true },
];
