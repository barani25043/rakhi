import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import FloatingHearts from "./FloatingHearts";
import ShinchanAnimation from "./ShinchanAnimation";
import cardData from "../data/cardData";

interface LetterSceneProps {
  onNext: () => void;
}

export default function LetterScene({ onNext }: LetterSceneProps) {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 600);
    const t2 = setTimeout(() => setShowButton(true), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const letterLines = cardData.letter.split("\n");

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden no-scrollbar"
      style={{
        background:
          "linear-gradient(180deg, #FFF0F3 0%, #FFE8D6 30%, #FFF8F0 60%, #FFD6E0 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
    >
      <FloatingHearts count={6} color="#FFB6C1" />

      {/* Decorative flowers */}
      {["🌸", "🌺", "💮", "🌼"].map((flower, i) => (
        <motion.div
          key={i}
          className="absolute text-xl opacity-30"
          style={{
            left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
            right: i % 2 !== 0 ? `${5 + i * 3}%` : undefined,
            top: `${15 + i * 18}%`,
          }}
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -5, 5, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {flower}
        </motion.div>
      ))}

      {/* Shinchan Presenter Host */}
      <motion.div
        className="mt-6 mb-2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ShinchanAnimation
          animation="gift"
          size={170}
          speechText="Read my letter Didi! 📜"
        />
      </motion.div>

      {/* Letter paper */}
      <motion.div
        className="relative w-[90%] max-w-[420px] mt-4 mb-28"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div
          className="bg-warm-paper rounded-lg shadow-xl p-7 sm:p-8 paper-texture animate-unfold"
          style={{
            boxShadow:
              "0 4px 30px rgba(107, 29, 42, 0.1), 0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* Decorative top corner */}
          <div className="absolute top-3 left-3 text-gold/40 text-lg">❧</div>
          <div className="absolute top-3 right-3 text-gold/40 text-lg" style={{ transform: "scaleX(-1)" }}>❧</div>

          {/* Wax seal */}
          <motion.div
            className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 
              bg-gradient-to-br from-red-rakhi to-burgundy rounded-full 
              flex items-center justify-center shadow-lg border-2 border-red-deep"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <span className="text-gold-light text-xl">❤</span>
          </motion.div>

          {/* Header */}
          <motion.h2
            className="font-display text-center text-burgundy text-xl sm:text-2xl mb-6 mt-4 leading-snug"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {cardData.letterHeader}
          </motion.h2>

          {/* Decorative line */}
          <motion.div
            className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: showContent ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          {/* Letter body */}
          <div className="font-hand text-lg sm:text-xl text-gray-700 leading-relaxed space-y-1">
            {letterLines.map((line, i) => (
              <motion.p
                key={i}
                className={line.trim() === "" ? "h-3" : ""}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: showContent ? 1 : 0,
                  x: showContent ? 0 : -10,
                }}
                transition={{
                  delay: 0.5 + i * 0.06,
                  duration: 0.4,
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Signature */}
          <motion.div
            className="mt-8 text-right font-hand text-xl text-rose-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            {cardData.letterSignature.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </motion.div>

          {/* Bottom decorative corner */}
          <div className="absolute bottom-3 left-3 text-gold/40 text-lg" style={{ transform: "scaleY(-1)" }}>❧</div>
          <div className="absolute bottom-3 right-3 text-gold/40 text-lg" style={{ transform: "scale(-1)" }}>❧</div>
        </div>

        {/* Continue button */}
        {showButton && (
          <motion.button
            className="mt-8 mx-auto flex items-center gap-2 px-8 py-3
              bg-gradient-to-r from-burgundy to-maroon text-white
              rounded-full font-medium shadow-lg shimmer select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
          >
            Continue
            <ChevronRight size={18} />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
