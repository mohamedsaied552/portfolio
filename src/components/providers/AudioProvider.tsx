"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { AudioManager } from "@/lib/audioManager";

interface AudioContextValue {
  audioManager: AudioManager;
  isMuted: boolean;
  initialized: boolean;
  toggleMute: () => Promise<void>;
  unlockAudio: () => Promise<void>;
  playHover: () => Promise<void>;
  playClick: () => Promise<void>;
  playSectionTransition: () => Promise<void>;
  playProjectOpen: () => Promise<void>;
  playSuccess: () => Promise<void>;
  playLoaderThenAmbient: () => Promise<void>;
}

const AudioContext = createContext<AudioContextValue | null>(null);
let singletonAudioManager: AudioManager | null = null;

function getAudioManager() {
  if (!singletonAudioManager) {
    singletonAudioManager = new AudioManager();
  }
  return singletonAudioManager;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const audioManager = useMemo(() => getAudioManager(), []);
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());

  useEffect(() => {
    setIsMuted(audioManager.getMuted());
  }, [audioManager]);

  const unlockAudio = useCallback(async () => {
    await audioManager.unlockAudio();
    setInitialized(true);
  }, [audioManager]);

  const toggleMute = useCallback(async () => {
    const next = !audioManager.getMuted();
    await audioManager.setMuted(next);
    setIsMuted(next);
  }, [audioManager]);

  const contextValue = useMemo(
    () => ({
      audioManager,
      isMuted,
      initialized,
      toggleMute,
      unlockAudio,
      playHover: async () => {
        await audioManager.playHover();
      },
      playClick: async () => {
        await audioManager.playClick();
      },
      playSectionTransition: async () => {
        await audioManager.playSectionTransition();
      },
      playProjectOpen: async () => {
        await audioManager.playProjectOpen();
      },
      playSuccess: async () => {
        await audioManager.playSuccess();
      },
      playLoaderThenAmbient: async () => {
        await audioManager.playLoaderThenAmbient();
      },
    }),
    [audioManager, isMuted, initialized, toggleMute, unlockAudio]
  );

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}
