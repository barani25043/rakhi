import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import MemoryCard from "./MemoryCard";
import MemoryLightbox from "./MemoryLightbox";
import ShinchanAnimation from "./ShinchanAnimation";
import cardData from "../data/cardData";

interface MemorySceneProps {
  onNext: () => void;
}

const SHINCHAN_POSITIONS: Array<{
  position: string;
  animation: "peek" | "walk" | "happy" | "gift" | "cry" | "jump";
}> = [
  { position: "bottom-0 left-0", animation: "peek" },
  { position: "bottom-0 left-1/2 -translate-x-1/2", animation: "walk" },
  { position: "bottom-2 right-2", animation: "happy" },
  { position: "bottom-0 left-4", animation: "gift" },
  { position: "bottom-2 right-4", animation: "cry" },
  { position: "bottom-0 left-1/2 -translate-x-1/2", animation: "jump" },
];

export default function MemoryScene({ onNext }: MemorySceneProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <motion.div
      className="relative w-full h-full flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar"
      style={{
        background:
          "linear-gradient(180deg, #FFF8F0 0%, #FFECD2 30%, #FFE0CC 60%, #FFD6E0 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title section */}
      <div className="pt-10 pb-4 text-center px-4">
        <motion.h2
          className="font-display text-3xl text-burgundy mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {cardData.memoriesTitle}
        </motion.h2>
        <motion.p
          className="font-hand text-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {cardData.memoriesSubtitle}
        </motion.p>
      </div>

      {/* Decorative line */}
      <motion.div
        className="w-20 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-2"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />

      {/* Shinchan Presenter Host */}
      <motion.div
        className="flex justify-center my-2 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <ShinchanAnimation
          animation="happy"
          size={170}
          speechText="Look at our memories Didi! 📸"
        />
      </motion.div>

      {/* Clothesline + Photos grid */}
      <div className="relative px-4 pb-6">
        {/* First row of photos (1-3) with clothesline */}
        <div className="relative clothesline pt-8 mb-8">
          <div className="flex justify-center gap-4 flex-wrap">
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

        {/* Second row of photos (4-6) with clothesline */}
        <div className="relative clothesline pt-8 mb-8">
          <div className="flex justify-center gap-4 flex-wrap">
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

      {/* Shinchan presenter at bottom */}
      <div className="relative py-4 flex justify-center z-10">
        <ShinchanAnimation
          animation={SHINCHAN_POSITIONS[activePhotoIndex % SHINCHAN_POSITIONS.length].animation}
          size={180}
          speechText="Tap photos to enlarge! 🔍"
        />
      </div>

      {/* Continue button */}
      <div className="flex justify-center pb-24 pt-2">
        <motion.button
          className="flex items-center gap-2 px-8 py-3
            bg-gradient-to-r from-burgundy to-maroon text-white
            rounded-full font-medium shadow-lg shimmer select-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Continue
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Decorative tape elements */}
      <motion.div
        className="absolute top-20 right-3 text-gold/30 text-2xl rotate-12"
        animate={{ rotate: [12, 15, 12] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        📎
      </motion.div>
      <motion.div
        className="absolute top-48 left-2 text-gold/20 text-xl -rotate-6"
        animate={{ rotate: [-6, -3, -6] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        📌
      </motion.div>

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
