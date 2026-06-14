import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";
import { CosmicBackground } from "../components/CosmicBackground";
import { MOCK_LEADERBOARD } from "../lib/data";
import {
  playClick,
  playHover,
  playBlocked,
  startAmbientMusic,
  stopMusic,
  setSoundEnabled,
  setMusicEnabled,
} from "../lib/audio";
import { AvatarIcon } from "../components/AvatarIcon";

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-slate-900/95 border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-transparent to-indigo-950/40 pointer-events-none rounded-3xl" />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/40"
            style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 25}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        <button
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm font-bold"
          data-testid="btn-close-about"
        >
          X
        </button>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center text-xl font-black text-white mx-auto mb-4 shadow-[0_0_25px_rgba(168,85,247,0.6)] border-2 border-purple-500">
            RB
          </div>
          <h2 className="text-2xl font-black text-white tracking-widest mb-1">RAJKUMAR BHEEL</h2>
          <p className="text-purple-400 text-xs tracking-[0.3em] mb-4 uppercase">Game Developer</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
            "The best games are the ones you can't stop playing — not because they trap you, but because they inspire you."
          </p>
          <div className="flex flex-col gap-3 text-sm mb-6">
            <a
              href="mailto:rajkumarbheel2675@gmail.com"
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-all group"
              data-testid="link-email"
            >
              <span className="text-xl">✉</span>
              <span className="text-gray-300 group-hover:text-white transition-colors break-all">rajkumarbheel2675@gmail.com</span>
            </a>
            <a
              href="https://linkedin.com/in/RajkumarBheel"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white/5 hover:bg-blue-900/30 border border-white/10 hover:border-blue-500/40 rounded-xl px-4 py-3 transition-all group"
              data-testid="link-linkedin"
            >
              <span className="text-xl text-blue-400">in</span>
              <span className="text-gray-300 group-hover:text-blue-300 transition-colors">linkedin.com/in/RajkumarBheel</span>
            </a>
            <a
              href="https://github.com/RajkumarBheel"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-all group"
              data-testid="link-github"
            >
              <span className="text-xl">⌥</span>
              <span className="text-gray-300 group-hover:text-white transition-colors">github.com/RajkumarBheel</span>
            </a>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-gray-500 text-xs tracking-widest uppercase">Rock 2 Rock &mdash; Developed by R K B 67 &copy; 2026</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MainLobby() {
  const {
    playerName,
    playerRegion,
    playerScore,
    selectedAvatar,
    setOpponent,
    setScreen,
  } = useGame();

  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);

  useEffect(() => {
    startAmbientMusic();
    return () => stopMusic();
  }, []);

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleMusicToggle = () => {
    const next = !musicOn;
    setMusicOn(next);
    setMusicEnabled(next);
  };

  const startMatch = (opponent: any) => {
    stopMusic();
    setOpponent(opponent);
    setScreen("GAMEPLAY_HUD");
  };

  const handleChallenge = (opponent: any, idx: number) => {
    const required = Math.ceil(opponent.score * 0.7);
    if (playerScore < required) {
      playBlocked();
      setBlockedMsg(
        `You need at least ${required.toLocaleString()} score to challenge #${idx + 1}. (You have ${playerScore.toLocaleString()})`
      );
      setTimeout(() => setBlockedMsg(null), 3500);
      return;
    }
    playClick();
    startMatch(opponent);
  };

  const handleRandomPlay = () => {
    playClick();
    const randomOpponent = MOCK_LEADERBOARD[Math.floor(Math.random() * MOCK_LEADERBOARD.length)];
    startMatch(randomOpponent);
  };

  const handleAiChallenge = () => {
    playClick();
    startMatch({
      name: "Cosmic AI",
      region: "UNIVERSE",
      avatar: { id: "ai", name: "AI Core", icon: "Bot", gradient: "from-gray-800 to-black", gender: "male" },
      score: 9999,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen bg-slate-950 text-white flex flex-col p-4 md:p-8"
    >
      <CosmicBackground />

      <AnimatePresence>
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      </AnimatePresence>

      {/* Score-lock toast */}
      <AnimatePresence>
        {blockedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-950/90 border border-red-500/50 rounded-xl px-6 py-3 text-red-300 text-sm font-bold text-center max-w-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] backdrop-blur-sm"
          >
            {blockedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative z-10 flex flex-wrap justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
            Rock 2 Rock
          </h1>
          <div className="text-purple-300 font-bold mt-1 tracking-wider text-sm">
            SCORE: {playerScore.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-end">
              <span className="font-bold text-lg leading-tight">{playerName || "Unknown"}</span>
              <span className="text-xs text-purple-300">{playerRegion || "NA"}</span>
            </div>
            {selectedAvatar && (
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedAvatar.gradient} flex items-center justify-center border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]`}>
                <AvatarIcon name={selectedAvatar.icon} size={22} className="text-white" />
              </div>
            )}
          </div>

          <div className="w-px h-10 bg-white/20" />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
              <div
                onClick={handleSoundToggle}
                className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${soundOn ? "bg-purple-600" : "bg-gray-600"}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${soundOn ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              SOUND
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
              <div
                onClick={handleMusicToggle}
                className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${musicOn ? "bg-purple-600" : "bg-gray-600"}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${musicOn ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              MUSIC
            </label>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center max-w-4xl mx-auto w-full">
        <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
          <h2 className="text-xl font-bold text-center text-purple-300 mb-2 tracking-[0.2em]">GLOBAL TOP 10</h2>
          <p className="text-center text-gray-500 text-xs mb-6 tracking-wider">
            You need 70% of a player's score to challenge them
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-purple-400">
                  <th className="py-3 px-4 font-semibold w-16">RANK</th>
                  <th className="py-3 px-4 font-semibold">PLAYER</th>
                  <th className="py-3 px-4 font-semibold text-center">WINS</th>
                  <th className="py-3 px-4 font-semibold text-center">REQUIRED</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERBOARD.map((p, idx) => {
                  const required = Math.ceil(p.score * 0.7);
                  const canChallenge = playerScore >= required;
                  return (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4 text-purple-300 font-mono">#{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded shrink-0 bg-gradient-to-br ${p.avatar.gradient} flex items-center justify-center border border-white/10`}>
                            <AvatarIcon name={p.avatar.icon} size={14} className="text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white group-hover:text-purple-300 transition-colors">{p.name}</span>
                            <span className="text-[10px] text-gray-400">{p.region}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-gray-300">{p.score.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-mono ${canChallenge ? "text-green-400" : "text-red-400"}`}>
                          {required.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <motion.button
                          onClick={() => handleChallenge(p, idx)}
                          onHoverStart={() => playHover()}
                          whileHover={{ scale: canChallenge ? 1.05 : 1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-1.5 border rounded text-xs font-bold transition-all ${
                            canChallenge
                              ? "bg-purple-900/50 hover:bg-purple-600 border-purple-500/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] text-white"
                              : "bg-gray-900/50 border-gray-700/50 text-gray-600 cursor-not-allowed"
                          }`}
                          data-testid={`btn-challenge-${idx}`}
                        >
                          {canChallenge ? "CHALLENGE" : "LOCKED"}
                        </motion.button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <motion.button
            onClick={handleRandomPlay}
            onHoverStart={() => playHover()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 max-w-sm py-5 bg-purple-700 hover:bg-purple-600 text-white font-black rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:shadow-[0_0_35px_rgba(168,85,247,0.9)] transition-all uppercase tracking-widest text-lg"
            data-testid="btn-random-mode"
          >
            PLAY RANDOM MODE
          </motion.button>

          <motion.button
            onClick={handleAiChallenge}
            onHoverStart={() => playHover()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 max-w-sm py-5 bg-indigo-700 hover:bg-indigo-600 text-white font-black rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:shadow-[0_0_35px_rgba(99,102,241,0.9)] transition-all uppercase tracking-widest text-lg"
            data-testid="btn-ai-challenge"
          >
            AI CHALLENGE
          </motion.button>
        </div>
      </main>

      {/* About button */}
      <motion.button
        onClick={() => { playClick(); setShowAbout(true); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-purple-700 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.9)] flex items-center justify-center text-white font-black text-lg transition-colors border border-purple-400/40"
        data-testid="btn-about"
        title="About Developer"
      >
        i
      </motion.button>
    </motion.div>
  );
}
