import { motion } from "framer-motion";
import type { MemoryItem } from "../data/cardData";
import { getAssetPath } from "../utils/assets";

interface MemoryCardProps {
  memory: MemoryItem;
  index: number;
  onClick: () => void;
}

const STICKERS = ["🖍️", "🍌", "🪢", "🍫", "❤️", "⭐"];

export default function MemoryCard({ memory, index, onClick }: MemoryCardProps) {
  const sticker = STICKERS[index % STICKERS.length];

  return (
    <motion.div
      className="relative flex-shrink-0 cursor-pointer group select-none"
      style={{ rotate: `${memory.rotation}deg` }}
      initial={{ opacity: 0, y: 40, rotate: memory.rotation - 10 }}
      animate={{ opacity: 1, y: 0, rotate: memory.rotation }}
      transition={{
        delay: 0.3 + index * 0.12,
        duration: 0.6,
        type: "spring",
      }}
      whileHover={{
        scale: 1.06,
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
      <div className="scrapbook-photo bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="w-36 h-44 sm:w-40 sm:h-48 overflow-hidden rounded-sm relative">
          <img
            src={getAssetPath(memory.image)}
            alt={memory.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            draggable={false}
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Caption */}
        <motion.p
          className="font-hand text-center text-gray-700 text-base mt-2 px-1 font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 + index * 0.12 }}
        >
          {memory.caption}
        </motion.p>
      </div>

      {/* Decorative cartoon sticker badge */}
      <motion.div
        className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border border-pink-100 text-lg flex items-center justify-center"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: index * 0.4,
        }}
      >
        {sticker}
      </motion.div>
    </motion.div>
  );
}
