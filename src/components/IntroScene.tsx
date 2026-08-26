import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import FloatingHearts from "./FloatingHearts";
import CharacterStage from "./CharacterStage";
import cardData from "../data/cardData";

interface IntroSceneProps {
  onNext: () => void;
  onMusicStart: () => void;
}

export default function IntroScene({ onNext, onMusicStart }: IntroSceneProps) {
  const [showButton, setShowButton] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newParticles = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));
    setParticles(newParticles);
    onMusicStart();
    setTimeout(() => onNext(), 600);
  };

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center gap-3 overflow-hidden cursor-sparkle py-8 px-4"
      style={{
        background:
          "linear-gradient(160deg, #1a0a10 0%, #4A1119 30%, #6B1D2A 50%, #8B2252 70%, #4A1119 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative diyas with wiggle */}
      <div className="absolute top-8 left-6 text-2xl animate-diya opacity-80 select-none">🪔</div>
      <div className="absolute top-10 right-8 text-xl animate-diya opacity-80 select-none" style={{ animationDelay: "0.5s" }}>🪔</div>
      <div className="absolute bottom-16 left-6 text-lg animate-diya opacity-60 select-none" style={{ animationDelay: "1s" }}>🪔</div>
      <div className="absolute bottom-20 right-8 text-2xl animate-diya opacity-70 select-none" style={{ animationDelay: "0.7s" }}>🪔</div>
      <div className="absolute top-1/3 left-3 text-lg animate-diya opacity-50 select-none" style={{ animationDelay: "1.3s" }}>🪔</div>
      <div className="absolute top-1/2 right-4 text-sm animate-diya opacity-40 select-none" style={{ animationDelay: "0.9s" }}>🪔</div>

      {/* Twinkling stars */}
      {[...Array(14)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-twinkle select-none pointer-events-none"
          style={{
            left: `${5 + ((i * 11) % 90)}%`,
            top: `${4 + ((i * 13) % 92)}%`,
            animationDelay: `${(i * 0.35) % 3}s`,
            fontSize: `${8 + (i % 4) * 3}px`,
            color: i % 3 === 0 ? '#F0D68A' : i % 3 === 1 ? '#FFD6E0' : '#E8456B',
            opacity: 0.5,
          }}
        >
          {i % 2 === 0 ? '✦' : '✧'}
        </div>
      ))}

      {/* Emoji rain */}
      {['🍌', '🪢', '✨', '❤️', '⭐', '🎉'].map((emoji, i) => (
        <div
          key={`rain-${i}`}
          className="absolute animate-emoji-rain select-none pointer-events-none text-lg opacity-30"
          style={{
            left: `${10 + i * 14}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3.5 + (i % 3) * 1.5}s`,
          }}
        >
          {emoji}
        </div>
      ))}

      <FloatingHearts count={7} color="#E8456B" />

      {/* Glowing Rakhi */}
      {/* Glowing Rakhi with heartbeat */}
      <motion.div
        className="relative text-5xl select-none animate-heartbeat"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.2, type: "spring" }}
      >
        <span className="relative z-10">🪢</span>
        <div className="absolute inset-0 bg-rose-500/25 rounded-full blur-xl scale-150 animate-glow-pulse" />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-display text-center text-white text-2xl sm:text-3xl leading-snug font-bold"
        style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        IMAGINE receiving this
        <br />
        <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">
          on Raksha Bandhan 🥹❤️
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="font-hand text-gold-light text-lg sm:text-xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        {cardData.introSubtitle}
      </motion.p>

      {/* Character Stage */}
      <motion.div
        className="z-10"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring" }}
      >
        <CharacterStage
          size={130}
          shinchanAnim="rakhi_special"
          shinchanSpeech="Welcome Akka! ✨"
          sideMinions="both"
          minionLeftAnim="wave"
          minionLeftChar="bob"
          minionLeftSpeech="Bello Akka! 🍌"
          minionRightAnim="ukulele"
          minionRightChar="stuart"
          minionRightSpeech="Tulaliloo! 🎶"
          compact
        />
      </motion.div>

      {/* CTA Button */}
      {showButton && (
        <motion.button
          className="relative px-9 py-3.5 bg-gradient-to-r from-rose to-red-rakhi
            text-white font-semibold text-base sm:text-lg rounded-full
            pulse-glow shimmer select-none cursor-pointer shadow-2xl
            active:scale-95 transition-transform z-20"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
            <Sparkles size={20} className="text-yellow-300" />
            {cardData.introButton}
          </span>
        </motion.button>
      )}

      {/* Tamil Footer */}
      <motion.div
        className="absolute bottom-4 flex gap-3 text-white/30 text-xs font-hand font-bold select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <span>அன்பு அக்கா</span>
        <span>•</span>
        <span>❤️</span>
        <span>•</span>
        <span>பாசமுள்ள தம்பி</span>
      </motion.div>

      {/* Click Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none z-50"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: 0,
            scale: 1.2,
            x: (Math.random() - 0.5) * 120,
            y: (Math.random() - 0.5) * 120,
          }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xl">✨</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
