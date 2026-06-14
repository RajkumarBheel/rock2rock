import { useState } from "react";
import { motion } from "framer-motion";
import { useGame, Avatar } from "../context/GameContext";
import { CosmicBackground } from "../components/CosmicBackground";
import { MALE_AVATARS, FEMALE_AVATARS } from "../lib/data";
import { AvatarIcon } from "../components/AvatarIcon";

export function AvatarSelection() {
  const { setAvatar, setScreen } = useGame();
  const [selected, setSelected] = useState<Avatar | null>(null);

  const handleConfirm = () => {
    if (selected) {
      setAvatar(selected);
      setScreen("MAIN_LOBBY");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-x-hidden p-6 py-12"
    >
      <CosmicBackground />
      
      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] mb-2 uppercase">
            Select Your Avatar
          </h2>
          <p className="text-purple-300">Choose your cosmic representation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 rounded-xl border border-cyan-500/30 bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <h3 className="text-cyan-400 font-bold mb-4 text-center tracking-widest text-sm">MALE AVATARS</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {MALE_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelected(avatar)}
                  className={`relative w-24 h-32 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br ${avatar.gradient} transition-all duration-300 hover:scale-105 ${
                    selected?.id === avatar.id
                      ? "border-2 border-purple-500 shadow-[0_0_15px_#a855f7] scale-105"
                      : "border border-white/10 opacity-70 hover:opacity-100"
                  }`}
                  data-testid={`btn-avatar-${avatar.id}`}
                >
                  <AvatarIcon name={avatar.icon} size={36} className="mb-2 text-white drop-shadow-md" />
                  <span className="text-xs font-bold text-white/90">{avatar.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl border border-pink-500/30 bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(236,72,153,0.1)]">
            <h3 className="text-pink-400 font-bold mb-4 text-center tracking-widest text-sm">FEMALE AVATARS</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {FEMALE_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelected(avatar)}
                  className={`relative w-24 h-32 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br ${avatar.gradient} transition-all duration-300 hover:scale-105 ${
                    selected?.id === avatar.id
                      ? "border-2 border-purple-500 shadow-[0_0_15px_#a855f7] scale-105"
                      : "border border-white/10 opacity-70 hover:opacity-100"
                  }`}
                  data-testid={`btn-avatar-${avatar.id}`}
                >
                  <AvatarIcon name={avatar.icon} size={36} className="mb-2 text-white drop-shadow-md" />
                  <span className="text-xs font-bold text-white/90">{avatar.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="px-12 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 disabled:opacity-50 text-white font-bold rounded-lg shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] transition-all uppercase tracking-wider text-lg disabled:cursor-not-allowed"
            data-testid="button-confirm-avatar"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </motion.div>
  );
}
