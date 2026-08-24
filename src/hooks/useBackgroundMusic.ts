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
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = synthCtxRef.current || new AudioCtx();
      synthCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Music box melody: C5, E5, G5, E5, G5, A5, G5, E5, D5, E5, C5
      const notes = [523.25, 659.25, 783.99, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 659.25, 523.25];
      let idx = 0;

      const playNote = () => {
        if (!synthCtxRef.current || synthCtxRef.current.state !== "running") return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.value = notes[idx % notes.length];

        gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.8);

        idx++;
      };

      playNote();
      synthIntervalRef.current = window.setInterval(playNote, 600);
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
