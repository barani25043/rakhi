import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShinchanAnimation from "./ShinchanAnimation";
import type { ShinchanAnimationType } from "./ShinchanAnimation";
import Confetti from "./Confetti";
import cardData from "../data/cardData";

interface ShinchanSceneProps {
  onNext: () => void;
}

export default function ShinchanScene({ onNext }: ShinchanSceneProps) {
  const [phase, setPhase] = useState<"greeting" | "question">("greeting");
  const [noCount, setNoCount] = useState(0);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [charAnimation, setCharAnimation] = useState<ShinchanAnimationType>("idle");
  const [speechText, setSpeechText] = useState<string>("Heyyy Didi! 👋");
  const [secretClicks, setSecretClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    // Character entry sequence
    const t1 = setTimeout(() => {
      setCharAnimation("wave");
      setSpeechText("I made something for you! ❤️");
    }, 800);
    const t2 = setTimeout(() => {
      setPhase("question");
      setCharAnimation("dance");
      setSpeechText("Do you wanna see it? 😜");
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleYes = () => {
    setCharAnimation("dance");
    setSpeechText("YAAAAAY!! Let's go! 🎉");
    setShowConfetti(true);
    setTimeout(() => {
      setCharAnimation("jump");
    }, 600);
    setTimeout(() => onNext(), 1400);
  };

  const handleNo = () => {
    const newCount = noCount + 1;
    setNoCount(newCount);
    
    if (newCount === 1) {
      setCharAnimation("cry");
      setSpeechText("Are you REALLY sure? 🥺");
    } else if (newCount === 2) {
      setCharAnimation("cry");
      setSpeechText("Come on please!! 😭");
    } else {
      setCharAnimation("dance");
      setSpeechText("Nice try! You HAVE to see it 😌");
    }

    // Move the button randomly
    setNoOffset({
      x: (Math.random() - 0.5) * 140,
      y: (Math.random() - 0.5) * 70,
    });

    if (newCount >= 3) {
      // Force redirect to yes
      setTimeout(() => handleYes(), 800);
    }
  };

  const handleCharClick = () => {
    const newClicks = secretClicks + 1;
    setSecretClicks(newClicks);
    setCharAnimation("dance");
    setSpeechText("Dance party time! 💃");
    if (newClicks >= 5 && !showSecret) {
      setShowSecret(true);
      setCharAnimation("jump");
      setShowConfetti(true);
      setTimeout(() => {
        setShowSecret(false);
        setShowConfetti(false);
        setCharAnimation("idle");
        setSpeechText("Hehehe! 🤪");
      }, 3000);
    }
  };

  const noReaction =
    noCount > 0 && noCount <= cardData.noReactions.length
      ? cardData.noReactions[noCount - 1]
      : null;

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFF8F0 0%, #FFE8D6 50%, #FFD6E0 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6 }}
    >
      <Confetti active={showConfetti} />

      {/* Fake browser frame */}
      <motion.div
        className="relative w-[90%] max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        {/* Browser top bar */}
        <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
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
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-2 text-center border-b border-pink-100">
          <p className="text-sm font-medium text-rose-600">
            {cardData.browserTitle}
          </p>
        </div>

        {/* Content area */}
        <div className="p-6 pt-10 pb-8 flex flex-col items-center gap-6 min-h-[400px] justify-center paper-texture">
          {/* Shinchan character */}
          <ShinchanAnimation
            animation={charAnimation}
            size={200}
            onClick={handleCharClick}
            speechText={speechText}
          />

          {/* Secret message */}
          <AnimatePresence>
            {showSecret && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  bg-white rounded-xl shadow-lg px-6 py-4 text-center z-50 border-2 border-gold"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <p className="text-lg font-hand text-rose-600">
                  Okay okay 😂
                  <br />
                  You found the secret!
                </p>
                <p className="text-3xl mt-2">🎉</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Greeting text */}
          <AnimatePresence mode="wait">
            {phase === "greeting" ? (
              <motion.div
                key="greeting"
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="font-hand text-2xl text-gray-800 leading-relaxed">
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
                className="text-center flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* No-reaction text */}
                <AnimatePresence mode="wait">
                  {noReaction ? (
                    <motion.p
                      key={`no-${noCount}`}
                      className="font-hand text-xl text-rose-500"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {noReaction.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="question-text"
                      className="font-hand text-2xl text-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {cardData.characterQuestion}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex gap-4 items-center mt-2">
                  <motion.button
                    className="px-8 py-3 bg-gradient-to-r from-rose to-red-rakhi
                      text-white font-semibold rounded-full shadow-lg
                      text-lg select-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleYes}
                  >
                    YES ❤️
                  </motion.button>

                  <motion.button
                    className="px-6 py-3 bg-gray-100 text-gray-600 font-semibold
                      rounded-full shadow text-base select-none border border-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      x: noOffset.x,
                      y: noOffset.y,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={handleNo}
                  >
                    NO 🙈
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Decorative elements around browser frame */}
      <motion.div
        className="absolute bottom-6 text-pink-300/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        ✦ made with love ✦
      </motion.div>
    </motion.div>
  );
}
