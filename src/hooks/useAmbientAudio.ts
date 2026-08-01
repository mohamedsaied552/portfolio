"use client";

import { useEffect, useRef } from "react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

export function useAmbientAudio() {
  const { isAudioEnabled } = usePortfolio();
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (!isAudioEnabled) {
      gainRef.current?.gain.setTargetAtTime(0, contextRef.current?.currentTime ?? 0, 0.3);
      return;
    }

    if (!contextRef.current) {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 55;
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = 110;
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      contextRef.current = ctx;
      gainRef.current = gain;
      oscRef.current = osc;
    }

    contextRef.current.resume();
    gainRef.current?.gain.setTargetAtTime(0.03, contextRef.current.currentTime, 0.5);

    return () => {
      gainRef.current?.gain.setTargetAtTime(0, contextRef.current?.currentTime ?? 0, 0.3);
    };
  }, [isAudioEnabled]);

  useEffect(() => {
    return () => {
      oscRef.current?.stop();
      contextRef.current?.close();
    };
  }, []);
}
