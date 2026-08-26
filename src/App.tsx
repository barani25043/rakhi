import { AnimatePresence, motion } from "framer-motion";
import { useSceneNavigation } from "./hooks/useSceneNavigation";
import { useBackgroundMusic } from "./hooks/useBackgroundMusic";

import IntroScene from "./components/IntroScene";
import ShinchanScene from "./components/ShinchanScene";
import LetterScene from "./components/LetterScene";
import MemoryScene from "./components/MemoryScene";
import AwardScene from "./components/AwardScene";
import FinalScene from "./components/FinalScene";
import MusicController from "./components/MusicController";
import ProgressIndicator from "./components/ProgressIndicator";

const sceneTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function App() {
  const { scene, sceneIndex, totalScenes, goToScene, resetToStart } =
    useSceneNavigation();

  const music = useBackgroundMusic({
    src: "/assets/audio/bg-music.mp3",
    loop: true,
    volume: 0.25,
    fadeDuration: 1500,
  });

  const handleMusicStart = () => {
    music.play();
  };

  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-[#1a0a10] relative">
      {/* Desktop wrapper — centers card on larger screens */}
      <div className="w-full h-full sm:desktop-wrapper mx-auto relative">
        <AnimatePresence mode="wait">
          {scene === "intro" && (
            <motion.div key="intro" className="w-full h-full" {...sceneTransition}>
              <IntroScene
                onNext={() => goToScene("character")}
                onMusicStart={handleMusicStart}
              />
            </motion.div>
          )}

          {(scene === "character" || scene === "question") && (
            <motion.div key="character" className="w-full h-full" {...sceneTransition}>
              <ShinchanScene onNext={() => goToScene("letter")} />
            </motion.div>
          )}

          {scene === "letter" && (
            <motion.div key="letter" className="w-full h-full" {...sceneTransition}>
              <LetterScene onNext={() => goToScene("memories")} />
            </motion.div>
          )}

          {scene === "memories" && (
            <motion.div key="memories" className="w-full h-full" {...sceneTransition}>
              <MemoryScene onNext={() => goToScene("award")} />
            </motion.div>
          )}

          {scene === "award" && (
            <motion.div key="award" className="w-full h-full" {...sceneTransition}>
              <AwardScene onNext={() => goToScene("final")} />
            </motion.div>
          )}

          {scene === "final" && (
            <motion.div key="final" className="w-full h-full" {...sceneTransition}>
              <FinalScene onReplay={resetToStart} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global overlays */}
        {scene !== "intro" && (
          <ProgressIndicator current={sceneIndex} total={totalScenes} />
        )}
      </div>

      {/* Music controller — outside the card frame */}
      <MusicController
        isMuted={music.isMuted}
        isAvailable={music.isAvailable}
        onToggle={music.toggleMute}
      />
    </div>
  );
}
