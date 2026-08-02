"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface CityGridProps {
  size?: number;
  blockSize?: number;
  maxHeight?: number;
  color?: string;
}

export const CityGrid = memo(function CityGrid({
  size = 8,
  blockSize = 2,
  maxHeight = 8,
  color = "#00d4ff",
}: CityGridProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const buildings = useMemo(() => {
    const result: Array<{
      pos: [number, number, number];
      w: number;
      d: number;
      h: number;
      tint: string;
    }> = [];

    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
        const h = 1 + Math.random() * maxHeight;
        const tint = new THREE.Color(color).offsetHSL(0, 0, Math.random() * 0.08).getStyle();
        result.push({
          pos: [x * blockSize, h / 2, z * blockSize],
          w: blockSize * (0.6 + Math.random() * 0.3),
          d: blockSize * (0.6 + Math.random() * 0.3),
          h,
          tint,
        });
      }
    }

    return result;
  }, [size, blockSize, maxHeight, color]);

  useEffect(() => {
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();

    buildings.forEach((building, index) => {
      tempObject.position.set(...building.pos);
      tempObject.scale.set(building.w, building.h, building.d);
      tempObject.updateMatrix();
      mesh.setMatrixAt(index, tempObject.matrix);
      tempColor.set(building.tint);
      mesh.setColorAt(index, tempColor);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [buildings]);

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a1628",
        emissive: color,
        emissiveIntensity: 0.15,
        metalness: 0.6,
        roughness: 0.4,
        vertexColors: true,
      }),
    [color]
  );

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[geometry, material, buildings.length]}
      castShadow
      receiveShadow
    />
  );
});
