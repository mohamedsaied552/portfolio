"use client";

import { motion } from "framer-motion";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { SECTIONS } from "@/lib/constants";

export function ScrollIndicator() {
  const { scrollProgress, isLoaded, activeSection } = usePortfolio();

  if (!isLoaded) return null;

  return (
    <div className="scroll-indicator">
      <div className="scroll-progress-track">
        <motion.div
          className="scroll-progress-fill"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      <div className="section-dots">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`section-dot ${activeSection === section.id ? "active" : ""}`}
            onClick={() => {
              const lenis = (window as Window & { __lenis?: { scrollTo: (t: string | HTMLElement, o?: object) => void } }).__lenis;
              const el = document.getElementById(section.id);
              if (lenis && el) {
                lenis.scrollTo(el, { offset: 0 });
              } else {
                el?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-label={`Go to ${section.id}`}
          >
            <span className="dot-inner" />
            <span className="dot-label">{section.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
