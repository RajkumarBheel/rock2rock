import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";
import { playVictory, playDefeat, playClick } from "../lib/audio";

export function GameOver() {
  const { isWinner, matchWins, matchLosses, selectedAvatar, resetMatch } = useGame();

  useEffect(() => {
    if (isWinner) playVictory();
    else playDefeat();
  }, [isWinner]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative w-full h-screen flex flex-col items-center justify-center overflow-hidden ${
        isWinner ? "bg-purple-950" : "bg-red-950"
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isWinner
            ? "radial-gradient(ellipse at center, rgba(168,85,247,0.3) 0%, rgba(0,0,0,1) 80%)"
            : "radial-gradient(ellipse at center, rgba(239,68,68,0.3) 0%, rgba(0,0,0,1) 80%)",
        }}
      />

      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-4 h-4 backdrop-blur-md border ${
            isWinner ? "border-purple-400 bg-purple-500/20" : "border-red-500 bg-red-600/20"
          }`}
          style={{
            left: `${(i * 7) % 100}vw`,
            top: `${(i * 13) % 100}vh`,
            clipPath: isWinner
              ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
              : "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
          }}
          animate={{
            y: isWinner ? [0, -120] : [0, 120],
            rotate: [0, 360],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2 + (i % 4),
            repeat: Infinity,
            ease: "linear",
            delay: (i * 0.3) % 2,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          className={`text-6xl md:text-9xl font-black mb-8 tracking-widest ${
            isWinner
              ? "text-purple-300 drop-shadow-[0_0_30px_#a855f7]"
              : "text-red-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]"
          }`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {isWinner ? "VICTORY" : "DEFEAT"}
        </motion.h1>

        {isWinner && selectedAvatar && (
          <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 border-2 border-purple-500 rounded-lg shadow-[0_0_20px_#a855f7]"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 border-2 border-purple-400 rounded-lg shadow-[0_0_15px_#c084fc]"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div
              className={`w-24 h-24 rounded-lg bg-gradient-to-br ${selectedAvatar.gradient} flex items-center justify-center text-5xl z-10 shadow-[0_0_30px_rgba(168,85,247,0.8)]`}
            >
              {selectedAvatar.emoji}
            </div>
          </div>
        )}

        <div
          className={`text-4xl font-black mb-12 tracking-[0.2em] ${
            isWinner ? "text-purple-200" : "text-red-300"
          }`}
        >
          {matchWins} — {matchLosses}
        </div>

        <motion.button
          onClick={() => { playClick(); resetMatch(); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-10 py-4 font-bold text-xl uppercase tracking-widest transition-all rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
            isWinner
              ? "bg-purple-700 hover:bg-purple-600 text-white hover:shadow-[0_0_30px_#a855f7]"
              : "bg-red-800 hover:bg-red-700 text-white hover:shadow-[0_0_30px_#ef4444]"
          }`}
          data-testid="btn-return-lobby"
        >
          Return to Lobby
        </motion.button>
      </div>
    </motion.div>
  );
}
