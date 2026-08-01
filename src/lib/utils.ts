export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function getProjectScrollProgress(globalProgress: number, index: number): number {
  const projectStart = 0.32 + index * ((0.88 - 0.32) / 6);
  const projectEnd = projectStart + (0.88 - 0.32) / 6;
  return smoothstep(projectStart, projectEnd, globalProgress);
}

export function getProjectLocalProgress(globalProgress: number, index: number): number {
  const projectStart = 0.32 + index * ((0.88 - 0.32) / 6);
  const projectEnd = projectStart + (0.88 - 0.32) / 6;
  return clamp((globalProgress - projectStart) / (projectEnd - projectStart), 0, 1);
}

export function getActiveProjectIndex(globalProgress: number): number {
  if (globalProgress < 0.32) return -1;
  if (globalProgress >= 0.88) return -1;
  return Math.min(Math.floor((globalProgress - 0.32) / ((0.88 - 0.32) / 6)), 5);
}
