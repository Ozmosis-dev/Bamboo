"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import FloorPlanModel from "./FloorPlanModel";

function Lights() {
  return (
    <>
      <hemisphereLight args={["#f3ede2", "#2b2520", 1.0]} />
      <ambientLight intensity={0.25} color="#f3ede2" />
      {/* warm key from the street side */}
      <directionalLight
        position={[70, 95, -65]}
        intensity={1.3}
        color="#ffe3ba"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-95}
        shadow-camera-right={95}
        shadow-camera-top={95}
        shadow-camera-bottom={-95}
        shadow-camera-near={10}
        shadow-camera-far={280}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-70, 45, 70]} intensity={0.22} color="#aebfc4" />
      {/* hospitality pools: sushi bar, spirits bar, core rails, dining rooms */}
      <pointLight position={[-18, 8, 15]} intensity={650} color="#e8b96a" distance={42} decay={2} />
      <pointLight position={[20, 8, 26]} intensity={780} color="#e8b96a" distance={46} decay={2} />
      <pointLight position={[10, 8, 3]} intensity={480} color="#ffdfae" distance={40} decay={2} />
      <pointLight position={[-22, 8, -18]} intensity={520} color="#ffdfae" distance={42} decay={2} />
      <pointLight position={[41, 8, -6]} intensity={460} color="#ffdfae" distance={38} decay={2} />
      <pointLight position={[11, 8, 14]} intensity={400} color="#e8b96a" distance={36} decay={2} />
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
      camera={{ position: [142, 58, 68], fov: 30, near: 1, far: 800 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.35;
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
        maxDistance={260}
        maxPolarAngle={Math.PI * 0.46}
        autoRotate={!interacted}
        autoRotateSpeed={0.55}
        onStart={() => setInteracted(true)}
      />
    </Canvas>
  );
}
