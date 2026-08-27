import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Heart } from "lucide-react";
import FloatingHearts from "./FloatingHearts";
import CharacterStage from "./CharacterStage";
import cardData from "../data/cardData";

interface FinalSceneProps {
  onReplay: () => void;
}

export default function FinalScene({ onReplay }: FinalSceneProps) {
  const [heartBurst, setHeartBurst] = useState(false);
  const [heartClicks, setHeartClicks] = useState(0);

  const handleHeartClick = () => {
    const newClicks = heartClicks + 1;
    setHeartClicks(newClicks);
    if (newClicks >= 3) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 2500);
      setHeartClicks(0);
    }
  };

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center gap-2 overflow-hidden cursor-sparkle py-6 px-4"
      style={{
        background:
          "linear-gradient(160deg, #4A1119 0%, #8B2252 30%, #C41E3A 50%, #E8456B 70%, #FF6B8A 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <FloatingHearts count={12} color="#FFD6E0" />

      {/* Twinkling golden stars */}
      {[...Array(16)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-twinkle select-none pointer-events-none"
          style={{
            left: `${3 + ((i * 7) % 94)}%`,
            top: `${2 + ((i * 11) % 96)}%`,
            animationDelay: `${(i * 0.3) % 2.5}s`,
            fontSize: `${6 + (i % 5) * 2}px`,
            color: i % 2 === 0 ? '#F0D68A' : '#FFD6E0',
            opacity: 0.6,
          }}
        >
          {i % 3 === 0 ? '✦' : i % 3 === 1 ? '✧' : '⋆'}
        </div>
      ))}

      {/* Emoji rain — celebration! */}
      {['🎉', '🍌', '🪢', '❤️', '⭐', '✨', '🎊', '🌸'].map((emoji, i) => (
        <div
          key={`rain-${i}`}
          className="absolute animate-emoji-rain select-none pointer-events-none opacity-20"
          style={{
            left: `${5 + i * 12}%`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${3 + (i % 4) * 1.2}s`,
            fontSize: `${14 + (i % 3) * 4}px`,
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Floating Rakhis */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{ left: `${8 + ((i * 18) % 84)}%`, bottom: -30 }}
          animate={{ y: [0, -window.innerHeight - 100], rotate: [0, 360] }}
          transition={{ duration: 6 + (i % 3), delay: i * 1.2, repeat: Infinity, ease: "easeOut" }}
        >
          🪢
        </motion.div>
      ))}

      {/* Heart burst */}
      {heartBurst && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 text-2xl select-none"
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5, 0],
                x: (Math.random() - 0.5) * 280,
                y: (Math.random() - 0.5) * 280,
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1.5 }}
            >
              ❤️
            </motion.div>
          ))}
        </div>
      )}

      {/* Diyas */}
      <div className="absolute top-8 left-6 text-3xl animate-diya opacity-80 select-none">🪔</div>
      <div className="absolute top-8 right-8 text-2xl animate-diya opacity-80 select-none" style={{ animationDelay: "0.5s" }}>🪔</div>

      {/* Rakhi */}
      <motion.div
        className="text-4xl select-none"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🪢
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-display text-white text-2xl sm:text-3xl font-bold leading-tight text-center z-10"
        style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Happy Raksha Bandhan
        <br />
        <span className="font-hand text-gold-light text-3xl sm:text-4xl font-bold">
          {cardData.sisterName}
        </span>{" "}
        ❤️
      </motion.h1>

      {/* Message */}
      <motion.p
        className="font-hand text-white/95 text-base sm:text-lg leading-relaxed text-center max-w-xs font-bold z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {cardData.finalMessage.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </motion.p>

      {/* Sign-off */}
      <motion.p
        className="font-display text-gold-light text-sm sm:text-base italic font-bold text-center z-10"
        style={{ textShadow: "0 1px 10px rgba(0,0,0,0.2)" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        {cardData.finalSignoff}
      </motion.p>

      {/* Interactive Heart */}
      <motion.button
        className="text-3xl select-none cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors z-10"
        onClick={handleHeartClick}
        whileTap={{ scale: 1.3 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Love heart"
      >
        <Heart size={28} fill="#FFD6E0" className="text-pink-soft" />
      </motion.button>

      {/* Character Stage */}
      <motion.div
        className="z-10"
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <CharacterStage
          size={120}
          shinchanAnim="heart_love"
          shinchanSpeech="Love you always Akka! ❤️"
          sideMinions="both"
          minionLeftAnim="happy"
          minionLeftChar="bob"
          minionRightAnim="cheer"
          minionRightChar="stuart"
          compact
        />
      </motion.div>

      {/* Replay button — well above bottom edge */}
      <motion.div
        className="mb-8 z-30 shrink-0"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        <motion.button
          className="flex items-center gap-2 px-7 py-3
            bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full
            text-sm font-bold border border-white/40 cursor-pointer
            transition-all select-none shadow-xl"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReplay}
        >
          <RotateCcw size={16} className="text-pink-soft" />
          Replay the surprise ↺
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
