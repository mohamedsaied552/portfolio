"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

interface PortfolioContextValue {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  activeProjectIndex: number;
  setActiveProjectIndex: (index: number) => void;
  selectedSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [activeProjectIndex, setActiveProjectIndex] = useState(-1);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      scrollProgress,
      setScrollProgress,
      activeSection,
      setActiveSection,
      activeProjectIndex,
      setActiveProjectIndex,
      selectedSkill,
      setSelectedSkill,
      isLoaded,
      setIsLoaded,
      isAudioEnabled,
      toggleAudio,
    }),
    [
      scrollProgress,
      activeSection,
      activeProjectIndex,
      selectedSkill,
      isLoaded,
      isAudioEnabled,
      toggleAudio,
    ]
  );

  return (
    <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
