"use client";

import { memo, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

interface SkillOrbProps {
  skill: (typeof skills)[0];
  visible: number;
  onSelect: (id: string) => void;
  isSelected: boolean;
  isDimmed: boolean;
}

const SkillOrb = memo(function SkillOrb({ skill, visible, onSelect, isSelected, isDimmed }: SkillOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(skill.orbitAngle);

  useFrame((state, delta) => {
    angleRef.current += delta * skill.orbitSpeed * 0.3;
    if (groupRef.current) {
      const r = skill.orbitRadius;
      groupRef.current.position.x = Math.cos(angleRef.current) * r;
      groupRef.current.position.z = Math.sin(angleRef.current) * r;
      groupRef.current.position.y = Math.sin(angleRef.current * 2) * 0.5;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      const targetScale = hovered || isSelected ? 1.8 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      glowRef.current.scale.setScalar((hovered || isSelected ? 3 : 2) * pulse);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = ((hovered || isSelected ? 0.3 : 0.1) * visible) * (isDimmed ? 0.3 : 1);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(skill.id)}
        onPointerDown={() => setHovered(true)}
      >
        <icosahedronGeometry args={[0.25, 1]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={hovered || isSelected ? 2 : 0.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={visible * (isDimmed ? 0.35 : 1)}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshBasicMaterial color={skill.color} transparent opacity={0.1} />
      </mesh>
      {(hovered || isSelected || !isDimmed) && (
        <Text
          position={[0, 0.55, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={visible}
        >
          {skill.name}
        </Text>
      )}
    </group>
  );
});

interface SkillsSceneProps {
  visible: number;
}

export function SkillsScene({ visible }: SkillsSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const { selectedSkill, setSelectedSkill } = usePortfolio();

  const activeSkill = useMemo(() => skills.find((skill) => skill.id === selectedSkill) ?? null, [selectedSkill]);
  const relatedProjects = useMemo(() => {
    if (!activeSkill) return [];
    return projects.filter((project) => activeSkill.projectIds.includes(project.id));
  }, [activeSkill]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.visible = visible > 0.01;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  if (visible <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1.5}
          wireframe
          transparent
          opacity={0.5 * visible}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#0066ff"
          emissive="#0066ff"
          emissiveIntensity={2}
          transparent
          opacity={0.3 * visible}
        />
      </mesh>

      {[1.5, 2.5, 3.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, 0, i * 0.5]}>
          <torusGeometry args={[radius, 0.005, 8, 64]} />
          <meshBasicMaterial
            color={i === 0 ? "#00d4ff" : i === 1 ? "#0066ff" : "#ffffff"}
            transparent
            opacity={0.15 * visible}
          />
        </mesh>
      ))}

      {skills.map((skill) => (
        <SkillOrb
          key={skill.id}
          skill={skill}
          visible={visible}
          onSelect={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
          isSelected={selectedSkill === skill.id}
          isDimmed={Boolean(selectedSkill && selectedSkill !== skill.id)}
        />
      ))}

      {activeSkill && relatedProjects.length > 0 && (
        <group>
          {relatedProjects.map((project, index) => {
            const angle = (index / Math.max(1, relatedProjects.length)) * Math.PI * 2;
            const radius = 2.4;
            const markerPosition: [number, number, number] = [Math.cos(angle) * radius, 0.8, Math.sin(angle) * radius];
            return (
              <group key={project.id}>
                <Line
                  points={[
                    new THREE.Vector3(0, 0.2, 0),
                    new THREE.Vector3(markerPosition[0], markerPosition[1], markerPosition[2]),
                  ]}
                  color={project.color}
                  lineWidth={2}
                  transparent
                  opacity={0.6}
                />
                <mesh position={markerPosition}>
                  <sphereGeometry args={[0.08, 12, 12]} />
                  <meshBasicMaterial color={project.color} transparent opacity={0.8} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={4} color="#00d4ff" distance={20} />
      <pointLight position={[5, 0, 5]} intensity={2} color="#0066ff" distance={15} />
    </group>
  );
}
