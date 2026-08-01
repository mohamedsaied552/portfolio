"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Particles } from "@/components/three/Particles";

interface RoboticArmSceneProps {
  visible: number;
  localProgress: number;
}

function RoboticArm() {
  const baseRef = useRef<THREE.Group>(null);
  const segment1Ref = useRef<THREE.Group>(null);
  const segment2Ref = useRef<THREE.Group>(null);
  const gripperRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (segment1Ref.current) {
      segment1Ref.current.rotation.z = Math.sin(t * 0.4) * 0.5;
    }
    if (segment2Ref.current) {
      segment2Ref.current.rotation.z = Math.sin(t * 0.6 + 1) * 0.8;
    }
    if (gripperRef.current) {
      gripperRef.current.rotation.z = Math.sin(t * 0.8) * 0.3;
    }
  });

  return (
    <group ref={baseRef} position={[0, 0, 0]}>
      {/* Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 1, 0.4, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Segment 1 */}
      <group ref={segment1Ref} position={[0, 0.2, 0]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.2} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Segment 2 */}
        <group ref={segment2Ref} position={[0, 1.5, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.25, 1.2, 0.25]} />
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.2} metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Segment 3 / Gripper */}
          <group ref={gripperRef} position={[0, 1.2, 0]}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.15, 0.6, 0.15]} />
              <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Gripper fingers */}
            <mesh position={[-0.1, 0.55, 0]}>
              <boxGeometry args={[0.04, 0.2, 0.08]} />
              <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0.1, 0.55, 0]}>
              <boxGeometry args={[0.04, 0.2, 0.08]} />
              <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function Conveyor({ position, length }: { position: [number, number, number]; length: number }) {
  const beltRef = useRef<THREE.Mesh>(null);
  const itemsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (itemsRef.current) {
      itemsRef.current.position.x = ((state.clock.elapsedTime * 0.5) % length) - length / 2;
    }
  });

  return (
    <group position={position}>
      {/* Belt frame */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[length, 0.05, 0.8]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh ref={beltRef} position={[0, 0.35, 0]}>
        <boxGeometry args={[length, 0.02, 0.7]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Moving items */}
      <group ref={itemsRef}>
        {[0, 3, 6].map((offset) => (
          <mesh key={offset} position={[offset - length / 2, 0.45, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.5]} />
            <meshStandardMaterial color="#d97706" emissive="#f59e0b" emissiveIntensity={0.3} metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
      {/* Support legs */}
      {[-length / 2 + 0.5, length / 2 - 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.6]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function RoboticArmScene({ visible }: RoboticArmSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) groupRef.current.visible = visible > 0.01;
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#1a1000", 15, 40]} />

      {/* Factory floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1510" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Floor grid lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={i}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, i - 7]}>
            <planeGeometry args={[30, 0.02]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.05} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[i - 7, 0.01, 0]}>
            <planeGeometry args={[0.02, 30]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.05} />
          </mesh>
        </group>
      ))}

      <RoboticArm />
      <Conveyor position={[0, 0, 3]} length={8} />
      <Conveyor position={[5, 0, -2]} length={6} />

      {/* Factory ceiling lights */}
      {[[-3, 5, 0], [3, 5, 0], [0, 5, 3]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[2, 0.1, 0.3]} />
            <meshStandardMaterial color="#333" emissive="#f59e0b" emissiveIntensity={0.5} />
          </mesh>
          <spotLight
            position={[0, -0.5, 0]}
            angle={0.6}
            penumbra={0.5}
            intensity={3}
            color="#fff5e0"
            distance={12}
            castShadow
          />
        </group>
      ))}

      <Particles count={80} spread={15} color="#f59e0b" size={0.01} opacity={0.2} speed={0.05} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} castShadow />
    </group>
  );
}
