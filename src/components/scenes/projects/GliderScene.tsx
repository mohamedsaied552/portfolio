"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { CityGrid } from "@/components/three/CityBlock";
import { Particles } from "@/components/three/Particles";
import { HologramPanel } from "@/components/three/HologramPanel";
import { GlowingOrb } from "@/components/three/GlowingOrb";

interface GliderSceneProps {
  visible: number;
  localProgress: number;
}

function Scooter({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5) * 3;
      ref.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * 0.5) * 3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.5 + Math.PI;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Scooter body */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.15, 0.8]} />
        <meshStandardMaterial color="#1a2332" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0, 0.5, 0.2]}>
        <boxGeometry args={[0.6, 0.03, 0.03]} />
        <meshStandardMaterial color="#2a3544" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0.2]}>
        <boxGeometry args={[0.03, 0.4, 0.03]} />
        <meshStandardMaterial color="#2a3544" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Wheels */}
      {[[-0.12, -0.05, 0.3], [0.12, -0.05, 0.3], [-0.12, -0.05, -0.3], [0.12, -0.05, -0.3]].map(
        ([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
            <meshStandardMaterial color="#333" metalness={0.7} roughness={0.4} />
          </mesh>
        )
      )}
      {/* LED strip */}
      <mesh position={[0, 0.08, 0.4]}>
        <boxGeometry args={[0.25, 0.02, 0.02]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
      </mesh>
      {/* Glow trail */}
      <pointLight position={[0, 0.2, -0.5]} intensity={1} color="#00d4ff" distance={3} />
    </group>
  );
}

function ChargingStation({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && i === 1) {
          (child.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 2;
        }
      });
    }
  });

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#1a2332" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.8, 0.26]}>
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function TrafficLight({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const activeLight = useRef(0);

  useFrame((state) => {
    activeLight.current = Math.floor(state.clock.elapsedTime % 6 / 2);
  });

  const colors = ["#ff0000", "#ffff00", "#00ff00"];

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#1a2332" metalness={0.8} roughness={0.3} />
      </mesh>
      {colors.map((color, i) => (
        <mesh key={i} position={[0, 0.2 - i * 0.2, 0.08]} ref={i === 0 ? ref : undefined}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={activeLight.current === i ? 2 : 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export function GliderScene({ visible, localProgress }: GliderSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const roadLines = useMemo(() => {
    const lines: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (let i = -10; i < 10; i += 2) {
      lines.push([
        new THREE.Vector3(-0.1, 0.02, i),
        new THREE.Vector3(0.1, 0.02, i + 1),
      ]);
    }
    return lines;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.visible = visible > 0.01;
    }
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#030712", 20, 60]} />

      {/* Ground / roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4, 40]} />
        <meshStandardMaterial color="#151c2c" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4, 40]} />
        <meshStandardMaterial color="#151c2c" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Road markings */}
      {roadLines.map((points, i) => (
        <Line key={i} points={points} color="#ffffff" lineWidth={1} transparent opacity={0.3} />
      ))}

      {/* City */}
      <CityGrid size={6} blockSize={2.5} maxHeight={10} color="#00d4ff" />

      {/* Scooter */}
      <Scooter position={[0, 0.15, 0]} />

      {/* Charging stations */}
      <ChargingStation position={[5, 0.75, 5]} />
      <ChargingStation position={[-5, 0.75, -5]} />
      <ChargingStation position={[5, 0.75, -5]} />

      {/* Traffic lights */}
      <TrafficLight position={[2.5, 1, 3]} />
      <TrafficLight position={[-2.5, 1, -3]} />

      {/* Holographic UI panels */}
      <Float speed={1.5} floatIntensity={0.3}>
        <HologramPanel position={[-6, 4, 0]} scale={[2, 1.5, 1]} label="Wallet" />
      </Float>
      <Float speed={2} floatIntensity={0.4}>
        <HologramPanel position={[6, 5, 2]} scale={[2.5, 1.8, 1]} color="#0066ff" />
      </Float>

      {/* GPS Route visualization */}
      <Line
        points={[
          new THREE.Vector3(0, 0.5, 0),
          new THREE.Vector3(3, 0.5, 3),
          new THREE.Vector3(5, 0.5, 1),
          new THREE.Vector3(7, 0.5, 4),
        ]}
        color="#00d4ff"
        lineWidth={2}
        transparent
        opacity={0.6 * localProgress}
      />

      {/* SignalR data pulses */}
      {Array.from({ length: 5 }).map((_, i) => (
        <GlowingOrb
          key={i}
          position={[
            Math.sin(i * 1.5) * 8,
            3 + i * 0.5,
            Math.cos(i * 1.5) * 8,
          ]}
          color="#00d4ff"
          size={0.08}
          pulseSpeed={2 + i * 0.5}
        />
      ))}

      {/* QR unlock hologram */}
      <Float speed={1} floatIntensity={0.2}>
        <group position={[0, 3, -5]}>
          <mesh>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
          </mesh>
          {/* QR pattern */}
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) =>
              Math.random() > 0.4 ? (
                <mesh
                  key={`${row}-${col}`}
                  position={[-0.4 + col * 0.2, 0.4 - row * 0.2, 0.01]}
                >
                  <planeGeometry args={[0.15, 0.15]} />
                  <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
                </mesh>
              ) : null
            )
          )}
        </group>
      </Float>

      {/* Drone camera indicator */}
      <Float speed={0.5} floatIntensity={0.5}>
        <group position={[0, 12 + localProgress * 5, 0]}>
          <mesh>
            <boxGeometry args={[0.4, 0.1, 0.4]} />
            <meshStandardMaterial color="#1a2332" emissive="#00d4ff" emissiveIntensity={0.5} />
          </mesh>
          {/* Drone rotors */}
          {[[-0.3, 0, -0.3], [0.3, 0, -0.3], [-0.3, 0, 0.3], [0.3, 0, 0.3]].map(([x, , z], i) => (
            <mesh key={i} position={[x, 0.05, z]}>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          ))}
          <pointLight intensity={2} color="#ffffff" distance={20} />
        </group>
      </Float>

      <Particles count={200} spread={40} color="#00d4ff" size={0.015} opacity={0.3} />

      {/* Scene lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#ffffff" castShadow />
      <pointLight position={[0, 10, 0]} intensity={2} color="#00d4ff" distance={30} />
      <hemisphereLight args={["#0066ff", "#030712", 0.3]} />
    </group>
  );
}
