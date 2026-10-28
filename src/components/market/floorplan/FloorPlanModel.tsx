"use client";

import { useEffect, useMemo, useState } from "react";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import {
  BLOCKS,
  BOOTHS,
  BOOTH_X,
  CHAIRS,
  COLORS,
  LABELS,
  PENDANTS,
  PLAN,
  PLANTERS,
  RAILS,
  STOOLS,
  TABLES,
  WALLS,
  ZONES,
  type WallSeg,
} from "./data";

/* Shared materials — one instance each, reused across meshes. */
function useMaterials() {
  return useMemo(() => {
    const m = {
      wall: new THREE.MeshStandardMaterial({ color: COLORS.washi, roughness: 0.85 }),
      innerWall: new THREE.MeshStandardMaterial({ color: COLORS.tatami, roughness: 0.9 }),
      glass: new THREE.MeshStandardMaterial({
        color: COLORS.glass,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
      }),
      floor: new THREE.MeshStandardMaterial({ color: COLORS.concrete, roughness: 0.95 }),
      plinth: new THREE.MeshStandardMaterial({ color: COLORS.charDeep, roughness: 0.6, metalness: 0.2 }),
      gold: new THREE.MeshStandardMaterial({ color: COLORS.gold, roughness: 0.35, metalness: 0.8 }),
      wood: new THREE.MeshStandardMaterial({ color: COLORS.wood, roughness: 0.6 }),
      woodDark: new THREE.MeshStandardMaterial({ color: COLORS.woodDark, roughness: 0.7 }),
      white: new THREE.MeshStandardMaterial({ color: COLORS.washi, roughness: 0.5 }),
      black: new THREE.MeshStandardMaterial({ color: COLORS.char, roughness: 0.55 }),
      leather: new THREE.MeshStandardMaterial({ color: COLORS.leather, roughness: 0.65 }),
      verm: new THREE.MeshStandardMaterial({ color: COLORS.verm, roughness: 0.45, metalness: 0.15 }),
      chrome: new THREE.MeshStandardMaterial({ color: COLORS.chrome, roughness: 0.3, metalness: 0.85 }),
      bamboo: new THREE.MeshStandardMaterial({ color: COLORS.bamboo, roughness: 0.8 }),
      pendant: new THREE.MeshStandardMaterial({
        color: COLORS.goldSoft,
        emissive: new THREE.Color("#e8b96a"),
        emissiveIntensity: 1.6,
        roughness: 0.4,
      }),
    };
    return m;
  }, []);
}

type Mats = ReturnType<typeof useMaterials>;

function Wall({ seg, mats }: { seg: WallSeg; mats: Mats }) {
  const { x1, z1, x2, z2, h, t, kind } = seg;
  const len = Math.hypot(x2 - x1, z2 - z1) + t; // overlap corners
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;
  const rotY = Math.abs(x2 - x1) > Math.abs(z2 - z1) ? 0 : Math.PI / 2;
  const mat = kind === "glass" ? mats.glass : h <= 5 ? mats.innerWall : mats.wall;
  return (
    <group position={[cx, 0, cz]} rotation={[0, rotY, 0]}>
      <mesh material={mat} position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, h, t]} />
      </mesh>
      {kind === "glass" && (
        /* storefront header + sill in gold to read as framed glazing */
        <>
          <mesh material={mats.gold} position={[0, h + 0.15, 0]}>
            <boxGeometry args={[len, 0.3, t + 0.15]} />
          </mesh>
          <mesh material={mats.black} position={[0, 0.25, 0]}>
            <boxGeometry args={[len, 0.5, t + 0.1]} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Rails({ mats }: { mats: Mats }) {
  const posts: Array<[number, number, number]> = [];
  const rails: Array<{ c: [number, number, number]; len: number; rotY: number }> = [];
  for (const [x1, z1, x2, z2] of RAILS) {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const rotY = Math.abs(x2 - x1) > Math.abs(z2 - z1) ? 0 : Math.PI / 2;
    rails.push({ c: [(x1 + x2) / 2, 2.9, (z1 + z2) / 2], len, rotY });
    const n = Math.max(2, Math.round(len / 4));
    for (let i = 0; i <= n; i++) {
      posts.push([x1 + ((x2 - x1) * i) / n, 1.5, z1 + ((z2 - z1) * i) / n]);
    }
  }
  return (
    <group>
      {rails.map((r, i) => (
        <mesh key={i} material={mats.black} position={r.c} rotation={[0, r.rotY, 0]} castShadow>
          <boxGeometry args={[r.len, 0.18, 0.18]} />
        </mesh>
      ))}
      <Instances limit={posts.length} geometry={new THREE.BoxGeometry(0.15, 3, 0.15)} material={mats.black}>
        {posts.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
    </group>
  );
}

function Floors({ mats }: { mats: Mats }) {
  return (
    <group>
      {/* main slab */}
      <mesh material={mats.floor} position={[PLAN.width / 2, -0.15, PLAN.depth / 2]} receiveShadow>
        <boxGeometry args={[PLAN.width, 0.3, PLAN.depth]} />
      </mesh>
      {/* zone overlays */}
      {ZONES.map((z, i) => (
        <mesh
          key={i}
          position={[z.x + z.w / 2, z.kind === "deck" ? 0.06 : 0.03, z.z + z.d / 2]}
          receiveShadow
        >
          <boxGeometry args={[z.w, z.kind === "deck" ? 0.12 : 0.06, z.d]} />
          <meshStandardMaterial color={z.color} roughness={0.9} />
        </mesh>
      ))}
      {/* deck plank seams */}
      {ZONES.filter((z) => z.kind === "deck").map((z, i) => {
        const planks = Math.floor(z.w / 2.4);
        return (
          <group key={`p${i}`}>
            {Array.from({ length: planks }, (_, j) => (
              <mesh
                key={j}
                material={mats.black}
                position={[z.x + (j + 1) * (z.w / (planks + 1)), 0.125, z.z + z.d / 2]}
              >
                <boxGeometry args={[0.07, 0.02, z.d]} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function Furniture({ mats }: { mats: Mats }) {
  const tableTop = useMemo(() => new THREE.BoxGeometry(1, 0.18, 1), []);
  const pedestal = useMemo(() => new THREE.CylinderGeometry(0.14, 0.4, 2.4, 10), []);
  const seat = useMemo(() => new THREE.BoxGeometry(1.5, 0.14, 1.5), []);
  const back = useMemo(() => new THREE.BoxGeometry(1.5, 1.5, 0.12), []);
  const stoolTop = useMemo(() => new THREE.CylinderGeometry(0.62, 0.62, 0.16, 14), []);
  const stoolLeg = useMemo(() => new THREE.CylinderGeometry(0.08, 0.2, 2.2, 8), []);
  return (
    <group>
      {/* table tops — scaled per table */}
      <Instances limit={TABLES.length} geometry={tableTop} material={mats.wood}>
        {TABLES.map((t, i) => (
          <Instance key={i} position={[t.x, 2.5, t.z]} scale={[t.w, 1, t.d]} />
        ))}
      </Instances>
      <Instances limit={TABLES.length} geometry={pedestal} material={mats.black}>
        {TABLES.map((t, i) => (
          <Instance key={i} position={[t.x, 1.2, t.z]} />
        ))}
      </Instances>
      {/* chairs — white, per the dining room photography */}
      <Instances limit={CHAIRS.length} geometry={seat} material={mats.white}>
        {CHAIRS.map((c, i) => (
          <Instance key={i} position={[c.x, 1.5, c.z]} rotation={[0, c.rot, 0]} />
        ))}
      </Instances>
      <Instances limit={CHAIRS.length} geometry={back} material={mats.white}>
        {CHAIRS.map((c, i) => {
          // back panel sits on the side of the seat facing away from the table
          const dx = Math.sin(c.rot) * 0.69;
          const dz = Math.cos(c.rot) * 0.69;
          return (
            <Instance key={i} position={[c.x - dx, 2.3, c.z - dz]} rotation={[0, c.rot, 0]} />
          );
        })}
      </Instances>
      {/* stools — black leather, bar height */}
      <Instances limit={STOOLS.length} geometry={stoolTop} material={mats.black}>
        {STOOLS.map((s, i) => (
          <Instance key={i} position={[s.x, 2.3, s.z]} />
        ))}
      </Instances>
      <Instances limit={STOOLS.length} geometry={stoolLeg} material={mats.chrome}>
        {STOOLS.map((s, i) => (
          <Instance key={i} position={[s.x, 1.1, s.z]} />
        ))}
      </Instances>
    </group>
  );
}

function Booths({ mats }: { mats: Mats }) {
  return (
    <group>
      {BOOTHS.map(({ z }, i) => (
        <group key={i} position={[BOOTH_X, 0, z]}>
          <mesh material={mats.wood} position={[0, 2.4, 0]} castShadow>
            <boxGeometry args={[4, 0.18, 2.6]} />
          </mesh>
          <mesh material={mats.black} position={[0, 1.2, 0]}>
            <boxGeometry args={[0.5, 2.3, 0.5]} />
          </mesh>
          {[-1, 1].map((side) => (
            <group key={side} position={[0, 0, side * 2.1]}>
              <mesh material={mats.leather} position={[0, 0.9, 0]} castShadow>
                <boxGeometry args={[4, 1.8, 1.4]} />
              </mesh>
              <mesh material={mats.leather} position={[0, 2.1, side * 0.6]}>
                <boxGeometry args={[4, 1.6, 0.35]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function SushiBar({ mats }: { mats: Mats }) {
  return (
    <group>
      {/* L-shaped counter: long leg N–S, short return E–W */}
      {[
        { pos: [41.5, 0, 51] as const, size: [3, 44, 14] as const },
        { pos: [36.5, 0, 45.5] as const, size: [13, 44, 3] as const },
      ].map((part, i) => (
        <group key={i} position={[part.pos[0], 0, part.pos[2]]}>
          <mesh material={mats.black} position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[part.size[0] - 0.4, 3, part.size[2] - 0.4]} />
          </mesh>
          <mesh material={mats.white} position={[0, 3.1, 0]} castShadow>
            <boxGeometry args={[part.size[0] + 0.6, 0.25, part.size[2] + 0.6]} />
          </mesh>
        </group>
      ))}
      {/* refrigerated sushi case on the north end */}
      <mesh material={mats.glass} position={[41.5, 3.75, 46.5]} castShadow>
        <boxGeometry args={[2.2, 1, 4]} />
      </mesh>
      {/* bamboo pole screen behind the chefs, per the interior photos */}
      <Instances limit={14} geometry={new THREE.CylinderGeometry(0.22, 0.22, 6, 8)} material={mats.bamboo}>
        {Array.from({ length: 14 }, (_, i) => (
          <Instance key={i} position={[34.2, 3, 47.5 + i * 0.75]} />
        ))}
      </Instances>
    </group>
  );
}

function SpiritsBar({ mats }: { mats: Mats }) {
  return (
    <group>
      {/* main counter — vermilion lacquer front, wood top */}
      <mesh material={mats.verm} position={[66, 1.6, 67.5]} castShadow>
        <boxGeometry args={[28, 3.2, 2.6]} />
      </mesh>
      <mesh material={mats.wood} position={[66, 3.35, 67.5]} castShadow>
        <boxGeometry args={[29, 0.3, 3.4]} />
      </mesh>
      {/* brass foot rail */}
      <mesh material={mats.gold} position={[66, 0.8, 65.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 27, 8]} />
      </mesh>
      {/* back bar — charred shelf with glowing bottle rail */}
      <mesh material={mats.woodDark} position={[66, 2.2, 71]} castShadow>
        <boxGeometry args={[28, 4.4, 1.4]} />
      </mesh>
      <mesh position={[66, 4.5, 71]}>
        <boxGeometry args={[27, 0.12, 1.2]} />
        <meshStandardMaterial color={COLORS.goldSoft} emissive="#d9a84e" emissiveIntensity={1.2} />
      </mesh>
      {/* counter rail against the stair core */}
      <mesh material={mats.wood} position={[57, 3.3, 43]} castShadow>
        <boxGeometry args={[20, 0.25, 2]} />
      </mesh>
      <mesh material={mats.black} position={[57, 1.6, 43]}>
        <boxGeometry args={[19.4, 3.1, 1.4]} />
      </mesh>
    </group>
  );
}

function Entry({ mats }: { mats: Mats }) {
  return (
    <group>
      {/* vermilion double door on the Market St face */}
      <mesh material={mats.verm} position={[99.9, 3.4, 51]} castShadow>
        <boxGeometry args={[0.5, 6.8, 6]} />
      </mesh>
      <mesh material={mats.gold} position={[99.6, 3.4, 51]}>
        <boxGeometry args={[0.12, 0.12, 5.6]} />
      </mesh>
      {/* host stand */}
      <mesh material={mats.verm} position={[76.5, 1.9, 55]} castShadow>
        <boxGeometry args={[2, 3.8, 1.5]} />
      </mesh>
      <mesh material={mats.wood} position={[76.5, 3.9, 55]}>
        <boxGeometry args={[2.3, 0.18, 1.8]} />
      </mesh>
    </group>
  );
}

function Planters({ mats }: { mats: Mats }) {
  return (
    <group>
      {PLANTERS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh material={mats.black} position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[1.8, 1.6, 1.8]} />
          </mesh>
          {Array.from({ length: 5 }, (_, j) => {
            const a = (j / 5) * Math.PI * 2;
            return (
              <mesh
                key={j}
                material={mats.bamboo}
                position={[Math.cos(a) * 0.45, 3.2, Math.sin(a) * 0.45]}
                rotation={[Math.cos(a) * 0.08, 0, Math.sin(a) * 0.08]}
              >
                <cylinderGeometry args={[0.07, 0.09, 4.8, 6]} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function Pendants({ mats }: { mats: Mats }) {
  const cone = useMemo(() => new THREE.ConeGeometry(0.55, 1.3, 12, 1, true), []);
  const cord = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 3, 4), []);
  return (
    <group>
      <Instances limit={PENDANTS.length} geometry={cone} material={mats.pendant}>
        {PENDANTS.map(([x, z], i) => (
          <Instance key={i} position={[x, 7.2, z]} />
        ))}
      </Instances>
      <Instances limit={PENDANTS.length} geometry={cord} material={mats.black}>
        {PENDANTS.map(([x, z], i) => (
          <Instance key={i} position={[x, 9.3, z]} />
        ))}
      </Instances>
    </group>
  );
}

function Blocks({ mats }: { mats: Mats }) {
  return (
    <group>
      {BLOCKS.map((b, i) => (
        <mesh key={i} position={[b.x + b.w / 2, b.h / 2, b.z + b.d / 2]} castShadow receiveShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial
            color={b.color}
            roughness={b.color === COLORS.chrome ? 0.3 : 0.85}
            metalness={b.color === COLORS.chrome ? 0.8 : 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Zone labels as canvas-texture sprites: no DOM overlay (drei <Html> spawns a
 * React root per label, which React 19 dev flags on unmount), correct depth
 * occlusion, and the site's Jost letterforms once document.fonts resolves.
 */
function makeLabelTexture(text: string, color: string) {
  const pad = 48;
  const font = "500 64px Jost, ui-sans-serif, sans-serif";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  const spaced = text.split("").join("  "); // fake tracking
  const w = Math.ceil(ctx.measureText(spaced).width) + pad * 2;
  canvas.width = w;
  canvas.height = 160;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(15,14,13,0.95)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.fillText(spaced, w / 2, 80);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, aspect: w / 160 };
}

function LabelSprite({ x, z, text, minor }: { x: number; z: number; text: string; minor?: boolean }) {
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => live && setFontsReady(true));
    return () => {
      live = false;
    };
  }, []);
  const { tex, aspect } = useMemo(
    () => makeLabelTexture(text, minor ? "rgba(201,177,140,0.8)" : "#c8a858"),
    // re-rasterize once web fonts are available
    [text, minor, fontsReady],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  const h = minor ? 1.5 : 2.2;
  return (
    <sprite position={[x, minor ? 5.4 : 7.8, z]} scale={[h * aspect, h, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function Labels() {
  return (
    <group>
      {LABELS.map((l, i) => (
        <LabelSprite key={i} {...l} />
      ))}
    </group>
  );
}

function Plinth({ mats }: { mats: Mats }) {
  return (
    <group>
      <mesh material={mats.plinth} position={[PLAN.width / 2, -1.45, PLAN.depth / 2]} receiveShadow>
        <boxGeometry args={[PLAN.width + 18, 2.3, PLAN.depth + 18]} />
      </mesh>
      {/* gold hairline reveal around the plinth edge */}
      <mesh material={mats.gold} position={[PLAN.width / 2, -0.33, PLAN.depth / 2]}>
        <boxGeometry args={[PLAN.width + 18.4, 0.08, PLAN.depth + 18.4]} />
      </mesh>
    </group>
  );
}

export default function FloorPlanModel() {
  const mats = useMaterials();
  return (
    <group position={[-PLAN.center[0], 0, -PLAN.center[1]]}>
      <Plinth mats={mats} />
      <Floors mats={mats} />
      {WALLS.map((w, i) => (
        <Wall key={i} seg={w} mats={mats} />
      ))}
      <Rails mats={mats} />
      <Blocks mats={mats} />
      <Furniture mats={mats} />
      <Booths mats={mats} />
      <SushiBar mats={mats} />
      <SpiritsBar mats={mats} />
      <Entry mats={mats} />
      <Planters mats={mats} />
      <Pendants mats={mats} />
      <Labels />
    </group>
  );
}
