import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import ShinchanAnimation from "./ShinchanAnimation";
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
      className="relative w-full h-full flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden no-scrollbar"
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

      {/* Gold particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gold"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -20],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 3,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Stars background */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-gold-light/20"
          style={{
            left: `${5 + i * 16}%`,
            top: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 20, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
          }}
        >
          <Star size={20} fill="currentColor" />
        </motion.div>
      ))}

      {/* Certificate */}
      <motion.div
        className="relative w-[88%] max-w-[380px] mx-auto mt-6 mb-4"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      >
        <div
          className="certificate-border rounded-xl p-6 sm:p-8 paper-texture text-center"
          style={{
            background:
              "linear-gradient(135deg, #FFFDF9 0%, #FFF8F0 30%, #FFF5E8 60%, #FFFDF9 100%)",
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 text-gold text-xl opacity-60">❦</div>
          <div className="absolute top-4 right-4 text-gold text-xl opacity-60" style={{ transform: "scaleX(-1)" }}>❦</div>
          <div className="absolute bottom-4 left-4 text-gold text-xl opacity-60" style={{ transform: "scaleY(-1)" }}>❦</div>
          <div className="absolute bottom-4 right-4 text-gold text-xl opacity-60" style={{ transform: "scale(-1)" }}>❦</div>

          {/* Trophy */}
          <motion.div
            className="text-5xl mb-3"
            animate={{
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1,
            }}
          >
            🏆
          </motion.div>

          {/* Title */}
          <motion.h2
            className="font-display text-2xl sm:text-3xl text-burgundy mb-4 gold-emboss"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {cardData.awardTitle}
          </motion.h2>

          {/* Gold line */}
          <motion.div
            className="w-24 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />

          {/* Presentation text */}
          <motion.p
            className="font-body text-gray-500 text-sm mb-3 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: showDetails ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            {cardData.awardPresentation}
          </motion.p>

          {/* Sister name */}
          <motion.h3
            className="font-hand text-4xl sm:text-5xl text-rose mb-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showDetails ? 1 : 0, scale: showDetails ? 1 : 0.8 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {cardData.sisterName}
          </motion.h3>

          {/* Stars row */}
          <div className="flex justify-center gap-2 mb-4">
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
                <Star size={22} fill="currentColor" />
              </motion.div>
            ))}
          </div>

          {/* Qualities */}
          <div className="space-y-1.5 mb-5">
            {cardData.awardQualities.map((quality, i) => (
              <motion.p
                key={i}
                className="font-hand text-lg text-gray-600"
                initial={{ opacity: 0, x: -15 }}
                animate={{
                  opacity: showDetails ? 1 : 0,
                  x: showDetails ? 0 : -15,
                }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                ✧ {quality}
              </motion.p>
            ))}
          </div>

          {/* Rating */}
          <motion.div
            className="mt-4 pt-3 border-t border-gold/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: showDetails ? 1 : 0 }}
            transition={{ delay: 1.5 }}
          >
            <p className="font-body text-xs text-gray-400 mb-1">Rating</p>
            <p className="font-display text-3xl text-gold-dark font-bold gold-emboss">
              {cardData.awardRating}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Shinchan with trophy presenter */}
      <motion.div
        className="mt-2 my-2 z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <ShinchanAnimation
          animation="gift"
          size={190}
          speechText="Best Sister Ever! 🏆"
        />
      </motion.div>

      {/* Continue button */}
      <motion.button
        className="mt-4 mb-6 flex items-center gap-2 px-8 py-3
          bg-gradient-to-r from-gold-dark to-gold text-white
          rounded-full font-medium shadow-lg shimmer select-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
      >
        One Last Thing ❤️
      </motion.button>
    </motion.div>
  );
}
