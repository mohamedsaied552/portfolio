"use client";

import dynamic from "next/dynamic";
import { PortfolioProvider } from "@/components/providers/PortfolioProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { AudioControl } from "@/components/ui/AudioControl";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { AboutOverlay } from "@/components/ui/AboutOverlay";
import { SkillsOverlay } from "@/components/ui/SkillsOverlay";
import { ProjectsOverlay } from "@/components/ui/ProjectsOverlay";
import { ContactOverlay } from "@/components/ui/ContactOverlay";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { AmbientAudio } from "@/components/ui/AmbientAudio";

const Experience = dynamic(
  () => import("@/components/canvas/Experience").then((m) => m.Experience),
  { ssr: false }
);

export function PortfolioExperience() {
  return (
    <PortfolioProvider>
      <SmoothScrollProvider>
        <LoadingScreen />
        <AudioControl />
        <AmbientAudio />
        <Experience />
        <ScrollIndicator />

        <main className="scroll-content">
          <section id="hero" className="section section-hero" data-section="hero">
            <HeroOverlay />
          </section>

          <section id="about" className="section section-about" data-section="about">
            <AboutOverlay />
          </section>

          <section id="skills" className="section section-skills" data-section="skills">
            <SkillsOverlay />
          </section>

          <section id="projects" className="section section-projects" data-section="projects">
            <ProjectsOverlay />
          </section>

          <section id="contact" className="section section-contact" data-section="contact">
            <ContactOverlay />
          </section>
        </main>
      </SmoothScrollProvider>
    </PortfolioProvider>
  );
}
