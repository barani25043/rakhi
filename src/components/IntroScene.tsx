import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import FloatingHearts from "./FloatingHearts";
import ShinchanAnimation from "./ShinchanAnimation";
import cardData from "../data/cardData";

interface IntroSceneProps {
  onNext: () => void;
  onMusicStart: () => void;
}

export default function IntroScene({ onNext, onMusicStart }: IntroSceneProps) {
  const [showButton, setShowButton] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Create particle burst at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));
    setParticles(newParticles);

    onMusicStart();

    setTimeout(() => {
      onNext();
    }, 600);
  };

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden cursor-sparkle"
      style={{
        background:
          "linear-gradient(160deg, #1a0a10 0%, #4A1119 30%, #6B1D2A 50%, #8B2252 70%, #4A1119 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative diyas */}
      <div className="absolute top-8 left-8 text-2xl animate-diya opacity-70">🪔</div>
      <div className="absolute top-12 right-10 text-xl animate-diya opacity-60" style={{ animationDelay: "0.5s" }}>🪔</div>
      <div className="absolute bottom-24 left-6 text-lg animate-diya opacity-50" style={{ animationDelay: "1s" }}>🪔</div>
      <div className="absolute bottom-32 right-8 text-2xl animate-diya opacity-60" style={{ animationDelay: "0.7s" }}>🪔</div>

      {/* Sparkle decorations */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-gold-light/40 text-xs"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 3,
            repeat: Infinity,
          }}
        >
          ✦
        </motion.div>
      ))}

      <FloatingHearts count={8} color="#E8456B" />

      {/* Rakhi decorative element */}
      <motion.div
        className="absolute top-[12%] text-5xl"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.3, type: "spring" }}
      >
        🪢
      </motion.div>

      {/* Main title */}
      <motion.h1
        className="font-display text-center text-white text-3xl sm:text-4xl leading-relaxed px-6 mb-4"
        style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {cardData.introTitle.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i === 0 && <br />}
          </span>
        ))}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="font-hand text-gold-light text-2xl mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        {cardData.introSubtitle}
      </motion.p>

      {/* Shinchan Presenter Host */}
      <motion.div
        className="my-2 z-10"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: "spring" }}
      >
        <ShinchanAnimation
          animation="wave"
          size={170}
          speechText="Welcome Didi! ✨"
        />
      </motion.div>

      {/* CTA Button */}
      {showButton && (
        <motion.button
          className="relative px-10 py-4 mt-4 bg-gradient-to-r from-rose to-red-rakhi
            text-white font-semibold text-lg rounded-full
            pulse-glow shimmer select-none z-20
            active:scale-95 transition-transform"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles size={20} />
            {cardData.introButton}
          </span>
        </motion.button>
      )}

      {/* Click particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: 0,
            scale: 1,
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
          }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-lg">✨</span>
        </motion.div>
      ))}

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-8 flex gap-4 text-white/20 text-xs font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span>रक्षाबंधन</span>
        <span>•</span>
        <span>❤️</span>
        <span>•</span>
        <span>राखी</span>
      </motion.div>
    </motion.div>
  );
}
