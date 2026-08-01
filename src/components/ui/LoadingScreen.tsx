"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

export function LoadingScreen() {
  const { isLoaded, setIsLoaded } = usePortfolio();
  const progressRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      progressRef.current += Math.random() * 15;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 400);
      }
    }, 120);

    const fallback = setTimeout(() => setIsLoaded(true), 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(fallback);
    };
  }, [setIsLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="loading-content">
            <motion.div
              className="loading-logo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="loading-bracket">&lt;</span>
              <span className="loading-name">MS</span>
              <span className="loading-bracket">/&gt;</span>
            </motion.div>
            <motion.p
              className="loading-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Initializing Experience
            </motion.p>
            <div className="loading-bar">
              <motion.div
                className="loading-bar-fill"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </div>
            <motion.div
              className="loading-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
