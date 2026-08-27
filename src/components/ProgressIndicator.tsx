import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export default function ProgressIndicator({
  current,
  total,
}: ProgressIndicatorProps) {
  return (
    <motion.div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[130] flex items-center gap-2
        bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg pointer-events-none"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 0.85, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center">
          <motion.div
            className="rounded-full transition-all duration-500"
            animate={{
              width: i === current ? 10 : 6,
              height: i === current ? 10 : 6,
              backgroundColor:
                i === current
                  ? "rgba(228, 69, 107, 0.9)"
                  : i < current
                    ? "rgba(212, 168, 83, 0.7)"
                    : "rgba(255, 255, 255, 0.3)",
            }}
          />
          {i < total - 1 && (
            <div
              className="w-4 h-[1px] mx-1"
              style={{
                backgroundColor:
                  i < current
                    ? "rgba(212, 168, 83, 0.5)"
                    : "rgba(255, 255, 255, 0.15)",
              }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}
