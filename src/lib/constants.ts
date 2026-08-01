import { SectionConfig } from "@/types";

export const SECTIONS: SectionConfig[] = [
  { id: "hero", start: 0, end: 0.08 },
  { id: "about", start: 0.08, end: 0.18 },
  { id: "skills", start: 0.18, end: 0.32 },
  { id: "projects", start: 0.32, end: 0.88 },
  { id: "contact", start: 0.88, end: 1 },
];

export const PROJECT_SECTION_SIZE = (0.88 - 0.32) / 6;

export const COLORS = {
  bg: "#030712",
  bgSecondary: "#0a0f1a",
  accent: "#00d4ff",
  accentSecondary: "#0066ff",
  accentWarm: "#ff6b35",
  text: "#f0f4ff",
  textMuted: "#8892b0",
  glass: "rgba(10, 15, 26, 0.6)",
  glassBorder: "rgba(0, 212, 255, 0.15)",
  glow: "#00d4ff",
};

export const CAMERA_POSITIONS = {
  hero: { position: [0, 2, 12] as [number, number, number], lookAt: [0, 1, 0] as [number, number, number] },
  about: { position: [0, 1.5, 8] as [number, number, number], lookAt: [0, 0.5, 0] as [number, number, number] },
  skills: { position: [0, 3, 14] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] },
  contact: { position: [0, 2, 10] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] },
};
