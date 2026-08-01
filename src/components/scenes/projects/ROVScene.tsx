"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { Particles } from "@/components/three/Particles";

interface ROVSceneProps {
  visible: number;
  localProgress: number;
}

function Bubble({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const startY = useRef(position[1]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.y += speed * delta;
      if (ref.current.position.y > 5) {
        ref.current.position.y = startY.current;
      }
      ref.current.position.x += Math.sin(ref.current.position.y * 2) * 0.002;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03 + Math.random() * 0.05, 8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.3} metalness={0.1} roughness={0} />
    </mesh>
  );
}

function Fish({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed) * 5;
      ref.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * speed * 0.7) * 3;
      ref.current.rotation.y = Math.atan2(
        Math.cos(state.clock.elapsedTime * speed),
        Math.sin(state.clock.elapsedTime * speed * 0.7)
      );
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.3, 4]} />
        <meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function ROVSubmarine() {
  const ref = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 2;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (armRef.current) {
      armRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      armRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={ref} position={[0, -2, 0]}>
      {/* Main body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.4, 1.2, 8, 16]} />
        <meshStandardMaterial color="#1a3040" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.2, 0.3]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Propellers */}
      {[[-0.5, 0, 0], [0.5, 0, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* Manipulator arm */}
      <group ref={armRef} position={[0, -0.3, 0.6]}>
        <mesh>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#2a4050" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.3, 0.15]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial color="#2a4050" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Gripper */}
        <mesh position={[0, -0.5, 0.3]}>
          <boxGeometry args={[0.15, 0.04, 0.04]} />
          <meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={0.5} />
        </mesh>
      </group>
      {/* Search lights */}
      <spotLight
        ref={lightRef}
        position={[0, 0, 0.8]}
        angle={0.4}
        penumbra={0.5}
        intensity={5}
        color="#ffffff"
        distance={15}
        castShadow
      />
    </group>
  );
}

export function ROVScene({ visible }: ROVSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const bubbles = useMemo(
    () =>
      Array.from({ length: 40 }).map(() => ({
        position: [
          (Math.random() - 0.5) * 15,
          -5 + Math.random() * 8,
          (Math.random() - 0.5) * 15,
        ] as [number, number, number],
        speed: 0.3 + Math.random() * 0.5,
      })),
    []
  );

  useFrame(() => {
    if (groupRef.current) groupRef.current.visible = visible > 0.01;
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#001520", 5, 30]} />

      {/* Ocean floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 32, 32]} />
        <meshStandardMaterial color="#0a2030" metalness={0.2} roughness={0.9} />
      </mesh>

      {/* Sand dunes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            -4.8,
            (Math.random() - 0.5) * 20,
          ]}
          rotation={[0, Math.random() * Math.PI, 0]}
        >
          <sphereGeometry args={[1 + Math.random(), 8, 8]} />
          <meshStandardMaterial color="#1a3040" roughness={1} />
        </mesh>
      ))}

      {/* Water volume effect */}
      <mesh>
        <boxGeometry args={[40, 15, 40]} />
        <meshStandardMaterial
          color="#001520"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      <ROVSubmarine />

      {/* Bubbles */}
      {bubbles.map((b, i) => (
        <Bubble key={i} position={b.position} speed={b.speed} />
      ))}

      {/* Fish */}
      <Fish position={[3, -1, 2]} speed={0.3} />
      <Fish position={[-4, -3, -1]} speed={0.5} />
      <Fish position={[1, -2, -4]} speed={0.4} />

      {/* Sonar rings */}
      <Float speed={0.5} floatIntensity={0.1}>
        {[1, 2, 3].map((r, i) => (
          <mesh key={i} position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r * 2, r * 2 + 0.05, 32]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.1 - i * 0.03} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </Float>

      {/* Research lab structure */}
      <mesh position={[8, -3, 0]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#1a3040" metalness={0.7} roughness={0.4} transparent opacity={0.8} />
      </mesh>

      <Particles count={100} spread={25} color="#06b6d4" size={0.01} opacity={0.2} speed={0.1} />

      <ambientLight intensity={0.1} color="#001520" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#06b6d4" distance={20} />
      <hemisphereLight args={["#001520", "#000810", 0.5]} />
    </group>
  );
}
