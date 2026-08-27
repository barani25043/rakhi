import { useRef, useState, useCallback, useEffect } from "react";

interface UseBackgroundMusicOptions {
  src: string;
  loop?: boolean;
  volume?: number;
  fadeDuration?: number;
}

export function useBackgroundMusic({
  src,
  loop = true,
  volume = 0.3,
  fadeDuration = 1000,
}: UseBackgroundMusicOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [usingSynthFallback, setUsingSynthFallback] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = 0;
    audio.preload = "auto";

    audio.addEventListener("error", () => {
      // Audio file missing or invalid -> fallback to Web Audio API synthesizer
      setUsingSynthFallback(true);
      setIsAvailable(true);
    });

    audio.addEventListener("canplaythrough", () => {
      setIsAvailable(true);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (synthCtxRef.current) synthCtxRef.current.close();
    };
  }, [src, loop]);

  const startSynthMelody = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = synthCtxRef.current || new AudioCtx();
      synthCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Soulful Tamil Sister/Brother Bond Melody
      // (Inspired by classic Tamil sibling songs: "Kannana Kanne" & "Aanandha Yaazhai" / "Malargale")
      const melodySequence: Array<{
        note: number;
        harmony?: number;
        bass: number;
        duration: number;
        pause?: number;
      }> = [
        // Section 1: Soulful intro / opening phrasing ("Kannana Kanne... En Thangame...")
        { note: 523.25, harmony: 659.25, bass: 130.81, duration: 0.65 }, // C5 + E5, C3
        { note: 587.33, harmony: 698.46, bass: 146.83, duration: 0.55 }, // D5 + F5, D3
        { note: 659.25, harmony: 783.99, bass: 164.81, duration: 0.75 }, // E5 + G5, E3
        { note: 783.99, harmony: 987.77, bass: 196.00, duration: 0.90 }, // G5 + B5, G3
        { note: 659.25, harmony: 783.99, bass: 164.81, duration: 0.55 }, // E5
        { note: 587.33, harmony: 698.46, bass: 146.83, duration: 0.65 }, // D5
        { note: 523.25, harmony: 659.25, bass: 130.81, duration: 0.95 }, // C5
        { note: 440.00, harmony: 523.25, bass: 110.00, duration: 0.70 }, // A4

        // Section 2: Rising affection ("Aanandha Yaazhai Meetugirai...")
        { note: 523.25, harmony: 659.25, bass: 130.81, duration: 0.60 }, // C5
        { note: 659.25, harmony: 783.99, bass: 164.81, duration: 0.60 }, // E5
        { note: 783.99, harmony: 987.77, bass: 196.00, duration: 0.70 }, // G5
        { note: 880.00, harmony: 1046.50, bass: 220.00, duration: 0.85 }, // A5 + C6, A3
        { note: 987.77, harmony: 1174.66, bass: 246.94, duration: 0.60 }, // B5 + D6, B3
        { note: 880.00, harmony: 1046.50, bass: 220.00, duration: 0.60 }, // A5
        { note: 783.99, harmony: 987.77, bass: 196.00, duration: 0.80 }, // G5
        { note: 659.25, harmony: 783.99, bass: 164.81, duration: 0.95 }, // E5

        // Section 3: Gentle Tamil flute flourish ("Poo Pookum Oosai... Anbe...")
        { note: 783.99, harmony: 987.77, bass: 196.00, duration: 0.55 }, // G5
        { note: 880.00, harmony: 1046.50, bass: 220.00, duration: 0.55 }, // A5
        { note: 1046.50, harmony: 1318.51, bass: 261.63, duration: 0.90 }, // C6 + E6, C4
        { note: 880.00, harmony: 1046.50, bass: 220.00, duration: 0.55 }, // A5
        { note: 783.99, harmony: 987.77, bass: 196.00, duration: 0.65 }, // G5
        { note: 659.25, harmony: 783.99, bass: 164.81, duration: 0.70 }, // E5
        { note: 587.33, harmony: 698.46, bass: 146.83, duration: 0.60 }, // D5
        { note: 523.25, harmony: 659.25, bass: 130.81, duration: 1.20 }, // C5 (warm hold)

        // Section 4: Sweet resolution
        { note: 440.00, harmony: 587.33, bass: 110.00, duration: 0.65 }, // A4
        { note: 493.88, harmony: 659.25, bass: 123.47, duration: 0.60 }, // B4
        { note: 523.25, harmony: 659.25, bass: 130.81, duration: 1.40 }, // C5 (final sustain)
      ];
      let idx = 0;

      const playNote = () => {
        if (!synthCtxRef.current || synthCtxRef.current.state !== "running")
          return;
        const current = melodySequence[idx % melodySequence.length];
        const now = ctx.currentTime;

        // 1. Lead Flute/Melody Tone (Sine + gentle vibrato)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(current.note, now);

        // 2. Harmony String/Chime Tone
        let harmonyOsc: OscillatorNode | null = null;
        let harmonyGain: GainNode | null = null;
        if (current.harmony) {
          harmonyOsc = ctx.createOscillator();
          harmonyGain = ctx.createGain();
          harmonyOsc.type = "triangle";
          harmonyOsc.frequency.setValueAtTime(current.harmony, now);

          harmonyGain.gain.setValueAtTime(0, now);
          harmonyGain.gain.linearRampToValueAtTime(volume * 0.12, now + 0.08);
          harmonyGain.gain.exponentialRampToValueAtTime(0.001, now + current.duration + 0.3);

          harmonyOsc.connect(harmonyGain);
          harmonyGain.connect(ctx.destination);
          harmonyOsc.start(now);
          harmonyOsc.stop(now + current.duration + 0.3);
        }

        // 3. Acoustic Warm Bass / Drone (Rich low resonance)
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = "sine";
        bassOsc.frequency.setValueAtTime(current.bass, now);

        // Lead envelope (soft attack, sustained flute/music-box tone, gentle release)
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume * 0.35, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + current.duration + 0.4);

        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(volume * 0.20, now + 0.1);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + current.duration + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + current.duration + 0.4);
        bassOsc.start(now);
        bassOsc.stop(now + current.duration + 0.6);

        idx++;
      };

      playNote();
      synthIntervalRef.current = window.setInterval(playNote, 560);
      setIsPlaying(true);
      setIsMuted(false);
    } catch {
      // AudioContext unavailable
    }
  }, [volume]);

  const stopSynthMelody = useCallback(() => {
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    if (synthCtxRef.current) synthCtxRef.current.suspend();
    setIsPlaying(false);
    setIsMuted(true);
  }, []);

  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    audio.volume = 0;
    const step = volume / (fadeDuration / 50);
    fadeIntervalRef.current = window.setInterval(() => {
      if (audio.volume + step >= volume) {
        audio.volume = volume;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      } else {
        audio.volume = Math.min(audio.volume + step, volume);
      }
    }, 50);
  }, [volume, fadeDuration]);

  const fadeOut = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const step = audio.volume / (fadeDuration / 50);
    fadeIntervalRef.current = window.setInterval(() => {
      if (audio.volume - step <= 0) {
        audio.volume = 0;
        audio.pause();
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        setIsPlaying(false);
      } else {
        audio.volume = Math.max(audio.volume - step, 0);
      }
    }, 50);
  }, [fadeDuration]);

  const play = useCallback(() => {
    if (usingSynthFallback) {
      startSynthMelody();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsMuted(false);
        fadeIn();
      })
      .catch(() => {
        // Fallback to Web Audio synth if HTML audio play fails
        startSynthMelody();
      });
  }, [fadeIn, startSynthMelody, usingSynthFallback]);

  const pause = useCallback(() => {
    if (usingSynthFallback) {
      stopSynthMelody();
    } else {
      fadeOut();
    }
  }, [fadeOut, stopSynthMelody, usingSynthFallback]);

  const toggleMute = useCallback(() => {
    if (isMuted || !isPlaying) {
      play();
    } else {
      pause();
      setIsMuted(true);
    }
  }, [isMuted, isPlaying, play, pause]);

  return {
    isPlaying,
    isMuted,
    isAvailable,
    play,
    pause,
    toggleMute,
    fadeIn,
    fadeOut,
  };
}
