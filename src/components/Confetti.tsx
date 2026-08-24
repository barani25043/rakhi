import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  shape: "circle" | "rect" | "star";
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

const COLORS = [
  "#E8456B",
  "#D4A853",
  "#FF9933",
  "#C41E3A",
  "#FFD6E0",
  "#FF6B8A",
  "#F0D68A",
  "#8B2252",
];

const SHAPES: Array<"circle" | "rect" | "star"> = ["circle", "rect", "star"];

export default function Confetti({
  active,
  duration = 4000,
  particleCount = 60,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    }));
  }, [particleCount]);

  useEffect(() => {
    if (active) {
      setParticles(generateParticles());
      const timer = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active, duration, generateParticles]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.shape === "rect" ? p.size * 0.6 : p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "star" ? "2px" : "1px",
            }}
            initial={{
              y: -20,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              y: window.innerHeight + 50,
              opacity: [1, 1, 0.8, 0],
              rotate: p.rotation + (Math.random() > 0.5 ? 720 : -720),
              x: [0, Math.sin(p.id) * 60, Math.cos(p.id) * 40, Math.sin(p.id) * 30],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5 + Math.random() * 2,
              delay: Math.random() * 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
