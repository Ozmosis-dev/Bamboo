"use client";

import dynamic from "next/dynamic";

/**
 * Public entry point for the 3D floor model.
 *
 * WebGL only runs in the browser, so the Canvas is loaded client-side with a
 * branded shimmer while the three.js bundle streams in. Drop this component
 * anywhere; it fills its parent (give the parent an explicit height).
 */
const FloorPlanCanvas = dynamic(() => import("./FloorPlanCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-[color:var(--color-seam)] border-t-[color:var(--color-gold)]"
          aria-hidden
        />
        <p className="font-[family-name:var(--font-jost)] text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-tatami)]">
          Building the room
        </p>
      </div>
    </div>
  ),
});

export default function FloorPlanViewer({ className }: { className?: string }) {
  return (
    <div
      className={className ?? "h-full w-full"}
      role="img"
      aria-label="Interactive 3D floor model of the Bamboo on Market dining room, sushi bar, spirits bar, and patios. Drag to orbit, scroll to zoom."
    >
      <FloorPlanCanvas />
    </div>
  );
}
