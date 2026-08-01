"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { siteInfo } from "@/data/contact";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

export function HeroOverlay() {
  const { isLoaded, scrollProgress } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-name", {
        y: 80,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
        delay: 0.5,
      });
      gsap.from(".hero-role", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.8,
        stagger: 0.15,
      });
      gsap.from(".hero-tagline", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.2,
      });
      gsap.from(".hero-cta", {
        y: 20,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 1.6,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  const opacity = Math.max(0, 1 - scrollProgress * 8);

  return (
    <div ref={containerRef} className="overlay hero-overlay" style={{ opacity }}>
      <div className="hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, x: -20 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="badge-dot" />
          SYSTEM ONLINE — {siteInfo.country.toUpperCase()}
        </motion.div>

        <h1 className="hero-name">
          <span className="name-first">Mohamed</span>
          <span className="name-last">Saied</span>
        </h1>

        <div className="hero-roles">
          {siteInfo.roles.map((role) => (
            <span key={role} className="hero-role">
              {role}
            </span>
          ))}
        </div>

        <p className="hero-tagline">{siteInfo.tagline}</p>

        <motion.button
          className="hero-cta"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const lenis = (window as Window & { __lenis?: { scrollTo: (t: string | number | HTMLElement, o?: object) => void } }).__lenis;
            const about = document.getElementById("about");
            if (lenis && about) {
              lenis.scrollTo(about, { offset: 0 });
            } else {
              about?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <span className="cta-glow" />
          <span className="cta-text">Explore My World</span>
          <span className="cta-arrow">→</span>
        </motion.button>
      </div>

      <div className="hero-coords">
        <span>30.0444° N</span>
        <span>31.2357° E</span>
      </div>
    </div>
  );
}
