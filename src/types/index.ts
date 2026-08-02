export interface Skill {
  id: string;
  name: string;
  category: "mobile" | "backend" | "frontend" | "database" | "devops" | "embedded" | "architecture";
  color: string;
  projectIds: string[];
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  description: string;
  yearsOfExperience: number;
  mainSkills: string[];
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  technologies: string[];
  highlights: string[];
  color: string;
  accentColor: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface ContactLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export type SectionId = "hero" | "about" | "skills" | "projects" | "contact";

export interface SectionConfig {
  id: SectionId;
  start: number;
  end: number;
}
