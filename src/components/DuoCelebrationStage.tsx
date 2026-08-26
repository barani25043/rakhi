import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShinchanAnimation from "./ShinchanAnimation";
import type { ShinchanAnimationType } from "./ShinchanAnimation";
import MinionAnimation from "./MinionAnimation";
import type { MinionAnimationType, MinionCharacterType } from "./MinionAnimation";

interface DuoCelebrationStageProps {
  size?: number;
  className?: string;
  shinchanAnim?: ShinchanAnimationType;
  minionAnim?: MinionAnimationType;
  minionChar?: MinionCharacterType;
  shinchanSpeech?: string;
  minionSpeech?: string;
  onTap?: () => void;
}

const DUO_DIALOGUES = [
  {
    shinchan: "Akka look! My bestie came for Rakhi! 🎉",
    minion: "Bello Akka! Tulaliloo ti amo! ❤️",
  },
  {
    shinchan: "He wants your laddoos too Akka! 🟡😋",
    minion: "BANANAAA & LADDOO!! 🍌✨",
  },
  {
    shinchan: "Buri Buri party with Minions for Akka! 💃",
    minion: "Baboi disco dance! 🥳🎶",
  },
  {
    shinchan: "Action Kamen and Minion Bob! 🦸‍♂️",
    minion: "Para tu Akka! Special Rakhi! 🪢",
  },
];

export default function DuoCelebrationStage({
  size = 140,
  className = "",
  shinchanAnim = "dance",
  minionAnim = "dance",
  minionChar = "bob",
  shinchanSpeech,
  minionSpeech,
  onTap,
}: DuoCelebrationStageProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isPartyActive, setIsPartyActive] = useState(false);
  const [burstIcons, setBurstIcons] = useState<
    Array<{ id: number; icon: string; x: number; y: number }>
  >([]);

  const handleStageTap = () => {
    setIsPartyActive(true);
    setDialogueIndex((prev) => (prev + 1) % DUO_DIALOGUES.length);

    const icons = ["🍌", "🍫", "❤️", "🪢", "⭐", "🎉", "🟡", "✨"];
    const newIcons = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 120,
    }));
    setBurstIcons(newIcons);

    setTimeout(() => {
      setIsPartyActive(false);
      setBurstIcons([]);
    }, 2000);

    if (onTap) onTap();
  };

  const activeDuo = DUO_DIALOGUES[dialogueIndex];

  return (
    <div
      className={`relative flex flex-col items-center justify-center cursor-pointer ${className}`}
      onClick={handleStageTap}
    >
      {/* Duo Stage Glow Backdrop */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232,69,107,0.18) 0%, rgba(253,224,71,0.15) 50%, transparent 70%)",
          transform: "scale(1.4)",
        }}
      />

      {/* Floating Burst Particles */}
      <AnimatePresence>
        {burstIcons.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-2xl pointer-events-none z-40 select-none"
            initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.5, 1.4, 0.8],
              x: p.x,
              y: p.y - 50,
              rotate: [0, Math.random() > 0.5 ? 180 : -180],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {p.icon}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Duo Characters Side-by-Side */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 relative z-10">
        <motion.div
          animate={
            isPartyActive
              ? {
                  y: [0, -15, 0],
                  rotate: [0, -8, 8, 0],
                }
              : {}
          }
          transition={{ duration: 0.6, repeat: isPartyActive ? 2 : 0 }}
        >
          <ShinchanAnimation
            animation={isPartyActive ? "dance" : shinchanAnim}
            size={size}
            showSpeechBubble={true}
            speechText={shinchanSpeech || activeDuo.shinchan}
            interactive={false}
          />
        </motion.div>

        <motion.div
          animate={
            isPartyActive
              ? {
                  y: [0, -18, 0],
                  rotate: [0, 8, -8, 0],
                }
              : {}
          }
          transition={{ duration: 0.6, repeat: isPartyActive ? 2 : 0, delay: 0.1 }}
        >
          <MinionAnimation
            animation={isPartyActive ? "banana" : minionAnim}
            character={minionChar}
            size={size * 0.95}
            showSpeechBubble={true}
            speechText={minionSpeech || activeDuo.minion}
            interactive={false}
          />
        </motion.div>
      </div>

      <motion.p
        className="text-[11px] font-hand font-bold text-rose-500/80 mt-1 select-none bg-white/70 px-3 py-0.5 rounded-full border border-pink-200/50 shadow-sm"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✨ Tap stage for Akka's Dance Party! 💃🍌
      </motion.p>
    </div>
  );
}
