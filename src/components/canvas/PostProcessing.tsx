"use client";

import { EffectComposer, Bloom, Vignette, ChromaticAberration, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { getAdaptiveQuality } from "@/lib/performance";

export function PostProcessingEffects() {
  const { scrollProgress } = usePortfolio();
  const isProjects = scrollProgress >= 0.32 && scrollProgress < 0.88;
  const quality = useMemo(() => getAdaptiveQuality(), []);

  return (
    <EffectComposer multisampling={quality.label === "low" ? 0 : 2}>
      <Bloom
        intensity={isProjects ? quality.bloomIntensity : quality.bloomIntensity * 0.75}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur={quality.label !== "low"}
      />
      {quality.depthOfField ? (
        <DepthOfField
          focusDistance={0.01}
          focalLength={0.02}
          bokehScale={isProjects ? 3 : 2}
        />
      ) : (
        <></>
      )}
      <Vignette offset={0.3} darkness={0.6} blendFunction={BlendFunction.NORMAL} />
      {quality.chromaticAberration ? (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0005] as unknown as [number, number]}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
