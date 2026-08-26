import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import MemoryCard from "./MemoryCard";
import MemoryLightbox from "./MemoryLightbox";
import CharacterStage from "./CharacterStage";
import cardData from "../data/cardData";

interface MemorySceneProps {
  onNext: () => void;
}

export default function MemoryScene({ onNext }: MemorySceneProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <motion.div
      className="relative w-full h-full flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar px-3 py-4"
      style={{
        background:
          "linear-gradient(180deg, #FFF8F0 0%, #FFECD2 30%, #FFE0CC 60%, #FFD6E0 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <div className="pt-3 pb-1 text-center px-4 z-10 shrink-0">

        {/* Floating decorative elements */}
        {['🌸', '🌺', '✨', '🦋', '💮', '🌼', '⭐'].map((item, i) => (
          <motion.div
            key={`deco-${i}`}
            className="absolute select-none pointer-events-none text-lg opacity-25"
            style={{
              left: i % 2 === 0 ? `${3 + i * 5}%` : undefined,
              right: i % 2 !== 0 ? `${3 + i * 5}%` : undefined,
              top: `${5 + i * 13}%`,
            }}
            animate={{
              y: [0, -8, 0, 8, 0],
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1, 0.9, 1],
            }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {item}
          </motion.div>
        ))}
        <motion.h2
          className="font-display text-2xl sm:text-3xl text-burgundy font-bold tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {cardData.memoriesTitle}
        </motion.h2>
        <motion.p
          className="font-hand text-base sm:text-lg text-gray-600 font-bold mt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {cardData.memoriesSubtitle}
        </motion.p>
        <motion.div
          className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-1.5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
      </div>

      {/* Top Shinchan Presenter */}
      <motion.div
        className="flex justify-center py-2 z-10 shrink-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <CharacterStage
          size={110}
          shinchanAnim="mischief"
          shinchanSpeech="Look at our memories Akka! 📸"
          sideMinions="both"
          minionLeftAnim="banana"
          minionLeftChar="bob"
          minionRightAnim="wave"
          minionRightChar="stuart"
          compact
        />
      </motion.div>

      {/* Photos Grid */}
      <div className="relative px-2 pb-3 shrink-0">
        {/* Row 1 */}
        <div className="relative clothesline pt-6 mb-5">
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            {cardData.memories.slice(0, 3).map((memory, index) => (
              <MemoryCard
                key={index}
                memory={memory}
                index={index}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="relative clothesline pt-6 mb-4">
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            {cardData.memories.slice(3, 6).map((memory, index) => (
              <MemoryCard
                key={index + 3}
                memory={memory}
                index={index + 3}
                onClick={() => openLightbox(index + 3)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Presenter */}
      <div className="relative py-1 flex justify-center z-10 shrink-0">
        <CharacterStage
          size={110}
          shinchanAnim="dance"
          shinchanSpeech="Tap photos to enlarge! 🔍"
          sideMinions="both"
          minionLeftAnim="dance"
          minionLeftChar="kevin"
          minionRightAnim="cheer"
          minionRightChar="bob"
          compact
        />
      </div>

      {/* Continue */}
      <div className="flex justify-center pb-16 pt-2 shrink-0">
        <motion.button
          className="flex items-center gap-2 px-8 py-3
            bg-gradient-to-r from-burgundy to-maroon text-white
            rounded-full font-medium shadow-xl shimmer select-none cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Continue
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Lightbox */}
      <MemoryLightbox
        memories={cardData.memories}
        activeIndex={activePhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setActivePhotoIndex}
      />
    </motion.div>
  );
}
