import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingHeartsProps {
  count?: number;
  color?: string;
}

export default function FloatingHearts({
  count = 12,
  color = "#E8456B",
}: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 16,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setHearts(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            bottom: -40,
            fontSize: h.size,
            color,
            opacity: h.opacity,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(h.id) * 30, 0],
            rotate: [0, h.id % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}
