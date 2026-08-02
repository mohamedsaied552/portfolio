"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

export function SkillsOverlay() {
  const { activeSection, selectedSkill, setSelectedSkill } = usePortfolio();
  const isVisible = activeSection === "skills";

  const selectedSkillData = useMemo(() => skills.find((s) => s.id === selectedSkill) ?? null, [selectedSkill]);
  const relatedProjects = useMemo(() => {
    if (!selectedSkillData) return [];
    return projects.filter((p) => selectedSkillData.projectIds.includes(p.id));
  }, [selectedSkillData]);

  return (
    <div className="overlay skills-overlay" style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}>
      <motion.div
        className="skills-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="section-label">02 — TECHNOLOGIES</span>
        <h2 className="section-title">Technology Universe</h2>
        <p className="section-subtitle">Click a node to reveal its project connections</p>
      </motion.div>

      {selectedSkillData && (
        <motion.div
          className="skill-detail glass-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="skill-detail-header">
            <span className="skill-color-dot" style={{ background: selectedSkillData.color }} />
            <h3>{selectedSkillData.name}</h3>
            <button className="skill-close" onClick={() => setSelectedSkill(null)}>×</button>
          </div>
          <p className="section-subtitle" style={{ marginBottom: 12 }}>{selectedSkillData.description}</p>
          <div className="skill-metrics" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <span className="category-tag">Years: {selectedSkillData.yearsOfExperience}</span>
            <span className="category-tag">Category: {selectedSkillData.category}</span>
          </div>
          <div className="skill-projects">
            <span className="skill-projects-label">Connected Projects</span>
            {relatedProjects.length > 0 ? (
              relatedProjects.map((p) => (
                <div key={p.id} className="skill-project-item" style={{ borderColor: p.color }}>
                  <span className="project-dot" style={{ background: p.color }} />
                  {p.name}
                </div>
              ))
            ) : (
              <p className="skill-no-projects">Core technology in my toolkit</p>
            )}
          </div>
          <div className="skill-projects" style={{ marginTop: 12 }}>
            <span className="skill-projects-label">Main Skills</span>
            {selectedSkillData.mainSkills.map((skill) => (
              <div key={skill} className="skill-project-item" style={{ borderColor: selectedSkillData.color }}>
                <span className="project-dot" style={{ background: selectedSkillData.color }} />
                {skill}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="skills-categories"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {["mobile", "backend", "frontend", "database", "embedded", "architecture"].map((cat) => {
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <div key={cat} className="category-tag">
              <span className="category-name">{cat}</span>
              <span className="category-count">{count}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
