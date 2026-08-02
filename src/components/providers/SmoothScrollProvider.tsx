"use client";

import { useEffect, ReactNode } from "react";
import { usePortfolio } from "./PortfolioProvider";
import { getActiveProjectIndex } from "@/lib/utils";
import { SECTIONS } from "@/lib/constants";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const { setScrollProgress, setActiveSection, setActiveProjectIndex } = usePortfolio();

  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = clamp(scrollTop / maxScroll, 0, 1);

      setScrollProgress(progress);

      const section = SECTIONS.find((s) => progress >= s.start && progress < s.end);
      if (section) {
        setActiveSection(section.id);
      }

      setActiveProjectIndex(getActiveProjectIndex(progress));
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
    };
  }, [setScrollProgress, setActiveSection, setActiveProjectIndex]);

  return <>{children}</>;
}
