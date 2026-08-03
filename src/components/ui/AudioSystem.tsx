"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "@/components/providers/AudioProvider";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

const INTERACTIVE_SELECTOR = "button, a, [role=button], input, textarea, select";

function isInteractiveElement(target: EventTarget | null): target is HTMLElement {
  return (
    target instanceof HTMLElement &&
    target.closest(INTERACTIVE_SELECTOR) !== null
  );
}

export function AudioSystem() {
  const { activeSection, activeProjectIndex } = usePortfolio();
  const {
    initialized,
    unlockAudio,
    playLoaderThenAmbient,
    playSectionTransition,
    playProjectOpen,
    playClick,
    playHover,
  } = useAudio();

  const lastSection = useRef(activeSection);
  const lastProjectIndex = useRef(activeProjectIndex);

  useEffect(() => {
    const handleFirstInteraction = async () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      await unlockAudio();
      await playLoaderThenAmbient();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [unlockAudio, playLoaderThenAmbient]);

  useEffect(() => {
    if (!initialized) return;

    const handlePointerOver = (event: PointerEvent) => {
      if (!isInteractiveElement(event.target)) return;
      playHover();
    };

    const handleClick = (event: MouseEvent) => {
      if (!isInteractiveElement(event.target)) return;
      playClick();
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("click", handleClick);
    };
  }, [initialized, playHover, playClick]);

  useEffect(() => {
    if (!initialized) return;
    if (lastSection.current !== activeSection) {
      lastSection.current = activeSection;
      playSectionTransition();
    }
  }, [activeSection, initialized, playSectionTransition]);

  useEffect(() => {
    if (!initialized) return;
    if (
      lastProjectIndex.current !== activeProjectIndex &&
      activeProjectIndex >= 0
    ) {
      lastProjectIndex.current = activeProjectIndex;
      playProjectOpen();
    }
  }, [activeProjectIndex, initialized, playProjectOpen]);

  return null;
}
