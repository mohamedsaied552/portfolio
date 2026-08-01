"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import { usePortfolio } from "./PortfolioProvider";
import { getActiveProjectIndex } from "@/lib/utils";
import { SECTIONS } from "@/lib/constants";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const { setScrollProgress, setActiveSection, setActiveProjectIndex } = usePortfolio();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      const progress = limit > 0 ? scroll / limit : 0;
      setScrollProgress(progress);

      const section = SECTIONS.find((s) => progress >= s.start && progress < s.end);
      if (section) {
        setActiveSection(section.id);
      }

      setActiveProjectIndex(getActiveProjectIndex(progress));
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, [setScrollProgress, setActiveSection, setActiveProjectIndex]);

  return <>{children}</>;
}
