import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import FloatingHearts from "./FloatingHearts";
import CharacterStage from "./CharacterStage";
import cardData from "../data/cardData";

interface LetterSceneProps {
  onNext: () => void;
}

export default function LetterScene({ onNext }: LetterSceneProps) {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 500);
    const t2 = setTimeout(() => setShowButton(true), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const letterLines = cardData.letter.split("\n");

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden no-scrollbar py-4 px-3"
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
      {["🌸", "🌺", "💮", "🌼", "✨"].map((flower, i) => (
        <motion.div
          key={i}
          className="absolute text-lg opacity-25 select-none pointer-events-none"
          style={{
            left: i % 2 === 0 ? `${3 + i * 4}%` : undefined,
            right: i % 2 !== 0 ? `${3 + i * 4}%` : undefined,
            top: `${10 + i * 18}%`,
          }}
          animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {flower}
        </motion.div>
      ))}

      {/* Top Shinchan Presenter */}
      <motion.div
        className="w-full flex justify-center mb-3 z-10 shrink-0"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CharacterStage
          size={110}
          shinchanAnim="pajama"
          shinchanSpeech="Read my letter Akka! 📜❤️"
          sideMinions="both"
          minionLeftAnim="wave"
          minionLeftChar="bob"
          minionRightAnim="ukulele"
          minionRightChar="stuart"
          compact
        />
      </motion.div>

      {/* Letter Parchment Paper */}
      <motion.div
        className="relative w-[94%] max-w-[420px] mb-20 z-20 shrink-0"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div
          className="bg-warm-paper rounded-2xl shadow-2xl p-5 sm:p-7 paper-texture relative border border-amber-100"
          style={{
            boxShadow:
              "0 10px 40px rgba(107, 29, 42, 0.12), 0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          {/* Wax Seal */}
          <motion.div
            className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10
              bg-gradient-to-br from-red-rakhi to-burgundy rounded-full
              flex items-center justify-center shadow-xl border-2 border-red-300 z-30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <span className="text-gold-light text-lg">❤</span>
          </motion.div>

          {/* Corner Ornaments */}
          <div className="absolute top-2 left-2 text-gold/40 text-sm select-none">❧</div>
          <div className="absolute top-2 right-2 text-gold/40 text-sm select-none" style={{ transform: "scaleX(-1)" }}>❧</div>

          {/* Header */}
          <motion.h2
            className="font-display text-center text-burgundy text-lg sm:text-xl mb-3 mt-4 leading-snug font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {cardData.letterHeader}
          </motion.h2>

          {/* Gold Divider */}
          <motion.div
            className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: showContent ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          {/* Letter Body */}
          <div className="font-hand text-base sm:text-lg text-gray-700 leading-relaxed space-y-0.5 font-semibold">
            {letterLines.map((line, i) => (
              <motion.p
                key={i}
                className={line.trim() === "" ? "h-2" : ""}
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: showContent ? 1 : 0,
                  x: showContent ? 0 : -8,
                }}
                transition={{ delay: 0.4 + i * 0.03, duration: 0.3 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Signature */}
          <motion.div
            className="mt-5 text-right font-hand text-lg text-rose-600 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            {cardData.letterSignature.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </motion.div>

          {/* Bottom Corners */}
          <div className="absolute bottom-2 left-2 text-gold/40 text-sm select-none" style={{ transform: "scaleY(-1)" }}>❧</div>
          <div className="absolute bottom-2 right-2 text-gold/40 text-sm select-none" style={{ transform: "scale(-1)" }}>❧</div>
        </div>

        {/* Floating / Sticky Continue button — always visible above page bottom */}
        {showButton && (
          <motion.div
            className="sticky bottom-4 mt-4 flex justify-center z-50 shrink-0"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.button
              className="flex items-center gap-2 px-9 py-3.5
                bg-gradient-to-r from-burgundy via-red-rakhi to-maroon text-white
                rounded-full font-bold text-base shadow-2xl shimmer select-none cursor-pointer
                border border-white/30 backdrop-blur-md"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
            >
              Continue to Memories ❤️
              <ChevronRight size={20} className="text-amber-200" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
