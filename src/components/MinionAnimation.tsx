import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";

export type MinionAnimationType =
  | "idle"
  | "wave"
  | "dance"
  | "banana"
  | "happy"
  | "cheer"
  | "jump"
  | "gift"
  | "ukulele";

export type MinionCharacterType = "bob" | "stuart" | "kevin";

interface MinionAnimationProps {
  animation?: MinionAnimationType;
  character?: MinionCharacterType;
  size?: number;
  className?: string;
  onClick?: () => void;
  showSpeechBubble?: boolean;
  speechText?: string;
  interactive?: boolean;
}

const MINION_QUOTES: Record<MinionAnimationType, string[]> = {
  idle: [
    "Bello Akka! 👋",
    "Tulaliloo ti amo! ❤️",
    "Banana? 🍌",
    "Hehehe potato! 🥔",
  ],
  wave: [
    "Bellooo Akka! 👋✨",
    "Happy Rakhi Akka! 🪢",
    "Poopaye! 💕",
  ],
  dance: [
    "Disco banana! 💃",
    "Baboi party time! 🎉",
    "Choko-chips dance! 🍫",
  ],
  banana: [
    "BANANAAAAA!! 🍌🍌",
    "Me want banana! 😋",
    "Yummy laddoo too! 🟡",
  ],
  happy: [
    "Yaaaaay Akka! 🥳",
    "Tulaliloo Akka! ❤️",
    "Best Akka in the World! 🏆",
  ],
  cheer: [
    "WOOHOOO! 🎊",
    "Para tu Akka! 🎁",
    "BEE-DO BEE-DO! 🚨❤️",
  ],
  jump: [
    "BOING BANANA! 🚀",
    "Jump jump jump! 🤸‍♂️",
  ],
  gift: [
    "Special Rakhi for Akka! 🎁",
    "Para tu Akka! With love ❤️",
    "Gold star for Akka! ⭐",
  ],
  ukulele: [
    "🎵 La la la banana song~",
    "🎶 Rakhi tunes for Akka! 🎸",
  ],
};

// 3D Perspective & Squash-Stretch Motion Configs
const minion3DConfigs: Record<
  string,
  {
    container: object;
    inner: object;
  }
> = {
  idle: {
    container: {
      rotateX: [0, 6, 0, -4, 0],
      rotateY: [0, -8, 0, 8, 0],
      rotateZ: [0, 2, -2, 1, 0],
      transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -6, 0, -3, 0],
      scaleX: [1, 1.03, 0.98, 1.02, 1],
      scaleY: [1, 0.97, 1.03, 0.98, 1],
      transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  wave: {
    container: {
      rotateX: [0, 8, -5, 8, 0],
      rotateY: [0, -18, 15, -18, 0],
      rotateZ: [0, -10, 8, -10, 0],
      transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -12, 0, -6, 0],
      scaleX: [1, 1.06, 0.94, 1.04, 1],
      scaleY: [1, 0.94, 1.06, 0.96, 1],
      transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
    },
  },
  dance: {
    container: {
      rotateX: [12, -12, 12, -12, 0],
      rotateY: [-22, 22, -22, 22, 0],
      rotateZ: [-14, 14, -14, 14, 0],
      transition: { duration: 0.65, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      x: [-14, 14, -14, 14, 0],
      y: [0, -22, 0, -22, 0],
      scaleX: [0.9, 1.15, 0.9, 1.15, 1],
      scaleY: [1.15, 0.85, 1.15, 0.85, 1],
      transition: { duration: 0.65, repeat: Infinity, ease: "easeInOut" },
    },
  },
  banana: {
    container: {
      rotateX: [0, 18, -10, 18, 0],
      rotateY: [-15, 15, -15, 15, 0],
      rotateZ: [0, -8, 8, -8, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -25, 0],
      scaleX: [1, 1.15, 0.9, 1],
      scaleY: [1, 0.88, 1.15, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },
  },
  happy: {
    container: {
      rotateX: [0, 14, -8, 14, 0],
      rotateY: [-12, 12, -12, 12, 0],
      rotateZ: [0, -6, 6, -6, 0],
      transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -20, 0, -10, 0],
      scaleX: [1, 1.12, 0.92, 1.08, 1],
      scaleY: [1, 0.88, 1.12, 0.92, 1],
      transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" },
    },
  },
  cheer: {
    container: {
      rotateX: [10, -10, 10, -10, 0],
      rotateY: [-15, 15, -15, 15, 0],
      rotateZ: [-10, 10, -10, 10, 0],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -30, 0],
      scaleX: [1, 0.85, 1.18, 1],
      scaleY: [1, 1.2, 0.82, 1],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    },
  },
  jump: {
    container: {
      rotateX: [0, -22, 18, 0],
      rotateY: [0, 12, -12, 0],
      rotateZ: [0, 8, -8, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeOut" },
    },
    inner: {
      y: [0, -50, 0],
      scaleX: [1, 0.82, 1.2, 0.9, 1],
      scaleY: [1, 1.24, 0.76, 1.1, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeOut" },
    },
  },
  gift: {
    container: {
      rotateY: [15, 0, -5, 5, 0],
      rotateX: [6, 0],
      transition: { rotateY: { duration: 1.5, repeat: Infinity }, rotateX: { duration: 0.6 } },
    },
    inner: {
      x: [25, 0],
      y: [0, -8, 0],
      scale: [0.9, 1.05, 1],
      transition: {
        x: { duration: 0.6, ease: "easeOut" },
        y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
        scale: { duration: 0.6 },
      },
    },
  },
  ukulele: {
    container: {
      rotateZ: [-8, 8, -8, 8, -8],
      rotateY: [-10, 10, -10, 10, -10],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -8, 0, -8, 0],
      scaleX: [1, 1.04, 0.98, 1.04, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
  },
};

// Web Audio Minion Sound Synthesizer
function playMinionSound(type: "bello" | "banana" | "cheer" | "giggle") {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "banana") {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc1.frequency.exponentialRampToValueAtTime(659, now + 0.25);
      osc1.frequency.exponentialRampToValueAtTime(1174, now + 0.45);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);
    } else if (type === "bello") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === "giggle") {
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.08;
        osc.type = "sine";
        osc.frequency.setValueAtTime(700 + i * 80, t);
        osc.frequency.exponentialRampToValueAtTime(1000 + i * 80, t + 0.06);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      }
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.exponentialRampToValueAtTime(1046, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch {
    // Audio blocked
  }
}

export default function MinionAnimation({
  animation = "idle",
  character = "bob",
  size = 140,
  className = "",
  onClick,
  showSpeechBubble = true,
  speechText,
  interactive = true,
}: MinionAnimationProps) {
  const [activeCombo, setActiveCombo] = useState<MinionAnimationType | null>(null);
  const [customSpeech, setCustomSpeech] = useState<string | null>(null);
  const [popProps, setPopProps] = useState<
    Array<{ id: number; icon: string; x: number; y: number }>
  >([]);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [eyePupil, setEyePupil] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentAnim = activeCombo || animation;
  const config = minion3DConfigs[currentAnim] || minion3DConfigs.idle;

  const defaultList = MINION_QUOTES[currentAnim] || MINION_QUOTES.idle;
  const speech = customSpeech || speechText || defaultList[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      rotateX: -y * 25,
      rotateY: x * 25,
    });

    setEyePupil({
      x: Math.max(-6, Math.min(6, x * 12)),
      y: Math.max(-6, Math.min(6, y * 12)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setEyePupil({ x: 0, y: 0 });
  };

  const handleTap = () => {
    if (!interactive) return;

    const sfxTypes: Array<"bello" | "banana" | "cheer" | "giggle"> = [
      "banana",
      "bello",
      "giggle",
      "cheer",
    ];
    playMinionSound(sfxTypes[Math.floor(Math.random() * sfxTypes.length)]);

    const randomQ = defaultList[Math.floor(Math.random() * defaultList.length)];
    setCustomSpeech(randomQ);
    setTimeout(() => setCustomSpeech(null), 2500);

    const icons = ["🍌", "🪢", "❤️", "⭐", "🎉", "🟡", "🎸"];
    const newProps = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      x: (Math.random() - 0.5) * 130,
      y: (Math.random() - 0.5) * 110,
    }));
    setPopProps(newProps);
    setTimeout(() => setPopProps([]), 1200);

    if (!activeCombo) {
      setActiveCombo("banana");
      setTimeout(() => setActiveCombo("dance"), 700);
      setTimeout(() => setActiveCombo("cheer"), 1400);
      setTimeout(() => setActiveCombo(null), 2100);
    }

    if (onClick) onClick();
  };

  const isBob = character === "bob";
  const isStuart = character === "stuart";
  const isKevin = character === "kevin";

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center ${className}`}
    >
      {/* Speech Bubble — in normal document flow, not absolute */}
      <AnimatePresence mode="wait">
        {showSpeechBubble && (
          <motion.div
            key={currentAnim + speech}
            className="mb-1 z-30 px-2.5 py-0.5 bg-yellow-400/95 backdrop-blur-sm text-gray-900 rounded-full shadow-md border-2 border-yellow-500 pointer-events-none flex items-center gap-1 whitespace-nowrap self-center"
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.85 }}
            transition={{ duration: 0.25, type: "spring" }}
          >
            <span className="text-[10px]">🍌</span>
            <p className="font-hand text-[10px] font-extrabold text-gray-900">
              {speech}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed lines */}
      {(currentAnim === "dance" ||
        currentAnim === "banana" ||
        currentAnim === "cheer" ||
        currentAnim === "jump") && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"
              style={{ transform: `rotate(${i * 22.5}deg)` }}
            />
          ))}
        </motion.div>
      )}

      {/* Pop props */}
      <AnimatePresence>
        {popProps.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-2xl pointer-events-none z-40 select-none"
            initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.5, 1.4, 0.8],
              x: p.x,
              y: p.y - 45,
              rotate: [0, Math.random() > 0.5 ? 120 : -120],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {p.icon}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 3D Container */}
      <div
        className="cursor-pointer select-none"
        style={{
          perspective: 600,
          perspectiveOrigin: "50% 50%",
          width: size,
          height: size * (isBob ? 1.1 : isStuart ? 1.2 : 1.3),
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* 3D Rotation Layer */}
        <motion.div
          className="w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          animate={{
            ...(config.container as TargetAndTransition),
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
        >
          {/* Inner Layer */}
          <motion.div
            className="relative w-full h-full select-none cursor-pointer z-10 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
            animate={config.inner as TargetAndTransition}
            onClick={handleTap}
            whileHover={{ scale: 1.1, rotateY: 10, rotateX: -6 }}
            whileTap={{ scale: 0.9, rotateX: 15 }}
          >
            {/* SVG Minion */}
            <svg
              viewBox="0 0 160 220"
              className="w-full h-full object-contain filter drop-shadow-lg"
              style={{
                filter: "drop-shadow(3px 8px 12px rgba(0,0,0,0.28))",
              }}
            >
              <defs>
                <linearGradient id={`minionSkin-${character}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF275" />
                  <stop offset="40%" stopColor="#FEE12B" />
                  <stop offset="100%" stopColor="#E5B900" />
                </linearGradient>

                <linearGradient id={`minionDenim-${character}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>

                <linearGradient id="goggleMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F3F4F6" />
                  <stop offset="30%" stopColor="#9CA3AF" />
                  <stop offset="60%" stopColor="#E5E7EB" />
                  <stop offset="100%" stopColor="#6B7280" />
                </linearGradient>

                <linearGradient id="lensGlare" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>

                <linearGradient id="rakhiGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* Minion Hair */}
              {isKevin && (
                <g stroke="#333" strokeWidth="3" strokeLinecap="round">
                  <path d="M 76 25 Q 74 12 70 8" />
                  <path d="M 80 24 Q 80 8 80 5" />
                  <path d="M 84 25 Q 86 12 90 8" />
                </g>
              )}
              {isStuart && (
                <g stroke="#333" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M 80 32 C 70 20, 60 25, 55 35" fill="none" />
                  <path d="M 80 32 C 90 20, 100 25, 105 35" fill="none" />
                  <path d="M 80 30 C 75 16, 68 18, 62 26" fill="none" />
                  <path d="M 80 30 C 85 16, 92 18, 98 26" fill="none" />
                </g>
              )}
              {isBob && (
                <g stroke="#333" strokeWidth="2" strokeLinecap="round">
                  <path d="M 78 40 Q 80 35 82 40" fill="none" />
                </g>
              )}

              {/* Minion Body */}
              <rect
                x="30"
                y={isKevin ? "20" : isStuart ? "30" : "40"}
                width="100"
                height={isKevin ? "155" : isStuart ? "145" : "135"}
                rx="50"
                ry="50"
                fill={`url(#minionSkin-${character})`}
                stroke="#B48E00"
                strokeWidth="2.5"
              />

              {/* Goggle Strap */}
              <rect
                x="28"
                y={isKevin ? "60" : isStuart ? "68" : "75"}
                width="104"
                height="14"
                fill="#222"
                rx="3"
              />

              {/* Goggles and Eyes */}
              {isStuart ? (
                <g transform="translate(80, 75)">
                  <circle cx="0" cy="0" r="26" fill="url(#goggleMetal)" stroke="#374151" strokeWidth="3" />
                  <circle cx="0" cy="0" r="20" fill="#FFF" stroke="#4B5563" strokeWidth="2" />
                  <circle
                    cx={eyePupil.x}
                    cy={eyePupil.y}
                    r="9"
                    fill="#7C4A15"
                  />
                  <circle
                    cx={eyePupil.x}
                    cy={eyePupil.y}
                    r="5"
                    fill="#111"
                  />
                  <circle
                    cx={eyePupil.x - 2.5}
                    cy={eyePupil.y - 2.5}
                    r="2.5"
                    fill="#FFF"
                  />
                  <circle cx="0" cy="0" r="20" fill="url(#lensGlare)" />
                </g>
              ) : (
                <g transform={`translate(80, ${isKevin ? 67 : 82})`}>
                  <g transform="translate(-18, 0)">
                    <circle cx="0" cy="0" r="20" fill="url(#goggleMetal)" stroke="#374151" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="15" fill="#FFF" stroke="#4B5563" strokeWidth="1.5" />
                    <circle
                      cx={eyePupil.x}
                      cy={eyePupil.y}
                      r="7"
                      fill={isBob ? "#10B981" : "#7C4A15"}
                    />
                    <circle cx={eyePupil.x} cy={eyePupil.y} r="4" fill="#111" />
                    <circle cx={eyePupil.x - 2} cy={eyePupil.y - 2} r="2" fill="#FFF" />
                    <circle cx="0" cy="0" r="15" fill="url(#lensGlare)" />
                  </g>
                  <g transform="translate(18, 0)">
                    <circle cx="0" cy="0" r="20" fill="url(#goggleMetal)" stroke="#374151" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="15" fill="#FFF" stroke="#4B5563" strokeWidth="1.5" />
                    <circle
                      cx={eyePupil.x}
                      cy={eyePupil.y}
                      r="7"
                      fill="#7C4A15"
                    />
                    <circle cx={eyePupil.x} cy={eyePupil.y} r="4" fill="#111" />
                    <circle cx={eyePupil.x - 2} cy={eyePupil.y - 2} r="2" fill="#FFF" />
                    <circle cx="0" cy="0" r="15" fill="url(#lensGlare)" />
                  </g>
                  <rect x="-8" y="-3" width="16" height="6" fill="url(#goggleMetal)" rx="2" />
                </g>
              )}

              {/* Mouth */}
              {currentAnim === "happy" || currentAnim === "cheer" || currentAnim === "dance" || currentAnim === "banana" ? (
                <g transform={`translate(80, ${isKevin ? 108 : isStuart ? 114 : 118})`}>
                  <path
                    d="M -18 0 Q 0 20 18 0 Q 0 6 -18 0 Z"
                    fill="#7F1D1D"
                    stroke="#450A0A"
                    strokeWidth="1.5"
                  />
                  <path d="M -14 1 Q 0 6 14 1 L 11 5 Q 0 8 -11 5 Z" fill="#FFF" />
                  <path d="M -8 11 Q 0 8 8 11 Q 0 18 -8 11 Z" fill="#F43F5E" />
                </g>
              ) : (
                <g transform={`translate(80, ${isKevin ? 106 : isStuart ? 112 : 116})`}>
                  <path
                    d="M -14 0 Q 2 12 16 -3"
                    fill="none"
                    stroke="#450A0A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path d="M 15 -5 Q 18 -2 16 1" fill="none" stroke="#450A0A" strokeWidth="2" />
                </g>
              )}

              {/* Overalls */}
              <g id="overalls">
                <path
                  d={`M 30 ${isKevin ? 142 : isStuart ? 135 : 130} 
                     L 130 ${isKevin ? 142 : isStuart ? 135 : 130} 
                     L 130 175 Q 80 185 30 175 Z`}
                  fill={`url(#minionDenim-${character})`}
                  stroke="#1D4ED8"
                  strokeWidth="2"
                />

                <path
                  d={`M 48 ${isKevin ? 122 : isStuart ? 122 : 124} 
                     L 112 ${isKevin ? 122 : isStuart ? 122 : 124} 
                     L 112 ${isKevin ? 150 : isStuart ? 145 : 140} 
                     L 48 ${isKevin ? 150 : isStuart ? 145 : 140} Z`}
                  fill={`url(#minionDenim-${character})`}
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                />

                <path
                  d={`M 32 ${isKevin ? 115 : isStuart ? 115 : 118} 
                     L 54 ${isKevin ? 128 : isStuart ? 126 : 128} 
                     L 48 ${isKevin ? 138 : isStuart ? 136 : 138} 
                     L 30 ${isKevin ? 125 : isStuart ? 125 : 126} Z`}
                  fill="#1E3A8A"
                  stroke="#1D4ED8"
                  strokeWidth="1"
                />
                <path
                  d={`M 128 ${isKevin ? 115 : isStuart ? 115 : 118} 
                     L 106 ${isKevin ? 128 : isStuart ? 126 : 128} 
                     L 112 ${isKevin ? 138 : isStuart ? 136 : 138} 
                     L 130 ${isKevin ? 125 : isStuart ? 125 : 126} Z`}
                  fill="#1E3A8A"
                  stroke="#1D4ED8"
                  strokeWidth="1"
                />

                <circle cx="50" cy={isKevin ? 133 : isStuart ? 132 : 133} r="3" fill="#111" />
                <circle cx="110" cy={isKevin ? 133 : isStuart ? 132 : 133} r="3" fill="#111" />

                <path
                  d={`M 64 ${isKevin ? 135 : isStuart ? 135 : 135} 
                     L 96 ${isKevin ? 135 : isStuart ? 135 : 135} 
                     L 96 ${isKevin ? 152 : isStuart ? 150 : 148} 
                     Q 80 ${isKevin ? 162 : isStuart ? 160 : 158} 64 ${isKevin ? 152 : isStuart ? 150 : 148} Z`}
                  fill="#1E40AF"
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                />

                <circle cx="80" cy={isKevin ? 146 : isStuart ? 144 : 144} r="6" fill="#F59E0B" />
                <circle cx="80" cy={isKevin ? 146 : isStuart ? 144 : 144} r="3.5" fill="#DC2626" />
                <circle cx="80" cy={isKevin ? 146 : isStuart ? 144 : 144} r="1.5" fill="#FEF08A" />
              </g>

              {/* Arms */}
              {currentAnim === "wave" || currentAnim === "cheer" ? (
                <g>
                  <path d="M 30 120 Q 15 135 22 150" stroke="#FEE12B" strokeWidth="12" strokeLinecap="round" fill="none" />
                  <circle cx="22" cy="150" r="8" fill="#111" />
                  <path d="M 130 115 Q 148 95 142 80" stroke="#FEE12B" strokeWidth="12" strokeLinecap="round" fill="none" />
                  <circle cx="142" cy="78" r="8" fill="#111" />
                  <rect x="136" y="85" width="12" height="4" fill="url(#rakhiGold)" rx="2" transform="rotate(30, 136, 85)" />
                  <circle cx="140" cy="87" r="3.5" fill="#DC2626" />
                </g>
              ) : currentAnim === "banana" ? (
                <g>
                  <path
                    d="M 50 125 Q 80 155 115 118 Q 80 142 50 125 Z"
                    fill="#FDE047"
                    stroke="#CA8A04"
                    strokeWidth="2"
                  />
                  <rect x="114" y="116" width="5" height="4" fill="#65A30D" rx="1" />
                  <path d="M 48 126 L 46 128" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="62" cy="136" r="7" fill="#111" />
                  <circle cx="98" cy="134" r="7" fill="#111" />
                </g>
              ) : currentAnim === "gift" ? (
                <g>
                  <rect x="60" y="128" width="40" height="30" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
                  <rect x="76" y="128" width="8" height="30" fill="url(#rakhiGold)" />
                  <rect x="60" y="139" width="40" height="8" fill="url(#rakhiGold)" />
                  <circle cx="80" cy="128" r="5" fill="#FEF08A" />
                  <circle cx="56" cy="142" r="6" fill="#111" />
                  <circle cx="104" cy="142" r="6" fill="#111" />
                </g>
              ) : currentAnim === "ukulele" ? (
                <g>
                  <ellipse cx="78" cy="140" rx="16" ry="20" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
                  <circle cx="78" cy="138" r="6" fill="#451A03" />
                  <rect x="88" y="112" width="6" height="30" fill="#92400E" transform="rotate(35, 88, 112)" />
                  <circle cx="106" cy="126" r="6" fill="#111" />
                  <circle cx="65" cy="138" r="6" fill="#111" />
                </g>
              ) : (
                <g>
                  <path d="M 32 122 Q 18 140 26 155" stroke="#FEE12B" strokeWidth="11" strokeLinecap="round" fill="none" />
                  <circle cx="26" cy="155" r="7.5" fill="#111" />
                  <path d="M 128 122 Q 142 140 134 155" stroke="#FEE12B" strokeWidth="11" strokeLinecap="round" fill="none" />
                  <circle cx="134" cy="155" r="7.5" fill="#111" />
                  <circle cx="133" cy="148" r="3" fill="#DC2626" />
                </g>
              )}

              {/* Shoes */}
              <g id="shoes">
                <rect x="52" y="172" width="16" height="15" fill="#1E3A8A" />
                <path d="M 42 186 L 68 186 Q 68 195 56 195 L 42 195 Z" fill="#111" />
                <rect x="92" y="172" width="16" height="15" fill="#1E3A8A" />
                <path d="M 92 186 L 118 186 L 118 195 Q 104 195 92 195 Z" fill="#111" />
              </g>
            </svg>

            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none -z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(253,224,71,0.2) 0%, transparent 70%)",
                transform: "translateZ(-25px) scale(1.3)",
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1.1, 1.35, 1.1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Ground Shadow */}
      <motion.div
        className="pointer-events-none z-0"
        style={{
          width: size * 0.55,
          height: 6,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.22)",
          filter: "blur(3px)",
          marginTop: 2,
        }}
        animate={{
          scaleX:
            currentAnim === "jump"
              ? [1, 0.2, 1.4, 1]
              : currentAnim === "dance"
                ? [0.7, 1.3, 0.7]
                : [1, 1.12, 1],
          opacity: currentAnim === "jump" ? [0.25, 0.05, 0.35, 0.25] : [0.3, 0.18, 0.3],
        }}
        transition={{
          duration: currentAnim === "jump" ? 0.6 : currentAnim === "dance" ? 0.35 : 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
