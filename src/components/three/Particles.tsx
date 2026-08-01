"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
  opacity?: number;
}

export function Particles({
  count = 500,
  color = "#00d4ff",
  size = 0.03,
  spread = 30,
  speed = 0.2,
  opacity = 0.6,
}: ParticlesProps) {
  const ref = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      vel[i * 3] = (Math.random() - 0.5) * speed;
      vel[i * 3 + 1] = Math.random() * speed * 0.5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }
    return [pos, vel];
  }, [count, spread, speed]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velocities[i * 3] * delta;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      if (Math.abs(posArray[i * 3]) > spread / 2) velocities[i * 3] *= -1;
      if (posArray[i * 3 + 1] > spread / 2 || posArray[i * 3 + 1] < -spread / 2)
        velocities[i * 3 + 1] *= -1;
      if (Math.abs(posArray[i * 3 + 2]) > spread / 2) velocities[i * 3 + 2] *= -1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
