"use client";

import { useEffect, useMemo, useState } from "react";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import {
  BLOCKS,
  BOOTHS,
  CHAIRS,
  COLORS,
  COLUMNS,
  CORE,
  HOST_STAND,
  LABELS,
  PENDANTS,
  PLAN,
  PLANTERS,
  POS_DESK,
  RAIL_EAST,
  RAIL_SOUTH,
  ROOMS,
  SPIRITS,
  STOOLS,
  SUSHI,
  TABLES,
  WALLS,
  WH_POS,
  ZONES,
  type WallSeg,
} from "./data";

/* ------------------------------------------------------- canvas textures */

/** Subtle noise-grain texture so large surfaces don't read as flat plastic. */
function grainTexture(base: string, variation = 14, size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * variation;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Running-bond brick texture for the exterior shell. */
function brickTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#6e6259";
  ctx.fillRect(0, 0, 512, 256);
  const bw = 62;
  const bh = 30;
  for (let row = 0; row < 256 / bh; row++) {
    for (let col = -1; col < 512 / bw + 1; col++) {
      const x = col * (bw + 3) + (row % 2 ? (bw + 3) / 2 : 0);
      const y = row * (bh + 3);
      const warm = 120 + Math.random() * 50;
      ctx.fillStyle = `rgb(${warm}, ${warm * 0.45 + Math.random() * 14}, ${warm * 0.33})`;
      ctx.fillRect(x, y, bw, bh);
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      if (Math.random() < 0.3) ctx.fillRect(x, y, bw, bh);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(0.55, 0.55);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------- materials */

function useMaterials() {
  return useMemo(() => {
    const woodGrain = grainTexture("#8a5a33", 26);
    woodGrain.repeat.set(0.4, 0.4);
    const floorGrain = grainTexture("#2e2b28", 10);
    floorGrain.repeat.set(2.4, 2.4);
    const deckGrain = grainTexture("#a3855e", 18);
    deckGrain.repeat.set(0.8, 0.8);
    return {
      wall: new THREE.MeshStandardMaterial({ color: COLORS.washi, roughness: 0.85 }),
      innerWall: new THREE.MeshStandardMaterial({ color: COLORS.tatami, roughness: 0.9 }),
      brick: new THREE.MeshStandardMaterial({ map: brickTexture(), roughness: 0.92 }),
      glass: new THREE.MeshStandardMaterial({
        color: COLORS.glass,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
      }),
      floor: new THREE.MeshStandardMaterial({
        map: floorGrain,
        roughness: 0.35,
        metalness: 0.08,
      }),
      deck: new THREE.MeshStandardMaterial({ map: deckGrain, roughness: 0.85 }),
      plinth: new THREE.MeshStandardMaterial({ color: COLORS.charDeep, roughness: 0.85, metalness: 0 }),
      gold: new THREE.MeshStandardMaterial({ color: COLORS.gold, roughness: 0.3, metalness: 0.85 }),
      wood: new THREE.MeshStandardMaterial({ map: woodGrain, roughness: 0.55 }),
      woodDark: new THREE.MeshStandardMaterial({ color: COLORS.woodDark, roughness: 0.7 }),
      white: new THREE.MeshStandardMaterial({ color: "#ddd8cf", roughness: 0.45 }),
      black: new THREE.MeshStandardMaterial({ color: COLORS.char, roughness: 0.55 }),
      leather: new THREE.MeshStandardMaterial({ color: COLORS.leather, roughness: 0.6 }),
      verm: new THREE.MeshStandardMaterial({ color: COLORS.verm, roughness: 0.4, metalness: 0.1 }),
      chrome: new THREE.MeshStandardMaterial({ color: COLORS.chrome, roughness: 0.28, metalness: 0.85 }),
      smoke: new THREE.MeshStandardMaterial({ color: COLORS.smoke, roughness: 0.85 }),
      bamboo: new THREE.MeshStandardMaterial({ color: "#8a7742", roughness: 0.8 }),
      counterWhite: new THREE.MeshStandardMaterial({ color: "#e9e4da", roughness: 0.3 }),
      pendant: new THREE.MeshStandardMaterial({
        color: "#d99a4e",
        emissive: new THREE.Color("#ff9a3c"),
        emissiveIntensity: 1.1,
        roughness: 0.5,
      }),
      flame: new THREE.MeshStandardMaterial({
        color: "#fff",
        emissive: new THREE.Color("#ffb14e"),
        emissiveIntensity: 5,
      }),
      awning: new THREE.MeshStandardMaterial({ color: "#121110", roughness: 0.8, side: THREE.DoubleSide }),
    };
  }, []);
}

type Mats = ReturnType<typeof useMaterials>;

/* --------------------------------------------------------------- helpers */

function Wall({ seg, mats }: { seg: WallSeg; mats: Mats }) {
  const { x1, z1, x2, z2, h, t, kind } = seg;
  const len = Math.hypot(x2 - x1, z2 - z1) + t;
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;
  const rotY = Math.abs(x2 - x1) >= Math.abs(z2 - z1) ? 0 : Math.PI / 2;
  const mat =
    kind === "glass" ? mats.glass
    : kind === "brick" ? mats.brick
    : kind === "low" ? mats.black
    : h <= 5.5 ? mats.innerWall
    : mats.wall;
  return (
    <group position={[cx, 0, cz]} rotation={[0, rotY, 0]}>
      <mesh material={mat} position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, h, t]} />
      </mesh>
      {kind === "glass" && (
        <>
          <mesh material={mats.gold} position={[0, h + 0.12, 0]}>
            <boxGeometry args={[len, 0.24, t + 0.14]} />
          </mesh>
          <mesh material={mats.black} position={[0, 0.25, 0]}>
            <boxGeometry args={[len, 0.5, t + 0.1]} />
          </mesh>
        </>
      )}
      {kind === "low" && (
        <mesh material={mats.gold} position={[0, h, 0]}>
          <boxGeometry args={[len, 0.1, t + 0.1]} />
        </mesh>
      )}
    </group>
  );
}

/* ----------------------------------------------------------------- parts */

function Floors({ mats }: { mats: Mats }) {
  return (
    <group>
      <mesh material={mats.floor} position={[PLAN.width / 2, -0.15, PLAN.depth / 2]} receiveShadow>
        <boxGeometry args={[PLAN.width, 0.3, PLAN.depth]} />
      </mesh>
      {ZONES.map((z, i) => (
        <mesh
          key={i}
          material={z.kind === "deck" ? mats.deck : z.kind === "slab" ? mats.plinth : mats.smoke}
          position={[z.x + z.w / 2, z.kind === "deck" ? 0.07 : 0.03, z.z + z.d / 2]}
          receiveShadow
        >
          <boxGeometry args={[z.w, z.kind === "deck" ? 0.14 : 0.06, z.d]} />
        </mesh>
      ))}
    </group>
  );
}

function hatchTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#26211d";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(201,177,140,0.16)";
  ctx.lineWidth = 2;
  for (let i = -256; i < 512; i += 22) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i + 256, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 5);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Core({ mats }: { mats: Mats }) {
  const hatch = useMemo(() => hatchTexture(), []);
  return (
    <group>
      <mesh material={mats.smoke} position={[CORE.x + CORE.w / 2, 3.25, CORE.z + CORE.d / 2]} castShadow receiveShadow>
        <boxGeometry args={[CORE.w, 6.5, CORE.d]} />
      </mesh>
      {/* hatched cap echoing the plan's N.I.C. crosshatch */}
      <mesh position={[CORE.x + CORE.w / 2, 6.53, CORE.z + CORE.d / 2]}>
        <boxGeometry args={[CORE.w - 0.01, 0.04, CORE.d - 0.01]} />
        <meshStandardMaterial map={hatch} roughness={0.9} />
      </mesh>
      {COLUMNS.map(([x, z], i) => (
        <mesh key={i} material={mats.black} position={[x, 3.4, z]} castShadow>
          <boxGeometry args={[1.1, 6.8, 1.1]} />
        </mesh>
      ))}
    </group>
  );
}

function Rooms({ mats }: { mats: Mats }) {
  return (
    <group>
      {ROOMS.map((r, i) => (
        <mesh
          key={i}
          material={mats.innerWall}
          position={[r.x + r.w / 2, 2.25, r.z + r.d / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[r.w, 4.5, r.d]} />
        </mesh>
      ))}
      <mesh material={mats.chrome} position={[WH_POS[0], 1.8, WH_POS[1]]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 3.6, 16]} />
      </mesh>
      <mesh material={mats.woodDark} position={[POS_DESK.x + POS_DESK.w / 2, 1.7, POS_DESK.z + POS_DESK.d / 2]} castShadow>
        <boxGeometry args={[POS_DESK.w, 3.4, POS_DESK.d]} />
      </mesh>
    </group>
  );
}

function Furniture({ mats }: { mats: Mats }) {
  const tableTop = useMemo(() => new THREE.BoxGeometry(1, 0.16, 1), []);
  const pedestal = useMemo(() => new THREE.CylinderGeometry(0.13, 0.38, 2.4, 10), []);
  const seat = useMemo(() => new THREE.BoxGeometry(1.45, 0.14, 1.45), []);
  const back = useMemo(() => new THREE.BoxGeometry(1.45, 1.4, 0.12), []);
  const stoolTop = useMemo(() => new THREE.CylinderGeometry(0.58, 0.58, 0.16, 14), []);
  const stoolLeg = useMemo(() => new THREE.CylinderGeometry(0.08, 0.18, 2.2, 8), []);
  const candle = useMemo(() => new THREE.SphereGeometry(0.09, 8, 8), []);
  return (
    <group>
      <Instances limit={TABLES.length} geometry={tableTop} material={mats.wood} castShadow>
        {TABLES.map((t, i) => (
          <Instance key={i} position={[t.x, 2.5, t.z]} scale={[t.w, 1, t.d]} />
        ))}
      </Instances>
      <Instances limit={TABLES.length} geometry={pedestal} material={mats.black}>
        {TABLES.map((t, i) => (
          <Instance key={i} position={[t.x, 1.2, t.z]} />
        ))}
      </Instances>
      <Instances limit={TABLES.length} geometry={candle} material={mats.flame}>
        {TABLES.map((t, i) => (
          <Instance key={i} position={[t.x + 0.5, 2.68, t.z + 0.3]} />
        ))}
      </Instances>
      <Instances limit={CHAIRS.length} geometry={seat} material={mats.white} castShadow>
        {CHAIRS.map((c, i) => (
          <Instance key={i} position={[c.x, 1.5, c.z]} rotation={[0, c.rot, 0]} />
        ))}
      </Instances>
      <Instances limit={CHAIRS.length} geometry={back} material={mats.white}>
        {CHAIRS.map((c, i) => {
          const dx = Math.sin(c.rot) * 0.67;
          const dz = Math.cos(c.rot) * 0.67;
          return <Instance key={i} position={[c.x - dx, 2.2, c.z - dz]} rotation={[0, c.rot, 0]} />;
        })}
      </Instances>
      <Instances limit={STOOLS.length} geometry={stoolTop} material={mats.black} castShadow>
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
      {BOOTHS.map(({ x, z }, i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh material={mats.wood} position={[0, 2.4, 0]} castShadow>
            <boxGeometry args={[5.5, 0.16, 2.4]} />
          </mesh>
          <mesh material={mats.black} position={[0, 1.2, 0]}>
            <boxGeometry args={[0.5, 2.3, 0.5]} />
          </mesh>
          {[-1, 1].map((side) => (
            <group key={side} position={[0, 0, side * 2.0]}>
              <mesh material={mats.leather} position={[0, 0.85, 0]} castShadow>
                <boxGeometry args={[5.5, 1.7, 1.3]} />
              </mesh>
              <mesh material={mats.leather} position={[0, 2.0, side * 0.55]}>
                <boxGeometry args={[5.5, 1.5, 0.35]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function SushiBar({ mats }: { mats: Mats }) {
  const arms = [SUSHI.north, SUSHI.east, SUSHI.inner];
  return (
    <group>
      {arms.map((a, i) => {
        const w = a.x2 - a.x1;
        const d = a.z2 - a.z1;
        const cx = a.x1 + w / 2;
        const cz = a.z1 + d / 2;
        return (
          <group key={i}>
            <mesh material={mats.black} position={[cx, 1.6, cz]} castShadow>
              <boxGeometry args={[w - 0.2, 3.2, d - 0.2]} />
            </mesh>
            <mesh material={mats.counterWhite} position={[cx, 3.3, cz]} castShadow>
              <boxGeometry args={[w + 0.5, 0.22, d + 0.5]} />
            </mesh>
          </group>
        );
      })}
      {/* refrigerated case along the north arm */}
      <mesh material={mats.glass} position={[36, 3.9, 44.6]} castShadow>
        <boxGeometry args={[10, 0.9, 1.3]} />
      </mesh>
      {/* bamboo screen behind the inner prep counter */}
      <Instances
        limit={16}
        geometry={new THREE.CylinderGeometry(0.13, 0.13, 5.4, 8)}
        material={mats.bamboo}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <Instance key={i} position={[26.6 + i * 1.0, 2.7, 52.4]} />
        ))}
      </Instances>
    </group>
  );
}

function SpiritsBar({ mats }: { mats: Mats }) {
  const f = SPIRITS.front;
  const b = SPIRITS.back;
  const r = SPIRITS.returnE;
  const fw = f.x2 - f.x1;
  return (
    <group>
      {/* front counter — vermilion lacquer base, walnut top */}
      <mesh material={mats.verm} position={[f.x1 + fw / 2, 1.6, f.z + f.depth / 2]} castShadow>
        <boxGeometry args={[fw, 3.2, f.depth]} />
      </mesh>
      <mesh material={mats.wood} position={[f.x1 + fw / 2, 3.35, f.z + f.depth / 2]} castShadow>
        <boxGeometry args={[fw + 0.8, 0.28, f.depth + 0.9]} />
      </mesh>
      {/* flap + east return */}
      <mesh material={mats.wood} position={[(SPIRITS.flapW.x1 + SPIRITS.flapW.x2) / 2, 3.35, f.z + f.depth / 2]}>
        <boxGeometry args={[SPIRITS.flapW.x2 - SPIRITS.flapW.x1 + 0.3, 0.24, f.depth + 0.9]} />
      </mesh>
      <mesh material={mats.verm} position={[r.x + r.depth / 2, 1.6, (r.z1 + r.z2) / 2]} castShadow>
        <boxGeometry args={[r.depth, 3.2, r.z2 - r.z1]} />
      </mesh>
      <mesh material={mats.wood} position={[r.x + r.depth / 2, 3.35, (r.z1 + r.z2) / 2]}>
        <boxGeometry args={[r.depth + 0.8, 0.28, r.z2 - r.z1 + 0.6]} />
      </mesh>
      {/* brass foot rail */}
      <mesh material={mats.gold} position={[f.x1 + fw / 2, 0.8, f.z - 0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, fw - 1, 8]} />
      </mesh>
      {/* back bar: charred base, bottle rows, glowing shelf line */}
      <mesh material={mats.woodDark} position={[b.x1 + (b.x2 - b.x1) / 2, 1.9, b.z + b.depth / 2]} castShadow>
        <boxGeometry args={[b.x2 - b.x1, 3.8, b.depth]} />
      </mesh>
      <mesh position={[b.x1 + (b.x2 - b.x1) / 2, 3.95, b.z + b.depth / 2]}>
        <boxGeometry args={[b.x2 - b.x1 - 0.5, 0.1, b.depth - 0.4]} />
        <meshStandardMaterial color={COLORS.goldSoft} emissive="#d9a84e" emissiveIntensity={0.65} />
      </mesh>
      <Instances
        limit={26}
        geometry={new THREE.CylinderGeometry(0.11, 0.13, 0.95, 8)}
        material={mats.glass}
      >
        {Array.from({ length: 26 }, (_, i) => (
          <Instance key={i} position={[59.6 + i * 1.1, 4.5, b.z + b.depth / 2]} />
        ))}
      </Instances>
    </group>
  );
}

function Rails({ mats }: { mats: Mats }) {
  return (
    <group>
      {/* core south drink rail */}
      <mesh material={mats.wood} position={[(RAIL_SOUTH.x1 + RAIL_SOUTH.x2) / 2, 3.3, RAIL_SOUTH.z + RAIL_SOUTH.depth / 2]} castShadow>
        <boxGeometry args={[RAIL_SOUTH.x2 - RAIL_SOUTH.x1, 0.22, RAIL_SOUTH.depth]} />
      </mesh>
      <mesh material={mats.black} position={[(RAIL_SOUTH.x1 + RAIL_SOUTH.x2) / 2, 1.65, RAIL_SOUTH.z + RAIL_SOUTH.depth / 2]}>
        <boxGeometry args={[RAIL_SOUTH.x2 - RAIL_SOUTH.x1 - 0.5, 3.2, 0.4]} />
      </mesh>
      {/* core east drink rail */}
      <mesh material={mats.wood} position={[RAIL_EAST.x + RAIL_EAST.depth / 2, 3.3, (RAIL_EAST.z1 + RAIL_EAST.z2) / 2]} castShadow>
        <boxGeometry args={[RAIL_EAST.depth, 0.22, RAIL_EAST.z2 - RAIL_EAST.z1]} />
      </mesh>
      <mesh material={mats.black} position={[RAIL_EAST.x + RAIL_EAST.depth / 2, 1.65, (RAIL_EAST.z1 + RAIL_EAST.z2) / 2]}>
        <boxGeometry args={[0.4, 3.2, RAIL_EAST.z2 - RAIL_EAST.z1 - 0.5]} />
      </mesh>
    </group>
  );
}

function Entry({ mats }: { mats: Mats }) {
  return (
    <group>
      {/* vermilion entry doors in the vestibule wall */}
      <mesh material={mats.verm} position={[101, 3.3, 51.6]} castShadow>
        <boxGeometry args={[3.8, 6.6, 0.45]} />
      </mesh>
      <mesh material={mats.gold} position={[101, 3.3, 51.3]}>
        <boxGeometry args={[3.4, 0.1, 0.1]} />
      </mesh>
      {/* east patio door */}
      <mesh material={mats.verm} position={[105.5, 3.3, 36.5]} castShadow>
        <boxGeometry args={[0.45, 6.6, 2.8]} />
      </mesh>
      {/* host stand */}
      <mesh material={mats.verm} position={[HOST_STAND.x, 1.9, HOST_STAND.z]} castShadow>
        <boxGeometry args={[1.6, 3.8, 2.6]} />
      </mesh>
      <mesh material={mats.wood} position={[HOST_STAND.x, 3.9, HOST_STAND.z]}>
        <boxGeometry args={[1.9, 0.16, 2.9]} />
      </mesh>
    </group>
  );
}

function Blocks({ mats }: { mats: Mats }) {
  return (
    <group>
      {BLOCKS.map((b, i) => (
        <mesh
          key={i}
          material={b.color === COLORS.chrome ? mats.chrome : mats.woodDark}
          position={[b.x + b.w / 2, b.h / 2, b.z + b.d / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[b.w, b.h, b.d]} />
        </mesh>
      ))}
    </group>
  );
}

function Planters({ mats }: { mats: Mats }) {
  return (
    <group>
      {PLANTERS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh material={mats.black} position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[1.7, 1.6, 1.7]} />
          </mesh>
          {Array.from({ length: 5 }, (_, j) => {
            const a = (j / 5) * Math.PI * 2;
            return (
              <mesh
                key={j}
                material={mats.bamboo}
                position={[Math.cos(a) * 0.4, 3.1, Math.sin(a) * 0.4]}
                rotation={[Math.cos(a) * 0.07, 0, Math.sin(a) * 0.07]}
              >
                <cylinderGeometry args={[0.06, 0.08, 4.6, 6]} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function Pendants({ mats }: { mats: Mats }) {
  const cone = useMemo(() => new THREE.ConeGeometry(0.52, 1.2, 12, 1, true), []);
  const cord = useMemo(() => new THREE.CylinderGeometry(0.018, 0.018, 2.6, 4), []);
  return (
    <group>
      <Instances limit={PENDANTS.length} geometry={cone} material={mats.pendant}>
        {PENDANTS.map(([x, z], i) => (
          <Instance key={i} position={[x, 6.6, z]} />
        ))}
      </Instances>
      <Instances limit={PENDANTS.length} geometry={cord} material={mats.black}>
        {PENDANTS.map(([x, z], i) => (
          <Instance key={i} position={[x, 8.4, z]} />
        ))}
      </Instances>
    </group>
  );
}

/* ---------------------------------------------- exterior street dressing */

function signTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 192;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0d0c0b";
  ctx.fillRect(0, 0, 1024, 192);
  ctx.strokeStyle = "#b5341c";
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, 996, 164);
  ctx.fillStyle = "#f3ede2";
  ctx.textAlign = "center";
  ctx.font = "600 74px Jost, ui-sans-serif, sans-serif";
  ctx.fillText("B A M B O O", 512, 92);
  ctx.font = "500 34px Jost, ui-sans-serif, sans-serif";
  ctx.fillStyle = "#c8a858";
  ctx.fillText("O N   M A R K E T", 512, 150);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Exterior({ mats }: { mats: Mats }) {
  const sign = useMemo(() => signTexture(), []);
  useEffect(() => () => sign.dispose(), [sign]);
  return (
    <group>
      {/* sidewalk apron along the street faces */}
      <mesh material={mats.plinth} position={[PLAN.width / 2, -0.04, -3.4]} receiveShadow>
        <boxGeometry args={[PLAN.width + 14, 0.22, 7]} />
      </mesh>
      <mesh material={mats.plinth} position={[PLAN.width + 3.5, -0.04, PLAN.depth / 2]} receiveShadow>
        <boxGeometry args={[7, 0.22, PLAN.depth + 14]} />
      </mesh>
      {/* blade sign on the storefront face, per the exterior photo */}
      <mesh position={[27.5, 8.4, 4.85]}>
        <boxGeometry args={[14, 2.6, 0.5]} />
        <meshStandardMaterial map={sign} emissive="#5a4a30" emissiveIntensity={0.45} />
      </mesh>
      <mesh material={mats.verm} position={[27.5, 8.4, 5.2]}>
        <boxGeometry args={[14.4, 3.0, 0.12]} />
      </mesh>
      {/* black storefront awnings on the glazed faces */}
      {[
        { x: 12.5, w: 12, z: 6.1 },
        { x: 40, w: 16, z: 6.1 },
        { x: 87, w: 19, z: 14.1 },
      ].map((a, i) => (
        <mesh
          key={i}
          material={mats.awning}
          position={[a.x, 7.0, a.z]}
          rotation={[Math.PI / 7, 0, 0]}
          castShadow
        >
          <boxGeometry args={[a.w, 0.12, 3.2]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- labels */

function makeLabelTexture(text: string, color: string) {
  const pad = 48;
  const font = "500 64px Jost, ui-sans-serif, sans-serif";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  const spaced = text.split("").join("  ");
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
    [text, minor, fontsReady],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  const h = minor ? 1.4 : 2.1;
  const over_core = x > 49 && x < 77 && z < 36;
  return (
    <sprite position={[x, over_core ? 8.2 : minor ? 5.2 : 7.6, z]} scale={[h * aspect, h, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function Plinth({ mats }: { mats: Mats }) {
  return (
    <group>
      <mesh material={mats.plinth} position={[PLAN.width / 2, -1.45, PLAN.depth / 2]} receiveShadow>
        <boxGeometry args={[PLAN.width + 22, 2.3, PLAN.depth + 22]} />
      </mesh>
      <mesh material={mats.gold} position={[PLAN.width / 2, -0.32, PLAN.depth / 2]}>
        <boxGeometry args={[PLAN.width + 22.4, 0.08, PLAN.depth + 22.4]} />
      </mesh>
    </group>
  );
}

export default function FloorPlanModel() {
  const mats = useMaterials();
  return (
    <group position={[-PLAN.center[0], 0, -PLAN.center[1]]}>
      <Plinth mats={mats} />
      <Exterior mats={mats} />
      <Floors mats={mats} />
      {WALLS.map((w, i) => (
        <Wall key={i} seg={w} mats={mats} />
      ))}
      <Core mats={mats} />
      <Rooms mats={mats} />
      <Blocks mats={mats} />
      <Furniture mats={mats} />
      <Booths mats={mats} />
      <SushiBar mats={mats} />
      <SpiritsBar mats={mats} />
      <Rails mats={mats} />
      <Entry mats={mats} />
      <Planters mats={mats} />
      <Pendants mats={mats} />
      {LABELS.map((l, i) => (
        <LabelSprite key={i} {...l} />
      ))}
    </group>
  );
}
