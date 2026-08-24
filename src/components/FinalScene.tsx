import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Heart } from "lucide-react";
import FloatingHearts from "./FloatingHearts";
import ShinchanAnimation from "./ShinchanAnimation";
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
    if (newClicks >= 5) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 2000);
      setHeartClicks(0);
    }
  };

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden cursor-sparkle"
      style={{
        background:
          "linear-gradient(160deg, #4A1119 0%, #8B2252 30%, #C41E3A 50%, #E8456B 70%, #FF6B8A 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <FloatingHearts count={15} color="#FFD6E0" />

      {/* Floating rakhis */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${10 + i * 18}%`,
            bottom: -30,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            delay: i * 1.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          🪢
        </motion.div>
      ))}

      {/* Heart burst */}
      {heartBurst && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 text-2xl"
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5, 0],
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
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
      <div className="absolute top-10 left-6 text-3xl animate-diya">🪔</div>
      <div className="absolute top-8 right-8 text-2xl animate-diya" style={{ animationDelay: "0.5s" }}>🪔</div>

      {/* Main content */}
      <motion.div
        className="text-center z-10 px-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Rakhi */}
        <motion.div
          className="text-5xl mb-6"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🪢
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-white text-3xl sm:text-4xl mb-6 leading-snug"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {cardData.finalTitle.replace("[SISTER_NAME]", cardData.sisterName).replace(
            cardData.sisterName,
            ""
          )}
          <br />
          <span className="font-hand text-gold-light text-4xl sm:text-5xl">
            {cardData.sisterName}
          </span>{" "}
          ❤️
        </motion.h1>

        {/* Message */}
        <motion.p
          className="font-hand text-white/90 text-xl sm:text-2xl leading-relaxed mb-6 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
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
          className="font-display text-gold-light text-2xl sm:text-3xl italic"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.2)" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          {cardData.finalSignoff}
        </motion.p>

        {/* Heart button (easter egg) */}
        <motion.button
          className="mt-6 text-4xl select-none"
          onClick={handleHeartClick}
          whileTap={{ scale: 1.3 }}
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-label="Love heart"
        >
          <Heart size={36} fill="#FFD6E0" className="text-pink-soft" />
        </motion.button>
      </motion.div>

      {/* Shinchan at bottom */}
      <motion.div
        className="mt-6 z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <ShinchanAnimation
          animation="happy"
          size={180}
          speechText="Love you Didi! ❤️"
        />
      </motion.div>

      {/* Replay button */}
      <motion.button
        className="absolute bottom-6 z-20 flex items-center gap-2 px-6 py-2.5
          bg-white/15 backdrop-blur-md text-white/80 rounded-full
          text-sm font-medium border border-white/20
          hover:bg-white/25 transition-colors select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReplay}
      >
        <RotateCcw size={16} />
        Replay the surprise
      </motion.button>

      {/* Hindi text decoration */}
      <motion.div
        className="absolute bottom-2 text-white/10 text-[10px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        रक्षाबंधन की शुभकामनाएँ ❤️
      </motion.div>
    </motion.div>
  );
}
