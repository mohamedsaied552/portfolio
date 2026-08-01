"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { CityGrid } from "@/components/three/CityBlock";
import { GlowingOrb } from "@/components/three/GlowingOrb";

interface SmartParkingSceneProps {
  visible: number;
  localProgress: number;
}

function ParkingSensor({ position, occupied }: { position: [number, number, number]; occupied: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = occupied
        ? 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5
        : 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
      <meshStandardMaterial
        color={occupied ? "#ef4444" : "#10b981"}
        emissive={occupied ? "#ef4444" : "#10b981"}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function ParkingSpot({ position, occupied }: { position: [number, number, number]; occupied: boolean }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[2, 3.5]} />
        <meshStandardMaterial
          color={occupied ? "#1a2030" : "#0a2818"}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Parking lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.95, 0.02, 0]}>
        <planeGeometry args={[0.05, 3.5]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.95, 0.02, 0]}>
        <planeGeometry args={[0.05, 3.5]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
      </mesh>
      {occupied && (
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.6, 0.8, 3]} />
          <meshStandardMaterial color="#2a3544" metalness={0.7} roughness={0.3} />
        </mesh>
      )}
      <ParkingSensor position={[0, 0.05, 1.5]} occupied={occupied} />
    </group>
  );
}

function TrafficLightMini({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const phase = Math.floor(state.clock.elapsedTime % 8 / 2);
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && i > 0) {
          (child.material as THREE.MeshStandardMaterial).emissiveIntensity = i - 1 === phase % 3 ? 2 : 0.1;
        }
      });
    }
  });

  const colors = ["#ef4444", "#eab308", "#10b981"];

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </mesh>
      {colors.map((color, i) => (
        <mesh key={i} position={[0, 0.12 - i * 0.12, 0.06]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export function SmartParkingScene({ visible }: SmartParkingSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const spots: Array<{ pos: [number, number, number]; occupied: boolean }> = [
    { pos: [-3, 0, -2], occupied: true },
    { pos: [0, 0, -2], occupied: false },
    { pos: [3, 0, -2], occupied: true },
    { pos: [-3, 0, 2], occupied: false },
    { pos: [0, 0, 2], occupied: true },
    { pos: [3, 0, 2], occupied: false },
  ];

  useFrame(() => {
    if (groupRef.current) groupRef.current.visible = visible > 0.01;
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#030f08", 15, 45]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0a150a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Mini city around parking */}
      <CityGrid size={4} blockSize={3} maxHeight={6} color="#10b981" />

      {/* Parking lot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#151f15" metalness={0.2} roughness={0.8} />
      </mesh>

      {spots.map((spot, i) => (
        <ParkingSpot key={i} position={spot.pos} occupied={spot.occupied} />
      ))}

      <TrafficLightMini position={[5, 0.5, 0]} />
      <TrafficLightMini position={[-5, 0.5, 0]} />

      {/* IoT network visualization */}
      <Float speed={1} floatIntensity={0.2}>
        {spots.map((spot, i) => (
          <GlowingOrb
            key={`iot-${i}`}
            position={[spot.pos[0], 2, spot.pos[2]]}
            color={spot.occupied ? "#ef4444" : "#10b981"}
            size={0.06}
          />
        ))}
      </Float>

      {/* IoT connection lines */}
      {spots.map((spot, i) => (
        <mesh key={`line-${i}`} position={[spot.pos[0], 1, spot.pos[2]]}>
          <cylinderGeometry args={[0.005, 0.005, 2, 4]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
        </mesh>
      ))}

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 8, 0]} intensity={2} color="#10b981" distance={25} />
      <directionalLight position={[5, 10, 5]} intensity={0.3} castShadow />
    </group>
  );
}
