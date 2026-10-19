/** Hand-drawn neighborhood map: the blocks around 423 Market St, Chattanooga.
 * Illustrative, not to scale — river north, numbered streets south of it,
 * gold stars on the landmarks, vermilion seal on Bamboo.
 *
 * `variant="paper"` renders it as ink on washi for light sections. */

type Variant = "dark" | "paper";

const PALETTES = {
  dark: {
    line: "var(--color-tatami)",
    strong: "var(--color-washi)",
    star: "var(--color-gold-soft)",
    verm: "var(--color-verm)",
    seam: "var(--color-seam)",
    badgeFill: "var(--color-char)",
    glyph: "var(--color-washi)",
  },
  paper: {
    line: "#4a4036",
    strong: "#262019",
    star: "#8a6f2f",
    verm: "var(--color-verm)",
    seam: "#d8cdbb",
    badgeFill: "var(--color-washi)",
    glyph: "var(--color-washi)",
  },
} as const;

const label = {
  fontFamily: "var(--font-jost)",
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
};

function Star({ x, y, fill, r = 7.5 }: { x: number; y: number; fill: string; r?: number }) {
  const d = `M ${x} ${y - r} C ${x + r * 0.18} ${y - r * 0.18} ${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y}
             C ${x + r * 0.18} ${y + r * 0.18} ${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r}
             C ${x - r * 0.18} ${y + r * 0.18} ${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y}
             C ${x - r * 0.18} ${y - r * 0.18} ${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`;
  return <path d={d} fill={fill} />;
}

export function MarketMap({ variant = "dark" }: { variant?: Variant }) {
  const c = PALETTES[variant];
  return (
    <svg
      viewBox="0 0 880 600"
      role="img"
      aria-label="Illustrated map of downtown Chattanooga: Bamboo on Market at 423 Market Street, between West 4th and 5th Streets, with the Tennessee River, Tennessee Aquarium, Ross's Landing, Walnut Street Bridge, Creative Discovery Museum, and the Riverwalk nearby."
      className="h-auto w-full"
    >
      {/* Tennessee River */}
      <path
        d="M 0 118 C 180 92 340 128 480 110 C 620 92 760 112 880 92"
        fill="none"
        stroke={c.line}
        strokeWidth="1.5"
      />
      <path
        d="M 0 64 C 180 46 360 72 520 54 C 660 40 780 56 880 40"
        fill="none"
        stroke={c.line}
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M 150 88 q 14 -8 28 0 M 330 96 q 14 -8 28 0 M 560 82 q 14 -8 28 0"
        fill="none"
        stroke={c.line}
        strokeWidth="1"
        opacity="0.5"
      />
      <text x="420" y="84" textAnchor="middle" fill={c.star} fontSize="13" style={label}>
        Tennessee River
      </text>

      {/* Riverwalk */}
      <path
        d="M 30 140 C 200 116 360 150 500 132 C 640 114 760 134 860 116"
        fill="none"
        stroke={c.star}
        strokeWidth="1.2"
        strokeDasharray="2 7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <text x="96" y="166" fill={c.line} fontSize="10.5" style={label} opacity="0.9">
        Riverwalk
      </text>

      {/* vertical streets */}
      {(
        [
          [178, "Chestnut St", 158],
          [330, "Broad St", 158],
          [482, "Market St", 134],
          [628, "Cherry St", 158],
          [752, "Walnut St", 134],
        ] as const
      ).map(([x, name, top]) => (
        <g key={name}>
          <line
            x1={x}
            y1={top}
            x2={x}
            y2={560}
            stroke={c.line}
            strokeWidth={name === "Market St" ? 2 : 1.1}
            opacity={name === "Market St" ? 1 : 0.6}
          />
          <text
            x={x + 14}
            y={556}
            fill={name === "Market St" ? c.strong : c.line}
            fontSize={name === "Market St" ? 12 : 10.5}
            style={label}
            transform={`rotate(-90 ${x + 14} 556)`}
          >
            {name}
          </text>
        </g>
      ))}

      {/* horizontal streets */}
      {(
        [
          [252, "W Aquarium Way"],
          [320, "W 2nd St"],
          [388, "W 3rd St"],
          [452, "W 4th St"],
          [524, "W 5th St"],
        ] as const
      ).map(([y, name]) => (
        <g key={name}>
          <line x1={64} y1={y} x2={820} y2={y} stroke={c.line} strokeWidth="1.1" opacity="0.6" />
          <text x={70} y={y - 8} fill={c.line} fontSize="10.5" style={label}>
            {name}
          </text>
        </g>
      ))}

      {/* Walnut Street Bridge crossing the river */}
      <g>
        <line x1={752} y1={14} x2={752} y2={158} stroke={c.line} strokeWidth="2" />
        <path
          d="M 744 30 q 8 -12 16 0 M 744 62 q 8 -12 16 0 M 744 94 q 8 -12 16 0 M 744 126 q 8 -12 16 0"
          fill="none"
          stroke={c.line}
          strokeWidth="1"
          opacity="0.7"
        />
        <Star x={752} y={48} fill={c.star} />
        <text x={700} y={24} fill={c.strong} fontSize="11" style={label}>
          Walnut St Bridge
        </text>
      </g>

      {/* Landmarks */}
      <g>
        <Star x={330} y={214} fill={c.star} />
        <text x={346} y={210} fill={c.strong} fontSize="11" style={label}>
          Tennessee Aquarium
        </text>
      </g>
      <g>
        <Star x={422} y={132} fill={c.star} />
        <text x={438} y={128} fill={c.strong} fontSize="11" style={label}>
          Ross&apos;s Landing
        </text>
      </g>
      <g>
        <Star x={178} y={430} fill={c.star} />
        <text x={194} y={426} fill={c.strong} fontSize="11" style={label}>
          Creative Discovery Museum
        </text>
      </g>

      {/* walking route: Bamboo up Market, over 2nd, to the Aquarium */}
      <path
        d="M 482 488 L 482 320 L 330 320 L 330 214"
        fill="none"
        stroke={c.verm}
        strokeWidth="1.4"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />

      {/* Bamboo on Market */}
      <g>
        <circle cx={482} cy={488} r={14} fill={c.verm} />
        <text
          x={482}
          y={493.5}
          textAnchor="middle"
          fill={c.glyph}
          fontSize="14"
          fontFamily="var(--font-mincho)"
          fontWeight="700"
        >
          竹
        </text>
        <rect x={506} y={469} width={172} height={38} fill={c.badgeFill} stroke={c.verm} strokeWidth="1.5" />
        <text x={592} y={485} textAnchor="middle" fill={c.strong} fontSize="12.5" style={{ ...label, fontWeight: 700 }}>
          Bamboo
        </text>
        <text x={592} y={499} textAnchor="middle" fill={c.strong} fontSize="8" style={label}>
          — on market —
        </text>
      </g>

      {/* compass */}
      <g>
        <line x1={826} y1={216} x2={826} y2={176} stroke={c.line} strokeWidth="1.2" />
        <path d="M 826 170 l 6 12 l -6 -4 l -6 4 Z" fill={c.star} />
        <text x={826} y={234} textAnchor="middle" fill={c.line} fontSize="10" style={label}>
          N
        </text>
      </g>
    </svg>
  );
}
