import { useState } from "react";
import { useGame } from "../context/GameContext";
import { CosmicBackground } from "../components/CosmicBackground";
import { motion } from "framer-motion";

export function LoginSignup() {
  const { setPlayerProfile, setScreen } = useGame();
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("NA");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setPlayerProfile(username, region);
      setScreen("AVATAR_SELECTION");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden p-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,rgba(2,8,23,1)_70%)] pointer-events-none" />
      <CosmicBackground />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-[0_0_40px_rgba(168,85,247,0.1)]"
      >
        <h1 className="text-4xl font-black text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] mb-8">
          Rock 2 Rock
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-purple-200">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your alias"
              required
              data-testid="input-username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="region" className="text-sm font-medium text-purple-200">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all [&>option]:bg-slate-900"
              data-testid="select-region"
            >
              <option value="NA">North America</option>
              <option value="EU">Europe</option>
              <option value="ASIA">Asia</option>
              <option value="SA">South America</option>
              <option value="OCE">Oceania</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full py-4 mt-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 disabled:opacity-50 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all uppercase tracking-wider disabled:cursor-not-allowed"
            data-testid="button-submit-login"
          >
            Enter Cosmic Arena
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
