export type SoundName =
  | "ambient"
  | "hover"
  | "click"
  | "loader"
  | "project-open"
  | "section-transition"
  | "success";

const AUDIO_PATHS: Record<SoundName, string> = {
  ambient: "/audio/ambient.mp3",
  hover: "/audio/hover.mp3",
  click: "/audio/click.mp3",
  loader: "/audio/loader.mp3",
  "project-open": "/audio/project-open.mp3",
  "section-transition": "/audio/section-transition.mp3",
  success: "/audio/success.mp3",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgGain: GainNode | null = null;
  private effectGain: GainNode | null = null;
  private bgSource: AudioBufferSourceNode | null = null;
  private buffers: Partial<Record<SoundName, AudioBuffer>> = {};
  private loading: Partial<Record<SoundName, Promise<AudioBuffer>>> = {};
  private lastPlayed: Partial<Record<SoundName, number>> = {};
  private userVolume = 1;
  private userMuted = true;
  private loaderPlayed = false;
  private firstInteraction = false;
  private pendingLoader = false;

  constructor() {
    // Start muted by default, without persisting previous mute state.
    this.userMuted = true;
  }

  public getVolume() {
    return this.userVolume;
  }

  public getMuted() {
    return this.userMuted;
  }

  public async unlockAudio() {
    await this.ensureContext();
    this.firstInteraction = true;
    if (this.pendingLoader) {
      await this.playLoaderThenAmbient();
    }
  }

  public async setMuted(muted: boolean) {
    this.userMuted = muted;
    if (this.masterGain) {
      const target = muted ? 0 : this.userVolume;
      this.masterGain.gain.setTargetAtTime(target, this.currentTime, 0.05);
    }
  }

  public async playHover() {
    if (this.userMuted) return;
    await this.playSound("hover", { volume: 0.6, minInterval: 120 });
  }

  public async playClick() {
    if (this.userMuted) return;
    await this.playSound("click", { volume: 0.75, minInterval: 120 });
  }

  public async playSectionTransition() {
    if (this.userMuted) return;
    await this.playSound("section-transition", { volume: 0.85, minInterval: 350 });
  }

  public async playProjectOpen() {
    if (this.userMuted) return;
    await this.playSound("project-open", { volume: 0.85, minInterval: 400 });
  }

  public async playSuccess() {
    if (this.userMuted) return;
    await this.playSound("success", { volume: 0.85, minInterval: 500 });
  }

  public async playLoaderThenAmbient() {
    if (!this.firstInteraction) {
      this.pendingLoader = true;
      return;
    }

    if (!this.bgSource && !this.userMuted) {
      await this.startAmbient();
    }

    this.loaderPlayed = true;
    this.pendingLoader = false;
  }

  private async startAmbient() {
    if (this.bgSource || this.userMuted) return;
    if (!this.context || !this.bgGain) return;

    const buffer = await this.loadBuffer("ambient");
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.bgGain);
    const now = this.currentTime;
    this.bgGain.gain.setValueAtTime(0, now);
    this.bgGain.gain.linearRampToValueAtTime(1, now + 2.5);
    source.start(0);
    source.onended = () => {
      source.disconnect();
    };
    this.bgSource = source;
  }

  private async playSound(
    name: SoundName,
    options: { volume?: number; minInterval?: number } = {}
  ) {
    await this.ensureContext();

    if (!this.context || !this.effectGain || this.userMuted) return;
    const now = performance.now();
    const minInterval = options.minInterval ?? 100;
    if (
      this.lastPlayed[name] !== undefined &&
      now - this.lastPlayed[name] < minInterval
    ) {
      return;
    }

    this.lastPlayed[name] = now;
    const buffer = await this.loadBuffer(name);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    const gain = this.context.createGain();

    source.buffer = buffer;
    gain.gain.value = clamp(options.volume ?? 1, 0, 1);
    source.connect(gain);
    gain.connect(this.effectGain);
    source.start();
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
  }

  private async ensureContext() {
    if (!this.context) {
      await this.createContext();
    }

    if (this.context?.state === "suspended") {
      await this.context.resume();
    }
  }

  private async loadBuffer(name: SoundName) {
    if (this.buffers[name]) {
      return this.buffers[name] as AudioBuffer;
    }

    if (this.loading[name]) {
      return this.loading[name] as Promise<AudioBuffer>;
    }

    const promise = this.fetchAndDecodeAudio(name);
    this.loading[name] = promise;

    try {
      const buffer = await promise;
      this.buffers[name] = buffer;
      return buffer;
    } finally {
      delete this.loading[name];
    }
  }

  private async fetchAndDecodeAudio(name: SoundName) {
    if (!this.context) {
      await this.createContext();
    }

    const path = AUDIO_PATHS[name];
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load audio file ${path}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return await this.context!.decodeAudioData(arrayBuffer);
  }

  private async createContext() {
    const audioCtor =
      typeof window !== "undefined"
        ? (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
        : undefined;

    if (!audioCtor) {
      throw new Error("Web Audio API is not supported in this browser.");
    }

    const context = new audioCtor();
    const masterGain = context.createGain();
    const bgGain = context.createGain();
    const effectGain = context.createGain();

    masterGain.gain.value = this.userMuted ? 0 : this.userVolume;
    bgGain.gain.value = 0;
    effectGain.gain.value = 1;

    bgGain.connect(masterGain);
    effectGain.connect(masterGain);
    masterGain.connect(context.destination);

    this.context = context;
    this.masterGain = masterGain;
    this.bgGain = bgGain;
    this.effectGain = effectGain;
  }

  private get currentTime() {
    return this.context?.currentTime ?? 0;
  }
}
