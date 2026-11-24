"use client";

// Lazy Rapier pendulum simulation with app-owned reset and playback state.

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody, useRevoluteJoint, type RapierRigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { Mesh, Vector3 } from "three";

function Pendulum({ length }: { length: number }) {
  const pivot = useRef<RapierRigidBody>(null!);
  const bob = useRef<RapierRigidBody>(null!);
  const rod = useRef<Mesh>(null);
  const start = (10 * Math.PI) / 180;
  const direction = useRef(new Vector3());
  const up = useRef(new Vector3(0, 1, 0));

  useRevoluteJoint(pivot, bob, [
    [0, 0, 0],
    [-length * Math.sin(start), length * Math.cos(start), 0],
    [0, 0, 1],
  ]);
  useFrame(() => {
    if (!bob.current || !rod.current) return;

    const p = bob.current.translation();

    direction.current.set(p.x, p.y - 1, p.z);
    rod.current.position.set(p.x / 2, (p.y + 1) / 2, p.z / 2);
    rod.current.scale.y = direction.current.length();
    rod.current.quaternion.setFromUnitVectors(up.current, direction.current.normalize());
  });

  return (
    <>
      <RigidBody ref={pivot} type="fixed" position={[0, 1, 0]} colliders={false}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 12]} />
          <meshStandardMaterial color="#e9dfce" />
        </mesh>
      </RigidBody>
      <RigidBody
        ref={bob}
        position={[length * Math.sin(start), 1 - length * Math.cos(start), 0]}
        colliders="ball"
        linearDamping={0}
        angularDamping={0}
      >
        <mesh>
          <sphereGeometry args={[0.09, 32, 24]} />
          <meshStandardMaterial color="#e6b66f" metalness={0.3} roughness={0.3} />
        </mesh>
      </RigidBody>
      <mesh ref={rod}>
        <cylinderGeometry args={[0.008, 0.008, 1, 12]} />
        <meshStandardMaterial color="#b0c7d3" />
      </mesh>
    </>
  );
}

export default function PendulumCanvas({
  length,
  gravity,
  running,
}: {
  length: number;
  gravity: number;
  running: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 4.5], fov: 38 }}
      dpr={[1, 1.5]}
      aria-label="Pendulum physics simulation"
    >
      <ambientLight intensity={2} />
      <directionalLight position={[3, 5, 4]} intensity={3} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -gravity, 0]} paused={!running} timeStep={1 / 120}>
          <Pendulum length={length} />
        </Physics>
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
