/** Hand-drawn neighborhood map: the blocks around 423 Market St, Chattanooga.
 * Illustrative, not to scale — river north, numbered streets south of it,
 * gold stars on the landmarks, vermilion seal on Bamboo. */

const GOLD = "var(--color-gold-soft)";
const TATAMI = "var(--color-tatami)";
const VERM = "var(--color-verm)";
const WASHI = "var(--color-washi)";
const SEAM = "var(--color-seam)";

function Star({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  const d = `M ${x} ${y - r} C ${x + r * 0.18} ${y - r * 0.18} ${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y}
             C ${x + r * 0.18} ${y + r * 0.18} ${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r}
             C ${x - r * 0.18} ${y + r * 0.18} ${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y}
             C ${x - r * 0.18} ${y - r * 0.18} ${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`;
  return <path d={d} fill={GOLD} />;
}

const label = {
  fontFamily: "var(--font-jost)",
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
};

export function MarketMap() {
  return (
    <svg
      viewBox="0 0 880 620"
      role="img"
      aria-label="Illustrated map of downtown Chattanooga: Bamboo on Market at 423 Market Street, between West 4th and 5th Streets, with the Tennessee River, Tennessee Aquarium, Ross's Landing, Walnut Street Bridge, Creative Discovery Museum, and the Riverwalk nearby."
      className="h-auto w-full"
    >
      {/* frame */}
      <rect x="1" y="1" width="878" height="618" fill="none" stroke={SEAM} strokeWidth="1.5" />

      {/* Tennessee River */}
      <path
        d="M 0 118 C 180 92 340 128 480 110 C 620 92 760 112 880 92"
        fill="none"
        stroke={TATAMI}
        strokeWidth="1.5"
      />
      <path
        d="M 0 64 C 180 46 360 72 520 54 C 660 40 780 56 880 40"
        fill="none"
        stroke={TATAMI}
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M 120 88 q 14 -8 28 0 M 320 96 q 14 -8 28 0 M 560 82 q 14 -8 28 0"
        fill="none"
        stroke={TATAMI}
        strokeWidth="1"
        opacity="0.5"
      />
      <text x="440" y="82" textAnchor="middle" fill={GOLD} fontSize="12" style={label}>
        Tennessee River
      </text>

      {/* Riverwalk */}
      <path
        d="M 30 136 C 200 112 360 146 500 128 C 640 110 760 130 860 112"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.2"
        strokeDasharray="2 7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <text x="96" y="158" fill={TATAMI} fontSize="9.5" style={label} opacity="0.9">
        Riverwalk
      </text>

      {/* vertical streets */}
      {(
        [
          [178, "Chestnut St", 150],
          [330, "Broad St", 150],
          [482, "Market St", 128],
          [628, "Cherry St", 150],
          [752, "Walnut St", 128],
        ] as const
      ).map(([x, name, top]) => (
        <g key={name}>
          <line x1={x} y1={top} x2={x} y2={600} stroke={TATAMI} strokeWidth={name === "Market St" ? 2 : 1.1} opacity={name === "Market St" ? 1 : 0.65} />
          <text
            x={x - 7}
            y={586}
            fill={name === "Market St" ? WASHI : TATAMI}
            fontSize={name === "Market St" ? 11 : 9.5}
            style={label}
            transform={`rotate(-90 ${x - 7} 586)`}
          >
            {name}
          </text>
        </g>
      ))}

      {/* horizontal streets */}
      {(
        [
          [250, "W Aquarium Way"],
          [318, "W 2nd St"],
          [386, "W 3rd St"],
          [454, "W 4th St"],
          [530, "W 5th St"],
        ] as const
      ).map(([y, name]) => (
        <g key={name}>
          <line x1={60} y1={y} x2={840} y2={y} stroke={TATAMI} strokeWidth="1.1" opacity="0.65" />
          <text x={68} y={y - 7} fill={TATAMI} fontSize="9.5" style={label}>
            {name}
          </text>
        </g>
      ))}

      {/* Walnut Street Bridge crossing the river */}
      <g>
        <line x1={752} y1={10} x2={752} y2={150} stroke={TATAMI} strokeWidth="2" />
        <path d="M 744 26 q 8 -12 16 0 M 744 58 q 8 -12 16 0 M 744 90 q 8 -12 16 0 M 744 122 q 8 -12 16 0" fill="none" stroke={TATAMI} strokeWidth="1" opacity="0.7" />
        <Star x={752} y={44} />
        <text x={766} y={36} fill={WASHI} fontSize="10" style={label}>
          Walnut St
        </text>
        <text x={766} y={50} fill={WASHI} fontSize="10" style={label}>
          Bridge
        </text>
      </g>

      {/* Landmarks */}
      <g>
        <Star x={330} y={212} />
        <text x={346} y={206} fill={WASHI} fontSize="10" style={label}>
          Tennessee
        </text>
        <text x={346} y={220} fill={WASHI} fontSize="10" style={label}>
          Aquarium
        </text>
      </g>
      <g>
        <Star x={422} y={130} />
        <text x={438} y={126} fill={WASHI} fontSize="10" style={label}>
          Ross&apos;s Landing
        </text>
      </g>
      <g>
        <Star x={178} y={430} />
        <text x={194} y={422} fill={WASHI} fontSize="10" style={label}>
          Creative Discovery
        </text>
        <text x={194} y={436} fill={WASHI} fontSize="10" style={label}>
          Museum
        </text>
      </g>

      {/* walking route: Bamboo up Market, over 2nd, to the Aquarium */}
      <path
        d="M 482 492 L 482 318 L 330 318 L 330 212"
        fill="none"
        stroke={VERM}
        strokeWidth="1.4"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />

      {/* Bamboo on Market */}
      <g>
        <circle cx={482} cy={492} r={13} fill={VERM} />
        <text
          x={482}
          y={497}
          textAnchor="middle"
          fill={WASHI}
          fontSize="13"
          fontFamily="var(--font-mincho)"
          fontWeight="700"
        >
          竹
        </text>
        <rect x={504} y={474} width={166} height={36} fill="var(--color-char)" stroke={VERM} strokeWidth="1.5" />
        <text x={587} y={489} textAnchor="middle" fill={WASHI} fontSize="11.5" style={{ ...label, fontWeight: 700 }}>
          Bamboo
        </text>
        <text x={587} y={503} textAnchor="middle" fill={WASHI} fontSize="7.5" style={label}>
          — on market —
        </text>
      </g>

      {/* compass + walk note */}
      <g>
        <line x1={826} y1={560} x2={826} y2={520} stroke={TATAMI} strokeWidth="1.2" />
        <path d="M 826 514 l 6 12 l -6 -4 l -6 4 Z" fill={GOLD} />
        <text x={826} y={578} textAnchor="middle" fill={TATAMI} fontSize="9" style={label}>
          N
        </text>
      </g>
      <text x={64} y={34} fill={TATAMI} fontSize="9.5" style={label} opacity="0.9">
        Not to scale · the river is a five-minute walk
      </text>
    </svg>
  );
}
