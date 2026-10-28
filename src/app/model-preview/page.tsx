import type { Metadata } from "next";
import FloorPlanViewer from "@/components/market/floorplan/FloorPlanViewer";

/**
 * Dev-only preview harness for the 3D floor model. Unlinked and noindexed;
 * delete (or fold into a public page + CMS wiring) once the model is
 * integrated into the site proper.
 */
export const metadata: Metadata = {
  title: "Floor Model Preview",
  robots: { index: false, follow: false },
};

export default function ModelPreviewPage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#0f0e0d]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 30%, rgba(43,37,32,0.9) 0%, rgba(15,14,13,1) 75%)",
        }}
      />
      <div className="absolute inset-0">
        <FloorPlanViewer />
      </div>
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex flex-col items-center gap-2 pt-8 text-center">
        <p className="font-[family-name:var(--font-jost)] text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-gold,#b08d3e)]">
          423 Market St · Chattanooga
        </p>
        <h1 className="font-[family-name:var(--font-mincho)] text-2xl tracking-[0.12em] text-[#f3ede2]">
          Bamboo on Market — The Room
        </h1>
      </header>
      <footer className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-6">
        <p className="font-[family-name:var(--font-jost)] text-[10px] uppercase tracking-[0.3em] text-[#c9b18c]/70">
          Drag to orbit · Scroll to zoom · Right-drag to pan
        </p>
      </footer>
    </main>
  );
}
