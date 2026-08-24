import { useState, useCallback } from "react";
import type { Scene } from "../data/cardData";

const SCENE_ORDER: Scene[] = [
  "intro",
  "character",
  "question",
  "letter",
  "memories",
  "award",
  "final",
];

export function useSceneNavigation() {
  const [scene, setScene] = useState<Scene>("intro");
  const [direction, setDirection] = useState(1);

  const goToScene = useCallback(
    (target: Scene) => {
      const currentIndex = SCENE_ORDER.indexOf(scene);
      const targetIndex = SCENE_ORDER.indexOf(target);
      setDirection(targetIndex > currentIndex ? 1 : -1);
      setScene(target);
    },
    [scene]
  );

  const nextScene = useCallback(() => {
    const currentIndex = SCENE_ORDER.indexOf(scene);
    if (currentIndex < SCENE_ORDER.length - 1) {
      setDirection(1);
      setScene(SCENE_ORDER[currentIndex + 1]);
    }
  }, [scene]);

  const resetToStart = useCallback(() => {
    setDirection(-1);
    setScene("intro");
  }, []);

  const sceneIndex = SCENE_ORDER.indexOf(scene);
  const totalScenes = SCENE_ORDER.length;

  return {
    scene,
    direction,
    sceneIndex,
    totalScenes,
    goToScene,
    nextScene,
    resetToStart,
  };
}
