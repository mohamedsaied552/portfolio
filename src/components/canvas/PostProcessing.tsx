"use client";

import { EffectComposer, Bloom, Vignette, ChromaticAberration, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

export function PostProcessingEffects() {
  const { scrollProgress } = usePortfolio();
  const isProjects = scrollProgress >= 0.32 && scrollProgress < 0.88;

  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={isProjects ? 1.2 : 0.8}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <DepthOfField
        focusDistance={0.01}
        focalLength={0.02}
        bokehScale={isProjects ? 3 : 2}
      />
      <Vignette offset={0.3} darkness={0.6} blendFunction={BlendFunction.NORMAL} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0005, 0.0005] as unknown as [number, number]}
      />
    </EffectComposer>
  );
}
