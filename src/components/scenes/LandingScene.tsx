"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Grid, Text } from "@react-three/drei";
import * as THREE from "three";
import { Particles } from "@/components/three/Particles";
import { HologramPanel } from "@/components/three/HologramPanel";
import { FloatingCable } from "@/components/three/FloatingCable";
import { GlowingOrb } from "@/components/three/GlowingOrb";

interface LandingSceneProps {
  visible: number;
}

export function LandingScene({ visible }: LandingSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const deskRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.visible = visible > 0.01;
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((m) => {
            if ("opacity" in m) {
              m.transparent = true;
              m.opacity = visible;
            }
          });
        }
      });
    }
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
    if (deskRef.current) {
      deskRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#030712", 15, 45]} />

      {/* Workspace floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.8} roughness={0.3} />
      </mesh>

      <Grid
        position={[0, 0.01, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#00d4ff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#0066ff"
        fadeDistance={35}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Main desk */}
      <group ref={deskRef}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 0.08, 2]} />
          <meshStandardMaterial color="#1a2332" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Desk legs */}
        {[[-1.8, -0.8], [1.8, -0.8], [-1.8, 0.8], [1.8, 0.8]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.2, z]} castShadow>
            <boxGeometry args={[0.08, 0.4, 0.08]} />
            <meshStandardMaterial color="#2a3544" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Holographic screens */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <HologramPanel position={[-2.5, 2, -1]} rotation={[0, 0.3, 0]} scale={[1.5, 1, 1]} />
      </Float>
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
        <HologramPanel position={[2.5, 2.5, -0.5]} rotation={[0, -0.3, 0]} scale={[1.8, 1.2, 1]} color="#0066ff" />
      </Float>
      <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.25}>
        <HologramPanel position={[0, 3.5, -2]} rotation={[0.1, 0, 0]} scale={[2.5, 1.5, 1]} />
      </Float>

      {/* Main monitor */}
      <group position={[0, 1.2, -0.3]}>
        <mesh ref={screenRef} castShadow>
          <boxGeometry args={[2, 1.2, 0.05]} />
          <meshStandardMaterial
            color="#0a1628"
            emissive="#00d4ff"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#2a3544" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Blueprint hologram */}
      <Float speed={1.2} floatIntensity={0.5}>
        <group position={[3, 1.5, 1]} rotation={[0, -0.5, 0]}>
          <mesh>
            <planeGeometry args={[1.5, 1.5]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.05} side={THREE.DoubleSide} />
          </mesh>
          {/* Blueprint grid lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={`h${i}`} position={[0, -0.75 + i * 0.3, 0.01]}>
              <planeGeometry args={[1.4, 0.005]} />
              <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Floating cables */}
      <FloatingCable start={[-3, 3, 0]} end={[-1, 1.5, -0.5]} />
      <FloatingCable start={[3, 3.5, 0]} end={[1, 2, -0.3]} color="#0066ff" />
      <FloatingCable start={[0, 4, -1]} end={[0, 2.5, -0.5]} />

      {/* Glowing orbs */}
      <GlowingOrb position={[-4, 2, 2]} color="#00d4ff" size={0.15} />
      <GlowingOrb position={[4, 3, 1]} color="#0066ff" size={0.12} />
      <GlowingOrb position={[0, 4.5, 0]} color="#00d4ff" size={0.1} />

      {/* Ambient particles */}
      <Particles count={300} spread={25} color="#00d4ff" size={0.02} opacity={0.4} />

      {/* 3D floating text labels */}
      <Float speed={1} floatIntensity={0.2}>
        <Text
          position={[-3, 3.2, 0]}
          fontSize={0.15}
          color="#00d4ff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.6 * visible}
        >
          SYSTEM ONLINE
        </Text>
      </Float>

      {/* Mechanical rotating ring */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.01, 8, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} />
      </mesh>

      {/* Point lights */}
      <pointLight position={[-3, 4, 2]} intensity={2} color="#00d4ff" distance={10} />
      <pointLight position={[3, 4, 2]} intensity={1.5} color="#0066ff" distance={10} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" distance={8} />
    </group>
  );
}
