"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface WeatherSceneProps {
  visible: number;
  localProgress: number;
}

function RainSystem({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] -= delta * 8;
      if (posArray[i * 3 + 1] < 0) {
        posArray[i * 3 + 1] = 15;
        posArray[i * 3] = (Math.random() - 0.5) * 20;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#6366f1" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Cloud({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.1) * 2;
    }
  });

  return (
    <group ref={ref} position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.8 - 0.8, Math.sin(i) * 0.2, 0]}>
          <sphereGeometry args={[scale * (0.8 + i * 0.2), 16, 16]} />
          <meshStandardMaterial color="#8899bb" transparent opacity={0.6} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(pulse * 3);
    }
  });

  return (
    <group position={[6, 8, -5]}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.15} />
      </mesh>
      <pointLight intensity={5} color="#fbbf24" distance={30} />
    </group>
  );
}

function SnowSystem({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] -= delta * 1;
      posArray[i * 3] += Math.sin(posArray[i * 3 + 1]) * delta * 0.5;
      if (posArray[i * 3 + 1] < 0) {
        posArray[i * 3 + 1] = 12;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Lightning() {
  const ref = useRef<THREE.PointLight>(null);
  const visible = useRef(false);
  const nextFlash = useRef(0);

  useFrame((state) => {
    if (state.clock.elapsedTime > nextFlash.current) {
      visible.current = true;
      nextFlash.current = state.clock.elapsedTime + 3 + Math.random() * 5;
      setTimeout(() => { visible.current = false; }, 100 + Math.random() * 200);
    }
    if (ref.current) {
      ref.current.intensity = visible.current ? 10 : 0;
    }
  });

  return <pointLight ref={ref} position={[0, 10, 0]} color="#ffffff" distance={30} />;
}

export function WeatherScene({ visible, localProgress }: WeatherSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) groupRef.current.visible = visible > 0.01;
  });

  if (visible <= 0.01) return null;

  const weatherPhase = localProgress;

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#0a0a20", 10, 35]} />

      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[30, 32, 32]} />
        <meshStandardMaterial
          color={weatherPhase < 0.33 ? "#1a1a3a" : weatherPhase < 0.66 ? "#2a3a5a" : "#aaaacc"}
          side={THREE.BackSide}
          transparent
          opacity={0.3}
        />
      </mesh>

      <Sun />

      <Cloud position={[-3, 6, -2]} scale={1.2} />
      <Cloud position={[2, 7, 1]} scale={0.8} />
      <Cloud position={[0, 5, 3]} scale={1.5} />

      {weatherPhase < 0.5 && <RainSystem count={400} />}
      {weatherPhase >= 0.5 && weatherPhase < 0.75 && <SnowSystem count={300} />}
      {weatherPhase < 0.4 && <Lightning />}

      {/* Floating weather cards */}
      <Float speed={1.5} floatIntensity={0.3}>
        <group position={[-4, 3, 0]}>
          <mesh>
            <boxGeometry args={[1.5, 2, 0.05]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
              metalness={0.5}
              roughness={0.1}
            />
          </mesh>
        </group>
      </Float>

      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#6366f1", "#0a0a20", 0.5]} />
    </group>
  );
}
