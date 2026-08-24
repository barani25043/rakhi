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
      className="fixed bottom-5 right-5 z-[100] w-11 h-11 rounded-full
        bg-white/15 backdrop-blur-md border border-white/20
        flex items-center justify-center text-white/80
        hover:bg-white/25 transition-colors shadow-lg"
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      aria-label={isMuted ? "Unmute background music" : "Mute background music"}
    >
      {isMuted ? (
        <VolumeX size={18} />
      ) : (
        <Volume2 size={18} />
      )}
    </motion.button>
  );
}
