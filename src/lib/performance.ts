export interface QualitySettings {
  label: "ultra" | "high" | "medium" | "low";
  dpr: [number, number];
  antialias: boolean;
  shadows: boolean;
  shadowMapResolution: number;
  bloomIntensity: number;
  depthOfField: boolean;
  chromaticAberration: boolean;
  particleScale: number;
  particleCountFactor: number;
  postprocessing: boolean;
}

export function getAdaptiveQuality(): QualitySettings {
  if (typeof window === "undefined") {
    return {
      label: "high",
      dpr: [1, 2],
      antialias: true,
      shadows: true,
      shadowMapResolution: 2048,
      bloomIntensity: 1.2,
      depthOfField: true,
      chromaticAberration: true,
      particleScale: 1,
      particleCountFactor: 1,
      postprocessing: true,
    };
  }

  const width = window.innerWidth;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
  const memory = Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4);
  const cores = navigator.hardwareConcurrency || 4;

  if (!isMobile) {
    return {
      label: cores >= 8 ? "ultra" : "high",
      dpr: [1, width > 1600 ? 2 : 1.75],
      antialias: true,
      shadows: true,
      shadowMapResolution: width > 1400 ? 2048 : 1536,
      bloomIntensity: 1.2,
      depthOfField: true,
      chromaticAberration: true,
      particleScale: 1,
      particleCountFactor: 1,
      postprocessing: true,
    };
  }

  if (memory >= 8 && cores >= 8 && width >= 900) {
    return {
      label: "high",
      dpr: [1, 1.5],
      antialias: true,
      shadows: true,
      shadowMapResolution: 1024,
      bloomIntensity: 0.9,
      depthOfField: true,
      chromaticAberration: true,
      particleScale: 0.85,
      particleCountFactor: 0.85,
      postprocessing: true,
    };
  }

  if (memory >= 6 && width >= 700) {
    return {
      label: "medium",
      dpr: [1, 1.25],
      antialias: true,
      shadows: true,
      shadowMapResolution: 768,
      bloomIntensity: 0.7,
      depthOfField: false,
      chromaticAberration: false,
      particleScale: 0.75,
      particleCountFactor: 0.75,
      postprocessing: true,
    };
  }

  return {
    label: "low",
    dpr: [1, 1],
    antialias: false,
    shadows: false,
    shadowMapResolution: 512,
    bloomIntensity: 0.45,
    depthOfField: false,
    chromaticAberration: false,
    particleScale: 0.5,
    particleCountFactor: 0.5,
    postprocessing: false,
  };
}
