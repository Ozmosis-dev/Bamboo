"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import FloorPlanModel from "./FloorPlanModel";

function Lights() {
  return (
    <>
      {/* warm candlelit base, cool fill from the glazing side */}
      <hemisphereLight args={["#f3ede2", "#2b2520", 0.9]} />
      <ambientLight intensity={0.18} color="#f3ede2" />
      <directionalLight
        position={[70, 90, -55]}
        intensity={1.35}
        color="#ffe8c4"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
        shadow-camera-near={10}
        shadow-camera-far={260}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-60, 40, 60]} intensity={0.25} color="#aebfc4" />
      {/* hospitality glow over the two bars and the dining room */}
      <pointLight position={[-10, 9, 15]} intensity={520} color="#e8b96a" distance={46} decay={2} />
      <pointLight position={[16, 9, 31]} intensity={620} color="#e8b96a" distance={50} decay={2} />
      <pointLight position={[-24, 9, -14]} intensity={430} color="#ffdfae" distance={44} decay={2} />
      <pointLight position={[36, 9, 0]} intensity={340} color="#ffdfae" distance={40} decay={2} />
    </>
  );
}

export default function FloorPlanCanvas() {
  const [interacted, setInteracted] = useState(false);
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [95, 78, 118], fov: 30, near: 1, far: 800 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.25;
      }}
    >
      <Suspense fallback={null}>
        <FloorPlanModel />
      </Suspense>
      <Lights />
      <OrbitControls
        makeDefault
        target={[0, 1, 2]}
        enableDamping
        dampingFactor={0.08}
        minDistance={30}
        maxDistance={240}
        maxPolarAngle={Math.PI * 0.46}
        autoRotate={!interacted}
        autoRotateSpeed={0.55}
        onStart={() => setInteracted(true)}
      />
    </Canvas>
  );
}
