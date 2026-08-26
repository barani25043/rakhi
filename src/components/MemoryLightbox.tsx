import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { MemoryItem } from "../data/cardData";

interface MemoryLightboxProps {
  memories: MemoryItem[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function MemoryLightbox({
  memories,
  activeIndex,
  isOpen,
  onClose,
  onNavigate,
}: MemoryLightboxProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const goNext = useCallback(() => {
    if (activeIndex < memories.length - 1) {
      setDirection(1);
      onNavigate(activeIndex + 1);
    }
  }, [activeIndex, memories.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) {
      setDirection(-1);
      onNavigate(activeIndex - 1);
    }
  }, [activeIndex, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, goNext, goPrev, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  if (!isOpen) return null;

  const memory = memories[activeIndex];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Close button */}
          <motion.button
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full
              bg-white/10 backdrop-blur-md flex items-center justify-center
              text-white/80 hover:bg-white/20 transition-colors"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close lightbox"
          >
            <X size={20} />
          </motion.button>

          {/* Memory counter */}
          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-10
              font-hand text-white/60 text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Memory #{activeIndex + 1}
          </motion.div>

          {/* Navigation arrows - desktop */}
          {activeIndex > 0 && (
            <motion.button
              className="absolute left-4 z-10 w-10 h-10 rounded-full
                bg-white/10 backdrop-blur-md flex items-center justify-center
                text-white/80 hover:bg-white/20 transition-colors
                hidden sm:flex"
              onClick={goPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous memory"
            >
              <ChevronLeft size={20} />
            </motion.button>
          )}

          {activeIndex < memories.length - 1 && (
            <motion.button
              className="absolute right-4 z-10 w-10 h-10 rounded-full
                bg-white/10 backdrop-blur-md flex items-center justify-center
                text-white/80 hover:bg-white/20 transition-colors
                hidden sm:flex"
              onClick={goNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next memory"
            >
              <ChevronRight size={20} />
            </motion.button>
          )}

          {/* Photo */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              className="relative z-10 w-[85vw] max-w-[400px] mx-auto"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Photo with frame */}
              <div className="bg-white p-3 rounded-lg shadow-2xl">
                <motion.img
                  src={memory.image}
                  alt={memory.alt}
                  className="w-full h-auto max-h-[60vh] object-cover rounded-sm"
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  draggable={false}
                />
              </div>

              {/* Caption */}
              <motion.p
                className="font-hand text-center text-white text-2xl mt-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {memory.caption}
              </motion.p>

              {/* Swipe hint - mobile */}
              <motion.p
                className="text-center text-white/30 text-xs mt-4 sm:hidden"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ← swipe to navigate →
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
