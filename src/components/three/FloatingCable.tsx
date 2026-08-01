"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingCableProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  segments?: number;
}

export function FloatingCable({
  start,
  end,
  color = "#00d4ff",
  segments = 20,
}: FloatingCableProps) {
  const ref = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 2,
      (start[1] + end[1]) / 2 + 1,
      (start[2] + end[2]) / 2 + (Math.random() - 0.5) * 2,
    ];
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
  }, [start, end]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={ref}>
      <tubeGeometry args={[curve, segments, 0.02, 8, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}
