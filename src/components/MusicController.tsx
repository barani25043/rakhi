import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface MusicControllerProps {
  isMuted: boolean;
  isAvailable: boolean;
  onToggle: () => void;
}

export default function MusicController({
  isMuted,
  isAvailable,
  onToggle,
}: MusicControllerProps) {
  if (!isAvailable) return null;

  return (
    <motion.button
      className={`fixed top-4 right-4 z-[150] px-3.5 py-1.5 rounded-full
        backdrop-blur-md border flex items-center gap-2 shadow-xl
        cursor-pointer select-none transition-all duration-300 ${
          isMuted
            ? "bg-black/60 border-white/20 text-white/70 hover:bg-black/80"
            : "bg-rose-950/70 border-pink-400/40 text-pink-100 hover:bg-rose-900/80 ring-1 ring-pink-500/30"
        }`}
      onClick={onToggle}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      title={isMuted ? "Click to play music" : "Click to mute music"}
    >
      {/* Animated icon / waves */}
      <span className="relative flex items-center justify-center">
        {isMuted ? (
          <VolumeX size={16} className="text-red-300" />
        ) : (
          <Volume2 size={16} className="text-pink-300 animate-pulse" />
        )}
      </span>

      {/* Label */}
      <span className="text-xs font-bold font-body tracking-wider uppercase">
        {isMuted ? "Muted" : "Music ON"}
      </span>

      {/* Visual pulse dot when playing */}
      {!isMuted && (
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
      )}
    </motion.button>
  );
}
