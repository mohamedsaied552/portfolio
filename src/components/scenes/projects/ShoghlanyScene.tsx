"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { HologramPanel } from "@/components/three/HologramPanel";
import { Particles } from "@/components/three/Particles";

interface ShoghlanySceneProps {
  visible: number;
  localProgress: number;
}

function FloatingResume({ position, delay }: { position: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.3;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[0.8, 1.1, 0.02]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* Resume lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.4 - i * 0.15, 0.02]}>
          <planeGeometry args={[0.6, 0.04]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function JobCard({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.3}>
      <group position={position}>
        <mesh ref={ref}>
          <boxGeometry args={[1.2, 0.8, 0.05]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.08} color="#ffffff" anchorX="center" anchorY="middle">
          OPEN ROLE
        </Text>
      </group>
    </Float>
  );
}

export function ShoghlanyScene({ visible }: ShoghlanySceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matchRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.visible = visible > 0.01;
    if (matchRef.current) {
      matchRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#0a0520", 15, 45]} />

      {/* Office floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0f0a1a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Office walls */}
      <mesh position={[0, 2, -8]}>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#1a1030" metalness={0.5} roughness={0.5} transparent opacity={0.8} />
      </mesh>

      {/* Desk */}
      <mesh position={[0, 0.4, -3]} castShadow>
        <boxGeometry args={[6, 0.08, 2]} />
        <meshStandardMaterial color="#2a2040" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Floating resumes */}
      <FloatingResume position={[-3, 2, 0]} delay={0} />
      <FloatingResume position={[3, 2.5, 1]} delay={1} />
      <FloatingResume position={[-1, 3, 2]} delay={2} />
      <FloatingResume position={[2, 1.8, -1]} delay={3} />

      {/* Job cards */}
      <JobCard position={[-4, 2, -2]} color="#7c3aed" />
      <JobCard position={[4, 3, 0]} color="#a855f7" />
      <JobCard position={[0, 4, 3]} color="#6d28d9" />

      {/* Real-time matching animation - connecting lines */}
      <group ref={matchRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 3, 2, Math.sin(angle) * 3]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
            </mesh>
          );
        })}
      </group>

      {/* Central matching hub */}
      <Float speed={2} floatIntensity={0.2}>
        <HologramPanel position={[0, 3, 0]} scale={[2, 1.5, 1]} color="#a855f7" />
      </Float>

      <Particles count={150} spread={20} color="#a855f7" size={0.02} opacity={0.4} />

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={3} color="#a855f7" distance={20} />
      <pointLight position={[-5, 3, 3]} intensity={1.5} color="#7c3aed" distance={12} />
    </group>
  );
}
