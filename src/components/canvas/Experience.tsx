"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { PostProcessingEffects } from "./PostProcessing";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { smoothstep, getProjectLocalProgress } from "@/lib/utils";
import { getAdaptiveQuality } from "@/lib/performance";
import { useEffect, useState } from "react";

const LandingScene = dynamic(() => import("@/components/scenes/LandingScene").then((m) => m.LandingScene), {
  ssr: false,
});
const AboutScene = dynamic(() => import("@/components/scenes/AboutScene").then((m) => m.AboutScene), {
  ssr: false,
});
const SkillsScene = dynamic(() => import("@/components/scenes/SkillsScene").then((m) => m.SkillsScene), {
  ssr: false,
});
const ContactScene = dynamic(() => import("@/components/scenes/ContactScene").then((m) => m.ContactScene), {
  ssr: false,
});
const GliderScene = dynamic(() => import("@/components/scenes/projects/GliderScene").then((m) => m.GliderScene), {
  ssr: false,
});
const ShoghlanyScene = dynamic(() => import("@/components/scenes/projects/ShoghlanyScene").then((m) => m.ShoghlanyScene), {
  ssr: false,
});
const ROVScene = dynamic(() => import("@/components/scenes/projects/ROVScene").then((m) => m.ROVScene), {
  ssr: false,
});
const SmartParkingScene = dynamic(() => import("@/components/scenes/projects/SmartParkingScene").then((m) => m.SmartParkingScene), {
  ssr: false,
});
const WeatherScene = dynamic(() => import("@/components/scenes/projects/WeatherScene").then((m) => m.WeatherScene), {
  ssr: false,
});

function PerformanceProfiler() {
  const [stats, setStats] = useState({ fps: 0, drawCalls: 0, triangles: 0 });

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    let frames = 0;
    let lastTime = performance.now();

    const interval = window.setInterval(() => {
      const fps = Math.round((frames * 1000) / (performance.now() - lastTime));
      frames = 0;
      lastTime = performance.now();
      setStats((prev) => ({ ...prev, fps }));
    }, 1000);

    const handleFrame = () => {
      frames += 1;
      window.requestAnimationFrame(handleFrame);
    };
    const raf = window.requestAnimationFrame(handleFrame);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(interval);
    };
  }, []);

  return process.env.NODE_ENV === "development" ? (
    <div
      style={{
        position: "absolute",
        left: 16,
        top: 16,
        zIndex: 20,
        padding: "8px 10px",
        borderRadius: 8,
        background: "rgba(3, 7, 18, 0.75)",
        color: "#e2e8f0",
        fontSize: 12,
        pointerEvents: "none",
        fontFamily: "monospace",
      }}
    >
      <div>FPS: {stats.fps}</div>
      <div>Draw calls: {stats.drawCalls}</div>
      <div>Triangles: {stats.triangles}</div>
    </div>
  ) : null;
}

function SceneContent() {
  const { scrollProgress, selectedSkill } = usePortfolio();
  const quality = useMemo(() => getAdaptiveQuality(), []);

  const heroVis = 1 - smoothstep(0.05, 0.12, scrollProgress);
  const aboutVis = smoothstep(0.06, 0.1, scrollProgress) * (1 - smoothstep(0.16, 0.22, scrollProgress));
  const skillsVis = smoothstep(0.14, 0.2, scrollProgress) * (1 - smoothstep(0.28, 0.36, scrollProgress));
  const contactVis = smoothstep(0.84, 0.92, scrollProgress);

  const projectVisibilities = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const start = 0.32 + i * ((0.88 - 0.32) / 5);
      const end = start + (0.88 - 0.32) / 5;
      const fadeIn = smoothstep(start - 0.02, start + 0.04, scrollProgress);
      const fadeOut = 1 - smoothstep(end - 0.04, end + 0.02, scrollProgress);
      return fadeIn * fadeOut;
    });
  }, [scrollProgress]);

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={0.1} />
      <Environment preset="night" />

      <LandingScene visible={heroVis} />
      <AboutScene visible={aboutVis} />
      <SkillsScene visible={skillsVis} />

      <GliderScene
        visible={projectVisibilities[0] * (selectedSkill && selectedSkill !== "glider" ? 0.35 : 1)}
        localProgress={getProjectLocalProgress(scrollProgress, 0)}
      />
      <ShoghlanyScene
        visible={projectVisibilities[1] * (selectedSkill && selectedSkill !== "shoghlany" ? 0.35 : 1)}
        localProgress={getProjectLocalProgress(scrollProgress, 1)}
      />
      <ROVScene
        visible={projectVisibilities[2] * (selectedSkill && selectedSkill !== "rov" ? 0.35 : 1)}
        localProgress={getProjectLocalProgress(scrollProgress, 2)}
      />
      <SmartParkingScene
        visible={projectVisibilities[3] * (selectedSkill && selectedSkill !== "smart-parking" ? 0.35 : 1)}
        localProgress={getProjectLocalProgress(scrollProgress, 3)}
      />
      <WeatherScene
        visible={projectVisibilities[4] * (selectedSkill && selectedSkill !== "weather-app" ? 0.35 : 1)}
        localProgress={getProjectLocalProgress(scrollProgress, 4)}
      />

      <ContactScene visible={contactVis} />

      <CameraRig />
      <PostProcessingEffects />
      {quality.label === "low" ? null : <PerformanceProfiler />}
    </>
  );
}

export function Experience() {
  const quality = useMemo(() => getAdaptiveQuality(), []);

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 4, 20], fov: 50, near: 0.1, far: 100 }}
        dpr={quality.dpr}
        gl={{
          antialias: quality.antialias,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        shadows={quality.shadows}
      >
        <Suspense fallback={null}>
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
