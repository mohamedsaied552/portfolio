"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, Ring } from "@react-three/drei";
import * as THREE from "three";
import { stats, timeline } from "@/data/stats";
import { GlowingOrb } from "@/components/three/GlowingOrb";
import { HologramPanel } from "@/components/three/HologramPanel";

interface AboutSceneProps {
  visible: number;
}

export function AboutScene({ visible }: AboutSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.visible = visible > 0.01;
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((m) => {
            if ("opacity" in m) {
              m.transparent = true;
              m.opacity = Math.min(1, visible * 1.5);
            }
          });
        }
      });
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      {/* Holographic profile ring */}
      <group position={[0, 1, 0]}>
        <mesh ref={ringRef}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={1}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8 * visible}
          />
        </mesh>

        <Ring args={[2.3, 2.35, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#0066ff" transparent opacity={0.3 * visible} side={THREE.DoubleSide} />
        </Ring>

        {/* Profile avatar placeholder - holographic sphere */}
        <Float speed={2} floatIntensity={0.3}>
          <mesh>
            <icosahedronGeometry args={[0.8, 2]} />
            <meshStandardMaterial
              color="#0a1628"
              emissive="#00d4ff"
              emissiveIntensity={0.3}
              wireframe
              transparent
              opacity={0.6 * visible}
            />
          </mesh>
        </Float>

        {/* Orbiting stat cards */}
        {stats.map((stat, i) => {
          const angle = (i / stats.length) * Math.PI * 2;
          const radius = 3.5;
          return (
            <Float key={stat.label} speed={1.5 + i * 0.2} floatIntensity={0.2}>
              <group
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(i * 0.5) * 0.5,
                  Math.sin(angle) * radius,
                ]}
              >
                <HologramPanel
                  scale={[1.2, 0.8, 1]}
                  color={i % 2 === 0 ? "#00d4ff" : "#0066ff"}
                />
                <Text
                  position={[0, 0.15, 0.01]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  fillOpacity={visible}
                >
                  {stat.value}{stat.suffix}
                </Text>
                <Text
                  position={[0, -0.1, 0.01]}
                  fontSize={0.08}
                  color="#8892b0"
                  anchorX="center"
                  anchorY="middle"
                  fillOpacity={visible * 0.8}
                >
                  {stat.label.toUpperCase()}
                </Text>
              </group>
            </Float>
          );
        })}
      </group>

      {/* Timeline arc */}
      <group position={[0, -1, -2]}>
        {timeline.map((item, i) => {
          const angle = (i / (timeline.length - 1)) * Math.PI - Math.PI / 2;
          const radius = 4;
          return (
            <Float key={item.year} speed={1 + i * 0.1} floatIntensity={0.15}>
              <group
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * 0.8 + 1,
                  0,
                ]}
              >
                <GlowingOrb
                  color={item.type === "highlight" ? "#ff6b35" : "#00d4ff"}
                  size={item.type === "highlight" ? 0.12 : 0.08}
                />
                <Text
                  position={[0, 0.25, 0]}
                  fontSize={0.1}
                  color="#00d4ff"
                  anchorX="center"
                  fillOpacity={visible}
                >
                  {item.year}
                </Text>
              </group>
            </Float>
          );
        })}

        {/* Timeline connecting arc */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[4, 0.005, 8, 64, Math.PI]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.2 * visible} />
        </mesh>
      </group>

      <pointLight position={[0, 3, 3]} intensity={3} color="#00d4ff" distance={15} />
      <pointLight position={[-3, 2, 0]} intensity={1.5} color="#0066ff" distance={10} />
    </group>
  );
}
