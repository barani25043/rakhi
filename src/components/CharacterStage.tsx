import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShinchanAnimation from "./ShinchanAnimation";
import type { ShinchanAnimationType, ShinchanCostumeType } from "./ShinchanAnimation";
import MinionAnimation from "./MinionAnimation";
import type { MinionAnimationType, MinionCharacterType } from "./MinionAnimation";

interface CharacterStageProps {
  size?: number;
  className?: string;
  shinchanAnim?: ShinchanAnimationType;
  shinchanCostume?: ShinchanCostumeType;
  shinchanSpeech?: string;
  sideMinions?: "both" | "left" | "right" | "single" | "none";
  minionLeftAnim?: MinionAnimationType;
  minionLeftChar?: MinionCharacterType;
  minionLeftSpeech?: string;
  minionRightAnim?: MinionAnimationType;
  minionRightChar?: MinionCharacterType;
  minionRightSpeech?: string;
  showMinionSpeech?: boolean;
  compact?: boolean;
  onShinchanClick?: () => void;
  onMinionClick?: () => void;
}

export default function CharacterStage({
  size = 130,
  className = "",
  shinchanAnim = "idle",
  shinchanCostume,
  shinchanSpeech,
  sideMinions = "both",
  minionLeftAnim = "wave",
  minionLeftChar = "bob",
  minionLeftSpeech = "Bello Akka! 🍌",
  minionRightAnim = "ukulele",
  minionRightChar = "stuart",
  minionRightSpeech = "Tulaliloo! 🎶",
  showMinionSpeech = false,
  compact = false,
  onShinchanClick,
  onMinionClick,
}: CharacterStageProps) {
  const [partyActive, setPartyActive] = useState(false);
  const [burstIcons, setBurstIcons] = useState<
    Array<{ id: number; icon: string; x: number; y: number }>
  >([]);

  const handleStageCelebration = () => {
    setPartyActive(true);
    const icons = ["🍌", "🍫", "❤️", "🪢", "⭐", "🎉", "🟡", "⚡"];
    const newIcons = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 100,
    }));
    setBurstIcons(newIcons);

    setTimeout(() => {
      setPartyActive(false);
      setBurstIcons([]);
    }, 2200);

    if (onShinchanClick) onShinchanClick();
  };

  const showLeft = sideMinions === "both" || sideMinions === "left" || sideMinions === "single";
  const showRight = sideMinions === "both" || sideMinions === "right";

  const minionSize = compact
    ? Math.max(55, Math.round(size * 0.45))
    : Math.max(65, Math.round(size * 0.5));

  return (
    <div
      className={`relative flex flex-col items-center select-none ${className}`}
      onClick={handleStageCelebration}
    >
      {/* Speech bubble ABOVE the characters, in normal document flow */}
      {shinchanSpeech && (
        <motion.div
          className="mb-1 px-3.5 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-md border border-pink-200 pointer-events-none flex items-center gap-1.5 whitespace-nowrap z-20"
          initial={{ opacity: 0, y: 6, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <span className="text-xs">🖍️</span>
          <p className="font-hand text-xs font-bold text-rose-600">{shinchanSpeech}</p>
        </motion.div>
      )}

      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232,69,107,0.12) 0%, rgba(254,225,43,0.08) 45%, transparent 70%)",
          transform: "scale(1.3)",
        }}
      />

      {/* Burst Particles */}
      <AnimatePresence>
        {burstIcons.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-xl pointer-events-none z-40 select-none"
            style={{ left: "50%", top: "50%" }}
            initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.5, 1.3, 0.7],
              x: p.x,
              y: p.y,
              rotate: [0, Math.random() > 0.5 ? 180 : -180],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {p.icon}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Character Row */}
      <div className="flex items-end justify-center gap-1 relative z-10">
        {/* Left Minion */}
        {showLeft && (
          <motion.div
            className="relative cursor-pointer"
            animate={
              partyActive
                ? { y: [0, -10, 0], rotate: [-3, 5, -3] }
                : { y: [0, -3, 0] }
            }
            transition={{
              duration: partyActive ? 0.5 : 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onMinionClick) onMinionClick();
            }}
          >
            <MinionAnimation
              animation={partyActive ? "dance" : minionLeftAnim}
              character={minionLeftChar}
              size={minionSize}
              showSpeechBubble={false}
              speechText={minionLeftSpeech}
              interactive={true}
            />
          </motion.div>
        )}

        {/* Shinchan Center */}
        <motion.div
          className="relative z-20 cursor-pointer"
          animate={
            partyActive
              ? { y: [0, -14, 0], rotate: [0, -5, 5, 0], scale: [1, 1.04, 1] }
              : {}
          }
          transition={{
            duration: partyActive ? 0.5 : 2,
            repeat: partyActive ? Infinity : 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onShinchanClick) onShinchanClick();
          }}
        >
          <ShinchanAnimation
            animation={partyActive ? "dance" : shinchanAnim}
            costume={shinchanCostume}
            size={size}
            showSpeechBubble={false}
            interactive={true}
          />
        </motion.div>

        {/* Right Minion */}
        {showRight && (
          <motion.div
            className="relative cursor-pointer"
            animate={
              partyActive
                ? { y: [0, -12, 0], rotate: [3, -5, 3] }
                : { y: [0, -4, 0] }
            }
            transition={{
              duration: partyActive ? 0.5 : 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.15,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onMinionClick) onMinionClick();
            }}
          >
            <MinionAnimation
              animation={partyActive ? "banana" : minionRightAnim}
              character={minionRightChar}
              size={minionSize}
              showSpeechBubble={false}
              speechText={minionRightSpeech}
              interactive={true}
            />
          </motion.div>
        )}
      </div>

      {/* Minion speech below characters — only on tap or when enabled */}
      {(showMinionSpeech || partyActive) && (showLeft || showRight) && (
        <motion.div
          className="mt-1 flex gap-2 items-center justify-center"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
        >
          {showLeft && (
            <span className="px-2 py-0.5 bg-yellow-400/90 text-gray-900 rounded-full text-[10px] font-hand font-bold whitespace-nowrap shadow-sm border border-yellow-500">
              🍌 {minionLeftSpeech}
            </span>
          )}
          {showRight && (
            <span className="px-2 py-0.5 bg-yellow-400/90 text-gray-900 rounded-full text-[10px] font-hand font-bold whitespace-nowrap shadow-sm border border-yellow-500">
              🎶 {minionRightSpeech}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
