"use client";

// Renders authored part transforms within one stable whole-cycle camera envelope.

import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import type { Assembly } from "./schema";
import { assemblyPose, motionEnvelope } from "./motion-pose";

const colors = { ink: "#556b80", amber: "#e6b66f", teal: "#77b9b3", paper: "#e9dfce" };

export default function AssemblyMotionCanvas({
  assembly,
  progress,
  onInteract,
  onReady,
}: {
  assembly: Assembly;
  progress: number;
  onInteract: () => void;
  onReady: () => void;
}) {
  const envelope = useMemo(() => motionEnvelope(assembly), [assembly]);

  return (
    <Canvas
      camera={{ position: [4.8, 3, 6], fov: 36 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      aria-label="Moving schematic object"
      onCreated={onReady}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 6, 4]} intensity={3} />
      <directionalLight position={[-4, 2, -3]} intensity={2} />
      <Bounds fit clip observe margin={1.2} maxDuration={0}>
        <mesh visible={false} position={envelope.center}>
          <boxGeometry args={envelope.size} />
          <meshBasicMaterial />
        </mesh>
        {assembly.parts.map((part) => {
          const pose = assemblyPose(assembly, part.id, progress);

          return (
            <mesh key={part.id} position={pose.position} rotation={pose.rotation}>
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
                metalness={0.25}
                roughness={0.3}
                transparent={part.shape === "cylinder"}
                opacity={part.shape === "cylinder" ? 0.3 : 1}
              />
            </mesh>
          );
        })}
      </Bounds>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={Math.hypot(...envelope.size) * 0.4}
        maxDistance={Math.hypot(...envelope.size) * 6}
        onStart={onInteract}
      />
    </Canvas>
  );
}
