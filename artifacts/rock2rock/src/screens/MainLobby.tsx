import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";
import { CosmicBackground } from "../components/CosmicBackground";
import { MOCK_LEADERBOARD, MALE_AVATARS } from "../lib/data";

export function MainLobby() {
  const { 
    playerName, 
    playerRegion, 
    playerScore, 
    selectedAvatar, 
    setOpponent, 
    setScreen 
  } = useGame();
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const startMatch = (opponent: any) => {
    setOpponent(opponent);
    setScreen("GAMEPLAY_HUD");
  };

  const handleRandomPlay = () => {
    const randomOpponent = MOCK_LEADERBOARD[Math.floor(Math.random() * MOCK_LEADERBOARD.length)];
    startMatch(randomOpponent);
  };

  const handleAiChallenge = () => {
    startMatch({
      name: "Cosmic AI",
      region: "UNIVERSE",
      avatar: {
        id: "ai",
        name: "AI Core",
        emoji: "🤖",
        gradient: "from-gray-800 to-black",
        gender: "male"
      },
      score: 9999
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

      <header className="relative z-10 flex flex-wrap justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
            Rock 2 Rock
          </h1>
          <div className="text-purple-300 font-bold mt-1 tracking-wider text-sm">
            SCORE: {playerScore}
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-end">
              <span className="font-bold text-lg leading-tight">{playerName || "Unknown"}</span>
              <span className="text-xs text-purple-300">{playerRegion || "NA"}</span>
            </div>
            {selectedAvatar && (
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedAvatar.gradient} flex items-center justify-center text-2xl border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]`}>
                {selectedAvatar.emoji}
              </div>
            )}
          </div>
          
          <div className="w-px h-10 bg-white/20"></div>
          
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${soundEnabled ? 'bg-purple-600' : 'bg-gray-600'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              SOUND
              <input type="checkbox" className="hidden" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${musicEnabled ? 'bg-purple-600' : 'bg-gray-600'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${musicEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              MUSIC
              <input type="checkbox" className="hidden" checked={musicEnabled} onChange={() => setMusicEnabled(!musicEnabled)} />
            </label>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center max-w-4xl mx-auto w-full">
        <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
          <h2 className="text-xl font-bold text-center text-purple-300 mb-6 tracking-[0.2em]">GLOBAL TOP 10</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-purple-400">
                  <th className="py-3 px-4 font-semibold w-16">RANK</th>
                  <th className="py-3 px-4 font-semibold">PLAYER</th>
                  <th className="py-3 px-4 font-semibold text-center">WINS</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERBOARD.map((p, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-4 text-purple-300 font-mono">#{idx + 1}</td>
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded shrink-0 bg-gradient-to-br ${p.avatar.gradient} flex items-center justify-center text-sm border border-white/10`}>
                        {p.avatar.emoji}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-purple-300 transition-colors">{p.name}</span>
                        <span className="text-[10px] text-gray-400">{p.region}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-300">{p.score}</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => startMatch(p)}
                        className="px-4 py-1.5 bg-purple-900/50 hover:bg-purple-600 border border-purple-500/50 rounded text-xs font-bold transition-all hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        data-testid={`btn-challenge-${idx}`}
                      >
                        CHALLENGE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <button
            onClick={handleRandomPlay}
            className="flex-1 max-w-sm py-5 bg-purple-700 hover:bg-purple-600 text-white font-black rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:shadow-[0_0_35px_rgba(168,85,247,0.9)] transition-all uppercase tracking-widest text-lg"
            data-testid="btn-random-mode"
          >
            PLAY RANDOM MODE
          </button>
          
          <button
            onClick={handleAiChallenge}
            className="flex-1 max-w-sm py-5 bg-indigo-700 hover:bg-indigo-600 text-white font-black rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:shadow-[0_0_35px_rgba(99,102,241,0.9)] transition-all uppercase tracking-widest text-lg"
            data-testid="btn-ai-challenge"
          >
            AI CHALLENGE
          </button>
        </div>
      </main>
    </motion.div>
  );
}
