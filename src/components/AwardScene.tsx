import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import CharacterStage from "./CharacterStage";
import Confetti from "./Confetti";
import cardData from "../data/cardData";

interface AwardSceneProps {
  onNext: () => void;
}

export default function AwardScene({ onNext }: AwardSceneProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowConfetti(true), 500);
    const t2 = setTimeout(() => setShowDetails(true), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden no-scrollbar px-4 py-4"
      style={{
        background:
          "linear-gradient(160deg, #1a0a10 0%, #2D1018 30%, #3D1520 50%, #4A1119 70%, #1a0a10 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Confetti active={showConfetti} duration={6000} particleCount={80} />

      {/* Diyas with glow */}
      <div className="absolute top-6 left-5 text-2xl animate-diya opacity-80 select-none">🪔</div>
      <div className="absolute top-8 right-6 text-xl animate-diya opacity-70 select-none" style={{ animationDelay: "0.6s" }}>🪔</div>
      <div className="absolute bottom-24 left-4 text-lg animate-diya opacity-50 select-none" style={{ animationDelay: "1.2s" }}>🪔</div>
      <div className="absolute bottom-20 right-5 text-xl animate-diya opacity-60 select-none" style={{ animationDelay: "0.8s" }}>🪔</div>

      {/* Twinkling golden stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-twinkle select-none pointer-events-none"
          style={{
            left: `${4 + ((i * 9) % 92)}%`,
            top: `${3 + ((i * 11) % 94)}%`,
            animationDelay: `${(i * 0.4) % 3}s`,
            fontSize: `${7 + (i % 4) * 2}px`,
            color: '#F0D68A',
            opacity: 0.5,
          }}
        >
          {i % 2 === 0 ? '✦' : '✧'}
        </div>
      ))}

      {/* Emoji rain — celebratory */}
      {['🏆', '⭐', '✨', '🎉', '🍌', '🪢', '👑'].map((emoji, i) => (
        <div
          key={`rain-${i}`}
          className="absolute animate-emoji-rain select-none pointer-events-none opacity-15"
          style={{
            left: `${8 + i * 12}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${3.5 + (i % 3) * 1.5}s`,
            fontSize: `${12 + (i % 3) * 3}px`,
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Gold particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gold pointer-events-none"
          style={{
            left: `${8 + ((i * 11) % 84)}%`,
            top: `${8 + ((i * 13) % 84)}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -20] }}
          transition={{ duration: 2.2, delay: (i * 0.25) % 3, repeat: Infinity }}
        />
      ))}

      {/* Certificate */}
      <motion.div
        className="relative w-[94%] max-w-[390px] mx-auto mt-2 mb-3 z-10 shrink-0"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      >
        <div
          className="certificate-border rounded-2xl p-5 sm:p-6 paper-texture text-center relative shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, #FFFDF9 0%, #FFF8F0 30%, #FFF5E8 60%, #FFFDF9 100%)",
          }}
        >
          {/* Corners */}
          <div className="absolute top-2 left-2 text-gold text-lg opacity-60 select-none">❦</div>
          <div className="absolute top-2 right-2 text-gold text-lg opacity-60 select-none" style={{ transform: "scaleX(-1)" }}>❦</div>
          <div className="absolute bottom-2 left-2 text-gold text-lg opacity-60 select-none" style={{ transform: "scaleY(-1)" }}>❦</div>
          <div className="absolute bottom-2 right-2 text-gold text-lg opacity-60 select-none" style={{ transform: "scale(-1)" }}>❦</div>

          {/* Trophy */}
          <motion.div
            className="text-4xl mb-1 select-none"
            animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            🏆
          </motion.div>

          {/* Title */}
          <motion.h2
            className="font-display text-xl sm:text-2xl text-burgundy mb-2 gold-emboss font-bold"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {cardData.awardTitle}
          </motion.h2>

          {/* Gold line */}
          <motion.div
            className="w-20 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />

          {/* Presentation text */}
          <motion.p
            className="font-body text-gray-500 text-xs italic mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: showDetails ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            {cardData.awardPresentation}
          </motion.p>

          {/* Sister name */}
          <motion.h3
            className="font-hand text-3xl sm:text-4xl text-rose mb-2 font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showDetails ? 1 : 0, scale: showDetails ? 1 : 0.8 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {cardData.sisterName}
          </motion.h3>

          {/* Stars */}
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="text-gold"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{
                  opacity: showDetails ? 1 : 0,
                  scale: showDetails ? 1 : 0,
                  rotate: showDetails ? 0 : -180,
                }}
                transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
              >
                <Star size={18} fill="currentColor" />
              </motion.div>
            ))}
          </div>

          {/* Qualities */}
          <div className="space-y-0.5 mb-2">
            {cardData.awardQualities.map((quality, i) => (
              <motion.p
                key={i}
                className="font-hand text-sm sm:text-base text-gray-700 font-bold"
                initial={{ opacity: 0, x: -12 }}
                animate={{
                  opacity: showDetails ? 1 : 0,
                  x: showDetails ? 0 : -12,
                }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                ✧ {quality}
              </motion.p>
            ))}
          </div>

          {/* Rating */}
          <motion.div
            className="mt-2 pt-2 border-t border-gold/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: showDetails ? 1 : 0 }}
            transition={{ delay: 1.5 }}
          >
            <p className="font-body text-xs text-gray-400 mb-0.5">Rating</p>
            <p className="font-display text-xl sm:text-2xl text-gold-dark font-bold gold-emboss">
              {cardData.awardRating}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Character Stage */}
      <motion.div
        className="my-2 z-10 shrink-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <CharacterStage
          size={120}
          shinchanAnim="action_kamen"
          shinchanSpeech="Action Kamen Akka Award! 🦸‍♂️🏆"
          sideMinions="both"
          minionLeftAnim="cheer"
          minionLeftChar="kevin"
          minionRightAnim="happy"
          minionRightChar="bob"
          compact
        />
      </motion.div>

      {/* Continue button */}
      <div className="pb-12 pt-1 z-20 shrink-0">
        <motion.button
          className="flex items-center gap-2 px-8 py-3
            bg-gradient-to-r from-gold-dark to-gold text-white
            rounded-full font-medium shadow-xl shimmer select-none cursor-pointer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
        >
          One Last Thing ❤️
        </motion.button>
      </div>
    </motion.div>
  );
}
