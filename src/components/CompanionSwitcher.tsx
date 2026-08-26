import { motion } from "framer-motion";
import { useCompanion } from "../hooks/useCompanion";
import type { CompanionMode } from "../hooks/useCompanion";

const OPTIONS: Array<{ id: CompanionMode; label: string; icon: string }> = [
  { id: "shinchan", label: "Shinchan", icon: "🖍️" },
  { id: "duo", label: "Duo Party", icon: "👯‍♂️" },
  { id: "minions", label: "Minions", icon: "🍌" },
];

export default function CompanionSwitcher() {
  const { companion, setCompanion } = useCompanion();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.div
        className="flex items-center gap-1 p-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {OPTIONS.map((opt) => {
          const isActive = companion === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setCompanion(opt.id)}
              className={`relative px-3 py-1.5 rounded-full text-xs font-semibold select-none transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCompanionBg"
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="text-sm">{opt.icon}</span>
              <span className="hidden sm:inline font-hand text-sm">{opt.label}</span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
