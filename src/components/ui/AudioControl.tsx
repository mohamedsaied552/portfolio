"use client";

import { motion } from "framer-motion";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { useAudio } from "@/components/providers/AudioProvider";

export function AudioControl() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <motion.button
      type="button"
      className="audio-control"
      onClick={toggleMute}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.6 }}
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? <HiVolumeOff className="w-5 h-5" /> : <HiVolumeUp className="w-5 h-5" />}
    </motion.button>
  );
}
