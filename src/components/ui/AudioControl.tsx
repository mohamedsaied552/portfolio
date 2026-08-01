"use client";

import { motion } from "framer-motion";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

export function AudioControl() {
  const { isAudioEnabled, toggleAudio, isLoaded } = usePortfolio();

  if (!isLoaded) return null;

  return (
    <motion.button
      className="audio-control"
      onClick={toggleAudio}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isAudioEnabled ? "Mute audio" : "Enable audio"}
    >
      {isAudioEnabled ? (
        <HiVolumeUp className="w-4 h-4" />
      ) : (
        <HiVolumeOff className="w-4 h-4" />
      )}
      <span className="audio-control-ring" />
    </motion.button>
  );
}
