"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { CAMERA_POSITIONS } from "@/lib/constants";
import { lerp, smoothstep, getProjectLocalProgress } from "@/lib/utils";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

const PROJECT_CAMERAS: Array<{ position: [number, number, number]; lookAt: [number, number, number] }> = [
  { position: [0, 8, 18], lookAt: [0, 0, 0] },
  { position: [5, 4, 12], lookAt: [0, 1, 0] },
  { position: [0, 3, 10], lookAt: [0, -2, 0] },
  { position: [0, 12, 20], lookAt: [0, 0, 0] },
  { position: [0, 5, 12], lookAt: [0, 2, 0] },
];

const PROJECT_POSITIONS: Record<string, [number, number, number]> = {
  glider: [0, 0, 0],
  shoghlany: [6, 0, -4],
  rov: [-6, 0, 4],
  "smart-parking": [-3, 0, -6],
  "weather-app": [0, 0, 8],
};

export function CameraRig() {
  const { camera } = useThree();
  const { scrollProgress, selectedSkill } = usePortfolio();
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const breathOffset = useRef(0);

  useFrame((_, delta) => {
    breathOffset.current += delta * 0.3;
    const breath = Math.sin(breathOffset.current) * 0.08;

    let targetPos: [number, number, number];
    let targetLook: [number, number, number];

    const p = scrollProgress;
    const activeSkill = skills.find((skill) => skill.id === selectedSkill);

    if (activeSkill && activeSkill.projectIds.length > 0) {
      const relatedProjects = projects.filter((project) => activeSkill.projectIds.includes(project.id));
      const focusPoint = relatedProjects.reduce(
        (sum, project) => {
          const position = PROJECT_POSITIONS[project.id] ?? [0, 0, 0];
          return [sum[0] + position[0], sum[1] + position[1], sum[2] + position[2]] as [number, number, number];
        },
        [0, 0, 0] as [number, number, number]
      );
      const count = relatedProjects.length || 1;
      const focus = [focusPoint[0] / count, 0.8, focusPoint[2] / count] as [number, number, number];
      targetPos = [focus[0] + 3, focus[1] + 8 + breath, focus[2] + 12];
      targetLook = [focus[0], focus[1], focus[2]];
    } else if (p < 0.08) {
      const t = smoothstep(0, 0.08, p);
      targetPos = [
        lerp(0, CAMERA_POSITIONS.hero.position[0], t),
        lerp(4, CAMERA_POSITIONS.hero.position[1], t) + breath,
        lerp(20, CAMERA_POSITIONS.hero.position[2], t),
      ];
      targetLook = CAMERA_POSITIONS.hero.lookAt;
    } else if (p < 0.18) {
      const t = smoothstep(0.08, 0.18, p);
      targetPos = [
        lerp(CAMERA_POSITIONS.hero.position[0], CAMERA_POSITIONS.about.position[0], t),
        lerp(CAMERA_POSITIONS.hero.position[1], CAMERA_POSITIONS.about.position[1], t) + breath,
        lerp(CAMERA_POSITIONS.hero.position[2], CAMERA_POSITIONS.about.position[2], t),
      ];
      targetLook = [
        lerp(CAMERA_POSITIONS.hero.lookAt[0], CAMERA_POSITIONS.about.lookAt[0], t),
        lerp(CAMERA_POSITIONS.hero.lookAt[1], CAMERA_POSITIONS.about.lookAt[1], t),
        lerp(CAMERA_POSITIONS.hero.lookAt[2], CAMERA_POSITIONS.about.lookAt[2], t),
      ];
    } else if (p < 0.32) {
      const t = smoothstep(0.18, 0.32, p);
      targetPos = [
        lerp(CAMERA_POSITIONS.about.position[0], CAMERA_POSITIONS.skills.position[0], t),
        lerp(CAMERA_POSITIONS.about.position[1], CAMERA_POSITIONS.skills.position[1], t) + breath,
        lerp(CAMERA_POSITIONS.about.position[2], CAMERA_POSITIONS.skills.position[2], t),
      ];
      targetLook = CAMERA_POSITIONS.skills.lookAt;
    } else if (p < 0.88) {
      const projectIndex = Math.min(Math.floor((p - 0.32) / ((0.88 - 0.32) / 5)), 4);
      const localP = getProjectLocalProgress(p, projectIndex);
      const cam = PROJECT_CAMERAS[projectIndex];
      const orbitAngle = localP * Math.PI * 0.3;
      targetPos = [
        cam.position[0] + Math.sin(orbitAngle) * 3,
        cam.position[1] + breath + localP * 2,
        cam.position[2] + Math.cos(orbitAngle) * 2,
      ];
      targetLook = cam.lookAt;
    } else {
      const t = smoothstep(0.88, 1, p);
      const lastCam = PROJECT_CAMERAS[4];
      targetPos = [
        lerp(lastCam.position[0], CAMERA_POSITIONS.contact.position[0], t),
        lerp(lastCam.position[1], CAMERA_POSITIONS.contact.position[1], t) + breath,
        lerp(lastCam.position[2], CAMERA_POSITIONS.contact.position[2], t),
      ];
      targetLook = CAMERA_POSITIONS.contact.lookAt;
    }

    camera.position.x = lerp(camera.position.x, targetPos[0], 0.04);
    camera.position.y = lerp(camera.position.y, targetPos[1], 0.04);
    camera.position.z = lerp(camera.position.z, targetPos[2], 0.04);

    targetLookAt.current.set(targetLook[0], targetLook[1], targetLook[2]);
    currentLookAt.current.lerp(targetLookAt.current, 0.04);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
