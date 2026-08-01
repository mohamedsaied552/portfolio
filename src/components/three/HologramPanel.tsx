"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HologramPanelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  label?: string;
}

export function HologramPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [2, 1.2, 1],
  color = "#00d4ff",
}: HologramPanelProps) {
  const ref = useRef<THREE.Mesh>(null);
  const borderRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    }
    if (borderRef.current) {
      borderRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  const borderGeometry = useRef(new THREE.EdgesGeometry(new THREE.PlaneGeometry(scale[0], scale[1])));

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={ref}>
        <planeGeometry args={[scale[0], scale[1]]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments ref={borderRef} geometry={borderGeometry.current}>
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineSegments>
      {/* Scan line */}
      <mesh position={[0, Math.sin(Date.now() * 0.001) * scale[1] * 0.4, 0.01]}>
        <planeGeometry args={[scale[0] * 0.9, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
