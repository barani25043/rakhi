import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterStage from "./CharacterStage";
import type { ShinchanAnimationType } from "./ShinchanAnimation";
import type { MinionAnimationType } from "./MinionAnimation";
import Confetti from "./Confetti";
import cardData from "../data/cardData";

interface ShinchanSceneProps {
  onNext: () => void;
}

// Naughty boing sound
function playBoingSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.25);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    /* blocked */
  }
}

// Blast kaboom sound
function playBlastSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);

    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = "triangle";
    chime.frequency.setValueAtTime(587.33, now + 0.1);
    chime.frequency.setValueAtTime(880, now + 0.25);
    chime.frequency.setValueAtTime(1174.66, now + 0.4);
    chimeGain.gain.setValueAtTime(0.3, now + 0.1);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.1);
    chime.stop(now + 0.7);
  } catch {
    /* blocked */
  }
}

// Generate a random position for NO button that avoids overlaying the YES button
function randomNoPosition() {
  // Pick an angle and distance so it never lands directly on the YES button
  const angle = Math.random() * Math.PI * 2;
  const distance = 85 + Math.random() * 70; // 85px to 155px away from center
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * (distance * 0.65), // Keep within vertical bounds of card
    rotate: (Math.random() - 0.5) * 35,
  };
}

// Rocket trail particle
interface TrailParticle {
  id: number;
  x: number;
  y: number;
  icon: string;
}

export default function ShinchanScene({ onNext }: ShinchanSceneProps) {
  const [phase, setPhase] = useState<"greeting" | "question">("greeting");
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0, rotate: 0 });
  const [rocketTrails, setRocketTrails] = useState<TrailParticle[]>([]);
  const [isBlasting, setIsBlasting] = useState(false);
  const [blastParticles, setBlastParticles] = useState<
    Array<{ id: number; icon: string; x: number; y: number; scale: number }>
  >([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [charShinchanAnim, setCharShinchanAnim] =
    useState<ShinchanAnimationType>("mischief");
  const [minionAnim, setMinionAnim] = useState<MinionAnimationType>("wave");
  const [shinchanSpeech, setShinchanSpeech] = useState<string>("Heyyy Akka! 👋");
  const [minionSpeech, setMinionSpeech] = useState<string>("Bello Akka! 🍌");
  const [secretClicks, setSecretClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [naughtyEmoji, setNaughtyEmoji] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCharShinchanAnim("wave");
      setMinionAnim("happy");
      setShinchanSpeech("I made something for you Akka! ❤️");
      setMinionSpeech("Special surprise para tu! 🎁");
    }, 800);
    const t2 = setTimeout(() => {
      setPhase("question");
      setCharShinchanAnim("dance");
      setMinionAnim("dance");
      setShinchanSpeech("Do you wanna see it Akka? 😜");
      setMinionSpeech("Banana party Akka? 🍌✨");
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleYes = () => {
    setCharShinchanAnim("dance");
    setMinionAnim("cheer");
    setShinchanSpeech("YAAAAAY!! Let's go Akka! 🎉");
    setMinionSpeech("BANANAAAA PARTY!! 🥳🎉");
    setShowConfetti(true);
    setTimeout(() => {
      setCharShinchanAnim("jump");
      setMinionAnim("jump");
    }, 600);
    setTimeout(() => onNext(), 1600);
  };

  // Spawn rocket trail particles at the NO button's current position
  const spawnTrails = useCallback(
    (fromX: number, fromY: number) => {
      const trailIcons = ["💨", "✨", "🔥", "⚡", "💫", "🚀"];
      const newTrails = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: fromX + (Math.random() - 0.5) * 30,
        y: fromY + (Math.random() - 0.5) * 30,
        icon: trailIcons[Math.floor(Math.random() * trailIcons.length)],
      }));
      setRocketTrails((prev) => [...prev, ...newTrails]);
      setTimeout(() => {
        setRocketTrails((prev) =>
          prev.filter((t) => !newTrails.find((n) => n.id === t.id))
        );
      }, 800);
    },
    []
  );

  const handleNo = () => {
    if (isBlasting) return;
    const newCount = noCount + 1;
    setNoCount(newCount);

    // Play boing sound on every NO click
    playBoingSound();

    // Always rocket the button to a new random position!
    const oldPos = noPos;
    const newPos = randomNoPosition();
    setNoPos(newPos);

    // Spawn trail particles from old position
    spawnTrails(oldPos.x, oldPos.y);

    // Show a naughty taunt emoji near the button
    const taunts = ["😜", "🤪", "👅", "😝", "🏃‍♂️", "🚀", "💨", "😈", "🐒"];
    setNaughtyEmoji(taunts[Math.floor(Math.random() * taunts.length)]);
    setTimeout(() => setNaughtyEmoji(""), 700);

    if (newCount === 1) {
      setCharShinchanAnim("cry");
      setMinionAnim("idle");
      setShinchanSpeech("Catch the button Akka! 🏃‍♀️");
      setMinionSpeech("Haha it's running! 🍌");
    } else if (newCount === 2) {
      setCharShinchanAnim("mischief");
      setMinionAnim("banana");
      setShinchanSpeech("Hehehe can't catch it! 😜");
      setMinionSpeech("Baboi so naughty! 🤪");
    } else if (newCount === 3) {
      setCharShinchanAnim("dance");
      setMinionAnim("cheer");
      setShinchanSpeech("It's ZOOMING everywhere! 🚀");
      setMinionSpeech("BEE-DO BEE-DO! 🚨");
    } else if (newCount === 4) {
      setCharShinchanAnim("action_kamen");
      setMinionAnim("banana");
      setShinchanSpeech("ONE MORE and it EXPLODES! 💣");
      setMinionSpeech("IT'S GONNA BLOW!! 🍌💣");
    } else if (newCount === 5) {
      setCharShinchanAnim("jump");
      setMinionAnim("cheer");
      setShinchanSpeech("AKKA STOP!! TOO LATE!! 😱");
      setMinionSpeech("RUUUUN!! 🏃‍♂️💨");
    } else {
      triggerButtonBlast();
      return;
    }
  };

  const triggerButtonBlast = () => {
    setIsBlasting(true);
    playBlastSound();

    const icons = ["💥", "💣", "🍌", "❤️", "🪢", "⭐", "🎉", "🟡", "🍫", "✨", "🔥", "🚀"];
    const newBlast = Array.from({ length: 40 }, (_, i) => ({
      id: Date.now() + i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      x: noPos.x + (Math.random() - 0.5) * 400,
      y: noPos.y + (Math.random() - 0.5) * 350,
      scale: 0.6 + Math.random() * 1.8,
    }));
    setBlastParticles(newBlast);
    setShowConfetti(true);

    setCharShinchanAnim("dance");
    setMinionAnim("cheer");
    setShinchanSpeech("BOOOOM!! 💥 Thambi won! 🎉❤️");
    setMinionSpeech("BANANAAAA BLAST!! 🍌🥳");

    setTimeout(() => {
      setCharShinchanAnim("happy");
      setMinionAnim("jump");
    }, 900);

    setTimeout(() => onNext(), 2200);
  };

  const handleCharClick = () => {
    const newClicks = secretClicks + 1;
    setSecretClicks(newClicks);
    setCharShinchanAnim("dance");
    setMinionAnim("dance");
    setShinchanSpeech("Dance party with Akka! 💃");
    setMinionSpeech("Baboi disco party! 🍌🎶");
    if (newClicks >= 5 && !showSecret) {
      setShowSecret(true);
      setCharShinchanAnim("jump");
      setMinionAnim("cheer");
      setShowConfetti(true);
      setTimeout(() => {
        setShowSecret(false);
        setShowConfetti(false);
        setCharShinchanAnim("idle");
        setMinionAnim("idle");
        setShinchanSpeech("Hehehe! 🤪");
        setMinionSpeech("Bello hehe! 🍌");
      }, 3000);
    }
  };

  // Dynamic NO button scale
  const noScale = 1 + noCount * 0.15;
  const noButtonLabels = [
    "NO 🙈",
    "CATCH ME! 🏃‍♂️",
    "TOO SLOW! 😜",
    "ZOOM ZOOM! 🚀",
    "CAN'T STOP! 💨",
    "KABOOM TIME! 💣",
  ];
  const currentNoLabel =
    noButtonLabels[Math.min(noCount, noButtonLabels.length - 1)];

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-4"
      style={{
        background:
          "linear-gradient(180deg, #FFF8F0 0%, #FFE8D6 50%, #FFD6E0 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6 }}
    >
      <Confetti active={showConfetti} duration={7000} particleCount={90} />

      {/* Explosion Particles on Blast */}
      <AnimatePresence>
        {isBlasting &&
          blastParticles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none z-50 select-none text-3xl"
              style={{ left: "50%", top: "50%" }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, p.scale, 0],
                x: p.x,
                y: p.y,
                rotate: [0, (Math.random() - 0.5) * 720],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            >
              {p.icon}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Fake browser frame */}
      <motion.div
        className="relative w-[92%] max-w-[430px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        {/* Browser top bar */}
        <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-white rounded-full px-4 py-1 text-xs text-gray-400 flex items-center gap-1">
              <span className="text-green-500">🔒</span>
              <span className="truncate">{cardData.browserUrl}</span>
            </div>
          </div>
        </div>

        {/* Browser title */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-1.5 text-center border-b border-pink-100">
          <p className="text-sm font-medium text-rose-600 font-body">
            {cardData.browserTitle}
          </p>
        </div>

        {/* Content area */}
        <div
          ref={contentRef}
          className="p-4 pt-2 pb-4 flex flex-col items-center gap-2 min-h-[400px] justify-center paper-texture relative overflow-hidden"
        >
          {/* Character Stage */}
          <CharacterStage
            size={120}
            shinchanAnim={charShinchanAnim}
            shinchanSpeech={shinchanSpeech}
            sideMinions="both"
            minionLeftAnim={minionAnim}
            minionLeftChar="bob"
            minionLeftSpeech={minionSpeech}
            minionRightAnim={
              minionAnim === "jump"
                ? "jump"
                : minionAnim === "dance"
                  ? "dance"
                  : "ukulele"
            }
            minionRightChar="stuart"
            minionRightSpeech="Tulaliloo! 🎶"
            onShinchanClick={handleCharClick}
            compact
          />

          {/* Blast KABOOM Banner */}
          <AnimatePresence>
            {isBlasting && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-red-600 font-extrabold text-xl px-5 py-3 rounded-2xl shadow-2xl border-4 border-red-600 z-50 select-none text-center"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: [0, 1.4, 1.1], rotate: [0, 10, -5, 0] }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                💥 KABOOOOM!! 💥
                <div className="text-xs font-hand text-gray-900 mt-1 font-bold">
                  Thambi won! You have to see it Akka! ❤️
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secret message */}
          <AnimatePresence>
            {showSecret && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  bg-white rounded-xl shadow-2xl px-5 py-3 text-center z-50 border-2 border-gold"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <p className="text-base font-hand text-rose-600 font-bold">
                  Okay okay 😂
                  <br />
                  Secret dance party for Akka!
                </p>
                <p className="text-2xl mt-1">🍌🎉💃</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rocket trail particles */}
          <AnimatePresence>
            {rocketTrails.map((t) => (
              <motion.div
                key={t.id}
                className="absolute pointer-events-none z-30 select-none text-lg"
                style={{
                  left: `calc(50% + ${t.x}px)`,
                  top: `calc(55% + ${t.y}px)`,
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0.3, y: 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {t.icon}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Greeting / Question */}
          <AnimatePresence mode="wait">
            {phase === "greeting" ? (
              <motion.div
                key="greeting"
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="font-hand text-xl text-gray-800 leading-relaxed font-bold">
                  {cardData.characterGreeting.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                className="text-center flex flex-col items-center gap-2 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Question text */}
                <p className="font-hand text-xl text-gray-800 font-bold">
                  {noCount > 0 && noCount <= cardData.noReactions.length
                    ? cardData.noReactions[
                        Math.min(noCount - 1, cardData.noReactions.length - 1)
                      ]
                    : cardData.characterQuestion}
                </p>

                {/* Button area — side-by-side initially, flying away on NO click */}
                {!isBlasting && (
                  <div className="relative w-full min-h-[110px] flex items-center justify-center">
                    <div className={`flex items-center justify-center ${noCount === 0 ? "gap-6" : ""}`}>
                      {/* YES Button */}
                      <motion.button
                        className="px-7 py-2.5 bg-gradient-to-r from-rose to-red-rakhi
                          text-white font-semibold rounded-full shadow-lg
                          text-base select-none cursor-pointer z-20"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleYes}
                        animate={
                          noCount >= 3
                            ? {
                                scale: [1, 1.08, 1],
                              }
                            : {}
                        }
                        transition={
                          noCount >= 3
                            ? { duration: 0.8, repeat: Infinity }
                            : {}
                        }
                      >
                        {noCount >= 3 ? "JUST CLICK YES! ❤️" : "YES ❤️"}
                      </motion.button>

                      {/* The NAUGHTY Rocket NO Button — side by side initially, flies away on click */}
                      <motion.button
                        className={`${
                          noCount === 0 ? "relative" : "absolute"
                        } px-5 py-2 font-bold rounded-full shadow-xl text-sm select-none cursor-pointer z-30 ${
                          noCount >= 4
                            ? "bg-red-500 text-white border-2 border-yellow-300"
                            : noCount >= 2
                              ? "bg-amber-400 text-amber-900 border-2 border-amber-500"
                              : noCount >= 1
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                        animate={
                          noCount === 0
                            ? { x: 0, y: 0, rotate: 0, scale: 1 }
                            : {
                                x: noPos.x,
                                y: noPos.y,
                                rotate: noPos.rotate,
                                scale: noScale,
                              }
                        }
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 12,
                          mass: 0.8,
                        }}
                        whileHover={{
                          scale: noScale * 1.1,
                          rotate: (noPos?.rotate || 0) + 10,
                        }}
                        whileTap={{ scale: noScale * 0.9 }}
                        onClick={handleNo}
                      >
                        {currentNoLabel}

                        {/* Naughty taunt emoji that pops out */}
                        <AnimatePresence>
                          {naughtyEmoji && (
                            <motion.span
                              className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl pointer-events-none select-none"
                              initial={{ opacity: 1, y: 0, scale: 0.5 }}
                              animate={{ opacity: 0, y: -20, scale: 1.5 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6 }}
                            >
                              {naughtyEmoji}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Rocket flame trail when moving */}
                        {noCount >= 2 && (
                          <motion.span
                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-sm pointer-events-none select-none"
                            animate={{
                              opacity: [0.8, 0.3, 0.8],
                              scale: [1, 1.3, 1],
                            }}
                            transition={{
                              duration: 0.3,
                              repeat: Infinity,
                            }}
                          >
                            🔥
                          </motion.span>
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom text */}
      <motion.div
        className="absolute bottom-4 text-pink-400/50 text-xs font-body select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        ✦ made with love for Akka ✦
      </motion.div>
    </motion.div>
  );
}
