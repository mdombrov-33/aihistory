"use client";

// Lazy Three.js view of supplied assembly parts and their separation/section state.

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds } from "@react-three/drei";
import { DoubleSide, Plane, Vector3 } from "three";
import { useMemo } from "react";
import { assemblyEnvelope } from "./envelope";
import type { Assembly } from "./schema";

const colors = { ink: "#556b80", amber: "#e6b66f", teal: "#77b9b3", paper: "#e9dfce" };

export default function AssemblyCanvas({
  assembly,
  explode,
  section,
  selected,
  onSelect,
  onInteract,
}: {
  assembly: Assembly;
  explode: number;
  section: boolean;
  selected: string;
  onSelect: (id: string) => void;
  onInteract: () => void;
}) {
  const envelope = useMemo(() => assemblyEnvelope(assembly), [assembly]);
  const plane = useMemo(() => [new Plane(new Vector3(-1, 0, 0), 0)], []);

  return (
    <Canvas
      camera={{ position: [5, 3.5, 7], fov: 38 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, localClippingEnabled: true }}
      aria-label="Interactive schematic assembly"
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 5]} intensity={3} />
      <directionalLight position={[-4, 1, -3]} intensity={1.5} />
      <Bounds fit clip observe margin={1.4} maxDuration={0}>
        {/* Frame the entire separation envelope so controls never move parts outside the initial view. */}
        <mesh visible={false} position={envelope.center}>
          <boxGeometry args={envelope.size} />
          <meshBasicMaterial />
        </mesh>
        <group>
          {assembly.parts.map((part) => (
            <mesh
              key={part.id}
              position={
                part.position.map((n, i) => n + part.separation[i] * explode) as [
                  number,
                  number,
                  number,
                ]
              }
              rotation={part.shape === "cylinder" ? [Math.PI / 2, 0, 0] : [0, 0, 0]}
              onClick={(event) => {
                event.stopPropagation();
                onInteract();
                onSelect(part.id);
              }}
            >
              {part.shape === "box" ? (
                <boxGeometry args={part.size} />
              ) : part.shape === "sphere" ? (
                <sphereGeometry args={[part.size[0], 32, 20]} />
              ) : part.shape === "ring" ? (
                <torusGeometry args={[part.size[0], part.size[1], 16, 64]} />
              ) : (
                <cylinderGeometry args={[part.size[0], part.size[1], part.size[2], 48]} />
              )}
              <meshStandardMaterial
                color={colors[part.color]}
                metalness={0.2}
                roughness={0.38}
                emissive={part.id === selected ? colors[part.color] : "#000000"}
                emissiveIntensity={0.2}
                clippingPlanes={section ? plane : []}
                side={DoubleSide}
              />
            </mesh>
          ))}
        </group>
      </Bounds>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2}
        maxDistance={24}
        onStart={onInteract}
      />
    </Canvas>
  );
}
