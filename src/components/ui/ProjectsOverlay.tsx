"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { getProjectLocalProgress } from "@/lib/utils";

export function ProjectsOverlay() {
  const { activeProjectIndex, scrollProgress } = usePortfolio();

  return (
    <div className="projects-scroll-container">
      {projects.map((project, index) => {
        const localProgress = getProjectLocalProgress(scrollProgress, index);
        const isActive = activeProjectIndex === index;
        const sectionOpacity = isActive ? 1 : 0.3;

        return (
          <div
            key={project.id}
            className="project-section"
            style={{ opacity: sectionOpacity }}
          >
            <motion.div
              className="project-content"
              initial={{ opacity: 0, x: 50 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="project-meta">
                <span className="section-label">
                  03 — PROJECT {String(index + 1).padStart(2, "0")}
                </span>
                {index === 0 && <span className="flagship-badge">FLAGSHIP</span>}
              </div>

              <h2 className="project-name" style={{ color: project.color }}>
                {project.name}
              </h2>
              <p className="project-tagline">{project.tagline}</p>
              <p className="project-description">{project.description}</p>

              <div className="project-highlights">
                {project.highlights.map((h, i) => (
                  <motion.div
                    key={h}
                    className="highlight-item glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <span className="highlight-dot" style={{ background: project.color }} />
                    {h}
                  </motion.div>
                ))}
              </div>

              <div className="project-tech">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="tech-tag"
                    style={{ borderColor: project.color, color: project.color }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="project-progress-bar">
                <div
                  className="project-progress-fill"
                  style={{
                    width: `${localProgress * 100}%`,
                    background: `linear-gradient(90deg, ${project.color}, ${project.accentColor})`,
                  }}
                />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
