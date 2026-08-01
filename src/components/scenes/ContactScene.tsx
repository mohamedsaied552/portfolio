"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { HologramPanel } from "@/components/three/HologramPanel";
import { GlowingOrb } from "@/components/three/GlowingOrb";
import { Particles } from "@/components/three/Particles";
import { contactLinks } from "@/data/contact";

interface ContactSceneProps {
  visible: number;
}

export function ContactScene({ visible }: ContactSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const consoleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.visible = visible > 0.01;
    if (consoleRef.current) {
      consoleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#030712", 10, 35]} />

      {/* Control room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main console */}
      <group ref={consoleRef} position={[0, 0, 0]}>
        {/* Console desk - curved */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[8, 0.1, 3]} />
          <meshStandardMaterial color="#1a2332" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Main terminal screen */}
        <mesh position={[0, 1.5, -0.5]}>
          <boxGeometry args={[5, 2.5, 0.08]} />
          <meshStandardMaterial
            color="#0a1628"
            emissive="#00d4ff"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Side panels */}
        {[-3, 3].map((x, i) => (
          <mesh key={i} position={[x, 1.2, 0.5]} rotation={[0, x > 0 ? -0.3 : 0.3, 0]}>
            <boxGeometry args={[1.5, 1.8, 0.05]} />
            <meshStandardMaterial
              color="#0a1628"
              emissive="#0066ff"
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Floating contact terminals */}
      {contactLinks.map((link, i) => {
        const angle = (i / contactLinks.length) * Math.PI * 2;
        const radius = 4;
        return (
          <Float key={link.id} speed={1.5 + i * 0.2} floatIntensity={0.3}>
            <group
              position={[
                Math.cos(angle) * radius,
                2 + Math.sin(i) * 0.5,
                Math.sin(angle) * radius,
              ]}
            >
              <HologramPanel scale={[1.5, 1, 1]} color={i % 2 === 0 ? "#00d4ff" : "#0066ff"} />
              <Text
                position={[0, 0, 0.01]}
                fontSize={0.12}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fillOpacity={visible}
              >
                {link.label.toUpperCase()}
              </Text>
              <GlowingOrb position={[0, 0.8, 0]} color="#00d4ff" size={0.06} />
            </group>
          </Float>
        );
      })}

      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <torusGeometry args={[5, 0.01, 8, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.2} />
      </mesh>

      {/* Status indicators */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-2.5 + i * 1, 0.6, 1.4]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1 + Math.sin(i) * 0.5}
          />
        </mesh>
      ))}

      <Particles count={150} spread={20} color="#00d4ff" size={0.02} opacity={0.3} />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 0]} intensity={3} color="#00d4ff" distance={20} />
      <pointLight position={[0, 1, 3]} intensity={1.5} color="#0066ff" distance={10} />
    </group>
  );
}
