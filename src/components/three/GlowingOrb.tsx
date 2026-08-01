"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlowingOrbProps {
  position?: [number, number, number];
  color?: string;
  size?: number;
  pulseSpeed?: number;
}

export function GlowingOrb({
  position = [0, 0, 0],
  color = "#00d4ff",
  size = 0.3,
  pulseSpeed = 2,
}: GlowingOrbProps) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15;
    if (ref.current) ref.current.scale.setScalar(pulse);
    if (glowRef.current) {
      glowRef.current.scale.setScalar(pulse * 2);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
