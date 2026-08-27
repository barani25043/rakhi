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

      // Emotional Tamil melody (Mohanam / Bilahari raga inspired notes & gentle harmonies)
      // Notes: G4, E5, D5, C5, D5, E5, G5, A5, G5, E5, D5, C5, D5, C5, A4, C5
      const melodySequence = [
        { note: 392.0, duration: 0.7, bass: 130.81 },  // G4 (Sa/Pa)
        { note: 659.25, duration: 0.6, bass: 164.81 }, // E5
        { note: 587.33, duration: 0.5, bass: 196.0 },  // D5
        { note: 523.25, duration: 0.8, bass: 130.81 }, // C5
        { note: 587.33, duration: 0.5, bass: 146.83 }, // D5
        { note: 659.25, duration: 0.6, bass: 164.81 }, // E5
        { note: 783.99, duration: 0.9, bass: 196.0 },  // G5
        { note: 880.0, duration: 0.6, bass: 220.0 },   // A5
        { note: 783.99, duration: 0.6, bass: 196.0 },  // G5
        { note: 659.25, duration: 0.5, bass: 164.81 }, // E5
        { note: 587.33, duration: 0.6, bass: 146.83 }, // D5
        { note: 523.25, duration: 0.8, bass: 130.81 }, // C5
        { note: 587.33, duration: 0.5, bass: 146.83 }, // D5
        { note: 523.25, duration: 0.9, bass: 130.81 }, // C5
        { note: 440.0, duration: 0.6, bass: 110.0 },   // A4
        { note: 523.25, duration: 1.2, bass: 130.81 }, // C5 (held)
      ];
      let idx = 0;

      const playNote = () => {
        if (!synthCtxRef.current || synthCtxRef.current.state !== "running")
          return;
        const current = melodySequence[idx % melodySequence.length];
        const now = ctx.currentTime;

        // Lead flute/bell oscillator
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(current.note, now);

        // Soft shimmer overtone
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = "triangle";
        overtone.frequency.setValueAtTime(current.note * 2, now);

        // Warm bass drone note
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = "sine";
        bassOsc.frequency.setValueAtTime(current.bass, now);

        // Envelopes for smooth, gentle acoustic feel
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume * 0.32, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + current.duration + 0.4);

        overtoneGain.gain.setValueAtTime(0, now);
        overtoneGain.gain.linearRampToValueAtTime(volume * 0.09, now + 0.05);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + current.duration * 0.8);

        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(volume * 0.18, now + 0.1);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + current.duration + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        overtone.connect(overtoneGain);
        overtoneGain.connect(ctx.destination);
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + current.duration + 0.4);
        overtone.start(now);
        overtone.stop(now + current.duration + 0.8);
        bassOsc.start(now);
        bassOsc.stop(now + current.duration + 0.6);

        idx++;
      };

      playNote();
      synthIntervalRef.current = window.setInterval(playNote, 580);
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
