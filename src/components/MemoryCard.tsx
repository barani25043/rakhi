import { motion } from "framer-motion";
import type { MemoryItem } from "../data/cardData";

interface MemoryCardProps {
  memory: MemoryItem;
  index: number;
  onClick: () => void;
}

export default function MemoryCard({ memory, index, onClick }: MemoryCardProps) {
  return (
    <motion.div
      className="relative flex-shrink-0 cursor-pointer group"
      style={{ rotate: `${memory.rotation}deg` }}
      initial={{ opacity: 0, y: 40, rotate: memory.rotation - 10 }}
      animate={{ opacity: 1, y: 0, rotate: memory.rotation }}
      transition={{
        delay: 0.3 + index * 0.15,
        duration: 0.6,
        type: "spring",
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        y: -8,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Wooden clip */}
      <div className="wooden-clip" />

      {/* Clothesline string to clip */}
      <div
        className="absolute -top-[20px] left-1/2 w-[2px] h-[20px]"
        style={{
          background: "linear-gradient(to bottom, #B8922E, #D4A853)",
        }}
      />

      {/* Photo with white border */}
      <div className="scrapbook-photo bg-white">
        <div className="w-36 h-44 sm:w-40 sm:h-48 overflow-hidden rounded-sm">
          <img
            src={memory.image}
            alt={memory.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Caption */}
        <motion.p
          className="font-hand text-center text-gray-600 text-base mt-2 px-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + index * 0.15 }}
        >
          {memory.caption}
        </motion.p>
      </div>

      {/* Decorative sticker */}
      <motion.div
        className="absolute -bottom-2 -right-2 text-lg"
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: index * 0.5,
        }}
      >
        {index % 3 === 0 ? "⭐" : index % 3 === 1 ? "💕" : "✨"}
      </motion.div>
    </motion.div>
  );
}
