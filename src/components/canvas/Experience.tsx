"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { PostProcessingEffects } from "./PostProcessing";
import { LandingScene } from "@/components/scenes/LandingScene";
import { AboutScene } from "@/components/scenes/AboutScene";
import { SkillsScene } from "@/components/scenes/SkillsScene";
import { ContactScene } from "@/components/scenes/ContactScene";
import { GliderScene } from "@/components/scenes/projects/GliderScene";
import { ShoghlanyScene } from "@/components/scenes/projects/ShoghlanyScene";
import { ROVScene } from "@/components/scenes/projects/ROVScene";
import { RoboticArmScene } from "@/components/scenes/projects/RoboticArmScene";
import { SmartParkingScene } from "@/components/scenes/projects/SmartParkingScene";
import { WeatherScene } from "@/components/scenes/projects/WeatherScene";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { smoothstep, getProjectLocalProgress } from "@/lib/utils";

function SceneContent() {
  const { scrollProgress } = usePortfolio();

  const heroVis = 1 - smoothstep(0.05, 0.12, scrollProgress);
  const aboutVis = smoothstep(0.06, 0.1, scrollProgress) * (1 - smoothstep(0.16, 0.22, scrollProgress));
  const skillsVis = smoothstep(0.14, 0.2, scrollProgress) * (1 - smoothstep(0.28, 0.36, scrollProgress));
  const contactVis = smoothstep(0.84, 0.92, scrollProgress);

  const projectVisibilities = Array.from({ length: 6 }).map((_, i) => {
    const start = 0.32 + i * ((0.88 - 0.32) / 6);
    const end = start + (0.88 - 0.32) / 6;
    const fadeIn = smoothstep(start - 0.02, start + 0.04, scrollProgress);
    const fadeOut = 1 - smoothstep(end - 0.04, end + 0.02, scrollProgress);
    return fadeIn * fadeOut;
  });

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={0.1} />
      <Environment preset="night" />

      <LandingScene visible={heroVis} />
      <AboutScene visible={aboutVis} />
      <SkillsScene visible={skillsVis} />

      <GliderScene
        visible={projectVisibilities[0]}
        localProgress={getProjectLocalProgress(scrollProgress, 0)}
      />
      <ShoghlanyScene
        visible={projectVisibilities[1]}
        localProgress={getProjectLocalProgress(scrollProgress, 1)}
      />
      <ROVScene
        visible={projectVisibilities[2]}
        localProgress={getProjectLocalProgress(scrollProgress, 2)}
      />
      <RoboticArmScene
        visible={projectVisibilities[3]}
        localProgress={getProjectLocalProgress(scrollProgress, 3)}
      />
      <SmartParkingScene
        visible={projectVisibilities[4]}
        localProgress={getProjectLocalProgress(scrollProgress, 4)}
      />
      <WeatherScene
        visible={projectVisibilities[5]}
        localProgress={getProjectLocalProgress(scrollProgress, 5)}
      />

      <ContactScene visible={contactVis} />

      <CameraRig />
      <PostProcessingEffects />
    </>
  );
}

export function Experience() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 4, 20], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
