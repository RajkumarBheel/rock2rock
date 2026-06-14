import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";
import { CosmicBackground } from "../components/CosmicBackground";

export function IntroSplash() {
  const { setScreen } = useGame();
  const [phase, setPhase] = useState<"creator" | "transition" | "title">("creator");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("transition"), 2000);
    const t2 = setTimeout(() => setPhase("title"), 3000);
    const t3 = setTimeout(() => setScreen("LOGIN_SIGNUP"), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [setScreen]);

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {phase === "creator" && (
          <motion.div
            key="creator"
            className="flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-purple-500 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.p
              className="tracking-[0.3em] text-xs text-purple-300 mb-2 uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Presented By
            </motion.p>
            <motion.h1
              className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              R K B 67
            </motion.h1>
          </motion.div>
        )}

        {phase === "transition" && (
          <motion.div
            key="transition"
            className="absolute inset-0 bg-slate-900 z-20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)",
            }}
          />
        )}

        {phase === "title" && (
          <motion.div
            key="title"
            className="flex flex-col items-center justify-center z-30"
          >
            <CosmicBackground />
            <motion.h1
              className="text-7xl md:text-9xl font-black text-white drop-shadow-[0_0_25px_rgba(168,85,247,0.9)]"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              Rock 2 Rock
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
