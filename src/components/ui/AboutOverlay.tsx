"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { stats, timeline } from "@/data/stats";
import { siteInfo } from "@/data/contact";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix;
      },
    });
  }, [value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function AboutOverlay() {
  const { activeSection } = usePortfolio();
  const isVisible = activeSection === "about";
  const opacity = isVisible ? 1 : 0;

  return (
    <div className="overlay about-overlay" style={{ opacity, pointerEvents: isVisible ? "auto" : "none" }}>
      <motion.div
        className="about-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <span className="section-label">01 — PROFILE</span>
        <h2 className="section-title">Holographic Identity</h2>
      </motion.div>

      <div className="about-grid">
        <motion.div
          className="about-stats"
          initial={{ opacity: 0, x: -30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-card glass-panel" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="stat-value">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="about-info glass-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="about-text">{siteInfo.about}</p>
          <p className="about-text-muted">{siteInfo.aboutExtended}</p>
          <div className="about-education">
            <span className="edu-icon">◈</span>
            <span>{siteInfo.education}</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="timeline-container"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <span className="section-label">TIMELINE</span>
        <div className="timeline-track">
          {timeline.map((item) => (
            <div key={item.year} className={`timeline-item ${item.type}`}>
              <span className="timeline-year">{item.year}</span>
              <span className="timeline-dot" />
              <span className="timeline-event">{item.event}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
