import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ShinchanAnimationType =
  | "idle"
  | "wave"
  | "walk"
  | "happy"
  | "cry"
  | "jump"
  | "gift"
  | "peek"
  | "dance";

interface ShinchanAnimationProps {
  animation: ShinchanAnimationType;
  size?: number;
  className?: string;
  onClick?: () => void;
  showSpeechBubble?: boolean;
  speechText?: string;
}

const ASSET_MAP: Record<string, string> = {
  idle: "/assets/shinchan/idle.png",
  wave: "/assets/shinchan/wave.png",
  walk: "/assets/shinchan/idle.png",
  happy: "/assets/shinchan/happy.png",
  cry: "/assets/shinchan/crying.png",
  jump: "/assets/shinchan/jump.png",
  gift: "/assets/shinchan/gift.png",
  peek: "/assets/shinchan/idle.png",
  dance: "/assets/shinchan/dance.png",
};

const DEFAULT_SPEECH: Record<string, string> = {
  idle: "Hehehe! 🤪",
  wave: "Heyyy Didi! 👋",
  happy: "YAAAAAY!! 🎉",
  cry: "Don't say no! 😭",
  jump: "BOINGGG!! 🚀",
  gift: "Special gift for you! 🎁",
  dance: "Buri Buri Dance! 💃",
  peek: "Peek-a-boo! 👀",
  walk: "Walking around~ 🎶",
};

// 3D motion keyframe configs per animation state
// Each has rotateX, rotateY, rotateZ for 3D tilt + standard translate/scale
const animation3DConfigs: Record<
  string,
  {
    container: object; // applied to the 3D perspective wrapper
    inner: object; // applied to the image div (standard transforms)
  }
> = {
  idle: {
    container: {
      rotateX: [0, 8, 0, -4, 0],
      rotateY: [0, -6, 0, 6, 0],
      rotateZ: [0, 2, -2, 1, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -6, 0, -4, 0],
      scaleX: [1, 1.02, 0.99, 1.01, 1],
      scaleY: [1, 0.99, 1.02, 0.99, 1],
      transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
    },
  },
  wave: {
    container: {
      rotateX: [0, 5, -5, 5, 0],
      rotateY: [0, -15, 15, -15, 10, 0],
      rotateZ: [0, -8, 8, -8, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -10, 0, -6, 0],
      scaleX: [1, 1.06, 0.96, 1.04, 1],
      scaleY: [1, 0.95, 1.05, 0.97, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  dance: {
    container: {
      rotateX: [10, -10, 10, -10, 0],
      rotateY: [-20, 20, -20, 20, 0],
      rotateZ: [-12, 12, -12, 12, 0],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      x: [-12, 12, -12, 12, 0],
      y: [0, -18, 0, -18, 0],
      scaleX: [0.92, 1.12, 0.92, 1.12, 1],
      scaleY: [1.12, 0.88, 1.12, 0.88, 1],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    },
  },
  walk: {
    container: {
      rotateY: [-8, 8, -8, 8],
      rotateZ: [-4, 4, -4, 4],
      transition: {
        rotateY: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
        rotateZ: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
      },
    },
    inner: {
      x: [-100, 100],
      y: [0, -10, 0, -10, 0],
      scaleY: [1, 1.04, 0.96, 1.04, 1],
      transition: {
        x: { duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" as const },
        y: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
        scaleY: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
      },
    },
  },
  happy: {
    container: {
      rotateX: [0, 15, -10, 15, 0],
      rotateY: [0, -12, 12, -12, 0],
      rotateZ: [0, -8, 8, -8, 0],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    },
    inner: {
      y: [0, -20, 0, -12, 0],
      scaleX: [1, 1.18, 0.88, 1.12, 1],
      scaleY: [1, 0.82, 1.18, 0.88, 1],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    },
  },
  cry: {
    container: {
      rotateX: [0, 5, 0, 5, 0],
      rotateY: [-3, 3, -3, 3, 0],
      rotateZ: [-2, 2, -2, 2, 0],
      transition: { duration: 0.3, repeat: Infinity },
    },
    inner: {
      x: [-5, 5, -5, 5, 0],
      y: [0, 3, 0, 3, 0],
      scaleY: [1, 0.94, 1.03, 0.94, 1],
      transition: {
        x: { duration: 0.15, repeat: Infinity },
        y: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
        scaleY: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
      },
    },
  },
  jump: {
    container: {
      rotateX: [0, -20, 15, 0],
      rotateY: [0, 10, -10, 0],
      rotateZ: [0, 10, -10, 0],
      transition: { duration: 0.65, repeat: Infinity, ease: "easeOut" },
    },
    inner: {
      y: [0, -55, 0],
      scaleX: [1, 0.82, 1.18, 0.92, 1],
      scaleY: [1, 1.22, 0.78, 1.08, 1],
      transition: { duration: 0.65, repeat: Infinity, ease: "easeOut" },
    },
  },
  gift: {
    container: {
      rotateY: [15, 0, -3, 3, 0],
      rotateX: [5, 0],
      transition: {
        rotateY: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        rotateX: { duration: 0.7, ease: "easeOut" },
      },
    },
    inner: {
      x: [40, 0],
      y: [0, -8, 0],
      scale: [0.85, 1.04, 1],
      transition: {
        x: { duration: 0.7, ease: "easeOut" },
        y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
        scale: { duration: 0.7, ease: "easeOut" },
      },
    },
  },
  peek: {
    container: {
      rotateX: [25, 0, -5, 0],
      rotateY: [-20, 0],
      transition: { duration: 0.8, ease: "backOut" },
    },
    inner: {
      y: [60, 0, -8, 0],
      scale: [0.6, 1.08, 0.96, 1],
      transition: { duration: 0.8, ease: "backOut" },
    },
  },
};

export default function ShinchanAnimation({
  animation,
  size = 130,
  className = "",
  onClick,
  showSpeechBubble = true,
  speechText,
}: ShinchanAnimationProps) {
  const [activeCombo, setActiveCombo] = useState<ShinchanAnimationType | null>(null);

  const currentAnim = activeCombo || animation;
  const imgSrc = ASSET_MAP[currentAnim] || ASSET_MAP.idle;
  const config = animation3DConfigs[currentAnim] || animation3DConfigs.idle;
  const speech = speechText || DEFAULT_SPEECH[currentAnim] || "Hehehe! ❤️";

  const handleTap = () => {
    if (!activeCombo) {
      setActiveCombo("dance");
      setTimeout(() => setActiveCombo("jump"), 900);
      setTimeout(() => setActiveCombo("happy"), 1800);
      setTimeout(() => setActiveCombo(null), 2700);
    }
    if (onClick) onClick();
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {showSpeechBubble && (
          <motion.div
            key={currentAnim + speech}
            className="absolute -top-16 sm:-top-20 z-30 px-3.5 py-1.5 bg-white/95 rounded-full shadow-lg border border-pink-200 pointer-events-none"
            initial={{ opacity: 0, y: 10, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.7 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <p className="font-hand text-xs sm:text-sm font-bold text-rose-600 whitespace-nowrap">
              {speech}
            </p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-white/95" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed lines for high-energy animations */}
      {(currentAnim === "dance" || currentAnim === "jump" || currentAnim === "happy") && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"
              style={{ transform: `rotate(${i * 22.5}deg)` }}
            />
          ))}
        </motion.div>
      )}

      {/* 3D Perspective Container */}
      <div
        style={{
          perspective: 600,
          perspectiveOrigin: "50% 50%",
          width: size,
          height: size,
        }}
      >
        {/* 3D Rotation Layer — rotateX/Y/Z for tilt depth */}
        <motion.div
          className="w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          animate={config.container}
        >
          {/* Inner transform layer — translate, scale, squash & stretch */}
          <motion.div
            className="relative w-full h-full select-none cursor-pointer z-10"
            style={{ transformStyle: "preserve-3d" }}
            animate={config.inner}
            onClick={handleTap}
            whileHover={{ scale: 1.1, rotateY: 10, rotateX: -5 }}
            whileTap={{ scale: 0.88, rotateX: 15 }}
          >
            {/* The character image — transparent PNG, no mix-blend needed */}
            <img
              src={imgSrc}
              alt={`Shinchan ${currentAnim}`}
              className="w-full h-full object-contain transition-all duration-200"
              style={{
                filter: "drop-shadow(4px 6px 8px rgba(0,0,0,0.25))",
                backfaceVisibility: "hidden",
              }}
              draggable={false}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent && !parent.querySelector(".emoji-fallback")) {
                  const fallback = document.createElement("div");
                  fallback.className =
                    "emoji-fallback w-full h-full flex items-center justify-center text-6xl";
                  fallback.textContent =
                    currentAnim === "cry"
                      ? "😭"
                      : currentAnim === "dance"
                        ? "💃"
                        : currentAnim === "happy" || currentAnim === "jump"
                          ? "🥳"
                          : currentAnim === "gift"
                            ? "🎁"
                            : "👋";
                  parent.appendChild(fallback);
                }
              }}
            />

            {/* 3D-positioned depth glow behind character */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none -z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(232,69,107,0.15) 0%, transparent 70%)",
                transform: "translateZ(-20px) scale(1.2)",
              }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1.1, 1.3, 1.1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Motion particles */}
            {currentAnim === "cry" && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-sm select-none pointer-events-none"
                    style={{
                      left: `${20 + (i % 3) * 25}%`,
                      top: "32%",
                      transform: "translateZ(10px)",
                    }}
                    animate={{
                      y: [0, 50],
                      x: [0, i % 2 === 0 ? 10 : -10],
                      opacity: [1, 0],
                      scale: [0.8, 1.3, 0],
                    }}
                    transition={{
                      duration: 0.65,
                      delay: i * 0.12,
                      repeat: Infinity,
                      ease: "easeIn",
                    }}
                  >
                    💧
                  </motion.div>
                ))}
              </>
            )}

            {(currentAnim === "dance" ||
              currentAnim === "happy" ||
              currentAnim === "gift") && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-base select-none pointer-events-none"
                    style={{
                      right: `${-15 + i * 18}%`,
                      top: "0%",
                      transform: `translateZ(${15 + i * 5}px)`,
                    }}
                    animate={{
                      y: [0, -35],
                      x: [0, i % 2 === 0 ? 15 : -15],
                      opacity: [1, 0],
                      scale: [0.5, 1.2, 0.4],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.25,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  >
                    {i % 3 === 0 ? "❤️" : i % 3 === 1 ? "✨" : "🎶"}
                  </motion.div>
                ))}
              </>
            )}

            {(currentAnim === "jump" || currentAnim === "wave") && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-xs select-none pointer-events-none"
                    style={{
                      left: `${5 + i * 30}%`,
                      top: `${-15 + (i % 2) * 25}%`,
                      transform: `translateZ(${20 + i * 3}px)`,
                    }}
                    animate={{
                      scale: [0, 1.4, 0],
                      rotate: [0, 180],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.9,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* 3D-responsive ground shadow — gets wider/narrower as character tilts */}
      <motion.div
        className="pointer-events-none z-0"
        style={{
          width: size * 0.5,
          height: 6,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.18)",
          filter: "blur(3px)",
          marginTop: 4,
        }}
        animate={{
          scaleX:
            currentAnim === "jump"
              ? [1, 0.25, 1.4, 1]
              : currentAnim === "dance"
                ? [0.7, 1.4, 0.7]
                : currentAnim === "happy"
                  ? [0.8, 1.2, 0.8]
                  : [1, 1.15, 1],
          scaleY:
            currentAnim === "jump"
              ? [1, 0.5, 1.3, 1]
              : [1, 0.8, 1],
          opacity:
            currentAnim === "jump"
              ? [0.25, 0.06, 0.35, 0.25]
              : [0.3, 0.15, 0.3],
        }}
        transition={{
          duration: currentAnim === "jump" ? 0.65 : currentAnim === "dance" ? 0.35 : 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
