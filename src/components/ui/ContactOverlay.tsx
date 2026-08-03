"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from "react-icons/fa";
import { contactLinks, siteInfo } from "@/data/contact";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useMemo, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
  email: <FaEnvelope />,
  cv: <FaDownload />,
};

export function ContactOverlay() {
  const { activeSection } = usePortfolio();
  const isVisible = activeSection === "contact";

  return (
    <div className="overlay contact-overlay" style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}>
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="section-label">04 — CONNECT</span>
        <h2 className="section-title">Let&apos;s Build Something</h2>
        <p className="section-subtitle">
          Ready to create the next immersive experience together?
        </p>
      </motion.div>

      <motion.div
        className="contact-terminal glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">comm_terminal.exe</span>
        </div>
        <div className="terminal-body">
          <p className="terminal-line">
            <span className="terminal-prompt">&gt;</span> Initializing contact protocol...
          </p>
          <p className="terminal-line">
            <span className="terminal-prompt">&gt;</span> User: {siteInfo.name}
          </p>
          <p className="terminal-line">
            <span className="terminal-prompt">&gt;</span> Location: {siteInfo.country}
          </p>
          <p className="terminal-line">
            <span className="terminal-prompt">&gt;</span> Status: <span className="status-online">AVAILABLE</span>
          </p>
        </div>
      </motion.div>

      <motion.div
        className="contact-links"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {contactLinks.map((link, i) => (
          <motion.a
            key={link.id}
            href={link.href}
            target={link.id !== "email" && link.id !== "cv" ? "_blank" : undefined}
            rel={link.id !== "email" && link.id !== "cv" ? "noopener noreferrer" : undefined}
            className="contact-link glass-panel"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <span className="contact-icon">{iconMap[link.icon]}</span>
            <span className="contact-label">{link.label}</span>
            <span className="contact-arrow">→</span>
          </motion.a>
        ))}
      </motion.div>

      <motion.footer
        className="site-footer"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <span>© 2025 {siteInfo.name}</span>
        <span className="footer-separator">·</span>
        <span>Crafted with precision</span>
      </motion.footer>
    </div>
  );
}
