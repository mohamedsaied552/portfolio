"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CityBlockProps {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  color?: string;
  emissive?: string;
  windowIntensity?: number;
}

export function CityBlock({
  position,
  width,
  depth,
  height,
  color = "#0a1628",
  emissive = "#00d4ff",
  windowIntensity = 0.3,
}: CityBlockProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        windowIntensity + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={windowIntensity}
        metalness={0.6}
        roughness={0.4}
      />
    </mesh>
  );
}

interface CityGridProps {
  size?: number;
  blockSize?: number;
  maxHeight?: number;
  color?: string;
}

export function CityGrid({
  size = 8,
  blockSize = 2,
  maxHeight = 8,
  color = "#00d4ff",
}: CityGridProps) {
  const buildings = useMemo(() => {
    const result: Array<{
      pos: [number, number, number];
      w: number;
      d: number;
      h: number;
    }> = [];
    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
        const h = 1 + Math.random() * maxHeight;
        result.push({
          pos: [x * blockSize, h / 2, z * blockSize],
          w: blockSize * (0.6 + Math.random() * 0.3),
          d: blockSize * (0.6 + Math.random() * 0.3),
          h,
        });
      }
    }
    return result;
  }, [size, blockSize, maxHeight]);

  return (
    <group>
      {buildings.map((b, i) => (
        <CityBlock
          key={i}
          position={b.pos}
          width={b.w}
          depth={b.d}
          height={b.h}
          emissive={color}
          windowIntensity={0.1 + Math.random() * 0.3}
        />
      ))}
    </group>
  );
}
