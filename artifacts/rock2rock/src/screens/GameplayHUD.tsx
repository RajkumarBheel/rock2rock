import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, Choice } from "../context/GameContext";
import { CosmicBackground } from "../components/CosmicBackground";
import {
  playRock,
  playPaper,
  playScissors,
  playRoundWin,
  playRoundLoss,
  playTie,
  playClick,
  playHover,
} from "../lib/audio";
import { AvatarIcon } from "../components/AvatarIcon";
import { AlertTriangle } from "lucide-react";

const CHOICES: Choice[] = ["rock", "paper", "scissors"];

function RockIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="38" rx="22" ry="18" fill="#78716c" />
      <ellipse cx="32" cy="36" rx="20" ry="16" fill="#a8a29e" />
      <ellipse cx="26" cy="30" rx="8" ry="6" fill="#d6d3d1" opacity="0.5" />
      <ellipse cx="38" cy="42" rx="5" ry="4" fill="#57534e" opacity="0.4" />
      <ellipse cx="20" cy="40" rx="4" ry="3" fill="#57534e" opacity="0.3" />
    </svg>
  );
}

function PaperIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="40" height="48" rx="4" fill="url(#paperGrad2)" opacity="0.85" />
      <line x1="18" y1="20" x2="42" y2="20" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="28" x2="42" y2="28" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="36" x2="34" y2="36" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="paperGrad2" x1="10" y1="8" x2="50" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#eff6ff" />
          <stop offset="1" stopColor="#93c5fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ScissorsIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="44" r="9" fill="#71717a" stroke="#a1a1aa" strokeWidth="1.5" />
      <circle cx="20" cy="44" r="5" fill="#18181b" />
      <circle cx="44" cy="44" r="9" fill="#71717a" stroke="#a1a1aa" strokeWidth="1.5" />
      <circle cx="44" cy="44" r="5" fill="#18181b" />
      <line x1="26" y1="39" x2="32" y2="32" stroke="#d4d4d8" strokeWidth="4" strokeLinecap="round" />
      <line x1="38" y1="39" x2="32" y2="32" stroke="#d4d4d8" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="32" x2="32" y2="12" stroke="#a1a1aa" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="32" x2="20" y2="14" stroke="#e4e4e7" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="32" x2="44" y2="14" stroke="#e4e4e7" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function GameplayHUD() {
  const {
    playerName,
    selectedAvatar,
    opponent,
    matchWins,
    matchLosses,
    addRoundResult,
    endMatch,
    resetMatch,
  } = useGame();

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null);
  const [roundResultText, setRoundResultText] = useState<string | null>(null);
  const [isAnimatingRound, setIsAnimatingRound] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    if (matchWins >= 3) {
      setTimeout(() => endMatch(true), 1500);
    } else if (matchLosses >= 3) {
      setTimeout(() => endMatch(false), 1500);
    }
  }, [matchWins, matchLosses, endMatch]);

  const playChoiceSound = (choice: Choice) => {
    if (choice === "rock") playRock();
    else if (choice === "paper") playPaper();
    else playScissors();
  };

  const handleChoiceClick = (choice: Choice) => {
    if (isAnimatingRound || matchWins >= 3 || matchLosses >= 3) return;

    setIsAnimatingRound(true);
    setPlayerChoice(choice);
    playChoiceSound(choice);

    const oChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    setOpponentChoice(oChoice);

    let resultText = "TIE";
    let winner: "player" | "opponent" | "tie" = "tie";

    if (
      (choice === "rock" && oChoice === "scissors") ||
      (choice === "scissors" && oChoice === "paper") ||
      (choice === "paper" && oChoice === "rock")
    ) {
      resultText = "ROUND WIN";
      winner = "player";
    } else if (choice !== oChoice) {
      resultText = "ROUND LOSS";
      winner = "opponent";
    }

    setTimeout(() => {
      setRoundResultText(resultText);
      addRoundResult({ playerChoice: choice, opponentChoice: oChoice, winner });

      // Play round outcome sound
      if (winner === "player") playRoundWin();
      else if (winner === "opponent") playRoundLoss();
      else playTie();

      setTimeout(() => {
        setPlayerChoice(null);
        setOpponentChoice(null);
        setRoundResultText(null);
        setIsAnimatingRound(false);
      }, 2000);
    }, 1000);
  };

  const renderDots = (wins: number, isLoss = false) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full border border-white/20 transition-all ${
          i < wins
            ? isLoss
              ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
              : "bg-green-500 shadow-[0_0_8px_#22c55e]"
            : "bg-gray-800"
        }`}
      />
    ));
  };

  const getChoiceLabel = (c: Choice) => {
    if (c === "rock") return "ROCK";
    if (c === "paper") return "PAPER";
    return "SCISSORS";
  };

  const ChoiceDisplay = ({ choice }: { choice: Choice }) => {
    if (choice === "rock") return <RockIcon size={80} />;
    if (choice === "paper") return <PaperIcon size={80} />;
    return <ScissorsIcon size={80} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen bg-slate-950 flex flex-col overflow-hidden"
    >
      <CosmicBackground />

      {/* Exit confirm overlay */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(168,85,247,0.3)] text-center"
            >
              <AlertTriangle size={40} className="text-yellow-400 mb-4" />
              <h3 className="text-xl font-black text-white mb-2 tracking-widest">FORFEIT MATCH?</h3>
              <p className="text-gray-400 text-sm mb-6">You will lose this match and return to the lobby.</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => { playClick(); resetMatch(); }}
                  className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  data-testid="btn-confirm-exit"
                >
                  EXIT
                </button>
                <button
                  onClick={() => { playClick(); setShowExitConfirm(false); }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10"
                  data-testid="btn-cancel-exit"
                >
                  STAY
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative z-10 p-4 md:p-6 flex justify-between items-center bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          {selectedAvatar && (
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedAvatar.gradient} flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-500`}>
              <AvatarIcon name={selectedAvatar.icon} size={22} className="text-white" />
            </div>
          )}
          <div>
            <div className="font-black text-lg text-white tracking-widest">{playerName}</div>
            <div className="flex gap-1.5 mt-1">{renderDots(matchWins, false)}</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl font-black text-white/20">VS</div>
          <button
            onClick={() => { playClick(); setShowExitConfirm(true); }}
            onMouseEnter={() => playHover()}
            className="px-3 py-1 bg-red-900/40 hover:bg-red-700/60 border border-red-500/40 rounded-lg text-red-400 hover:text-white text-xs font-bold transition-all tracking-widest"
            data-testid="btn-exit-match"
          >
            EXIT MATCH
          </button>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="font-black text-lg text-red-400 tracking-widest">{opponent?.name || "CPU"}</div>
            <div className="flex gap-1.5 mt-1 justify-end">{renderDots(matchLosses, true)}</div>
          </div>
          {opponent?.avatar && (
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opponent.avatar.gradient} flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500`}>
              <AvatarIcon name={opponent.avatar.icon} size={22} className="text-white" />
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center">
        <AnimatePresence>
          {roundResultText && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`absolute z-30 font-black text-5xl md:text-6xl tracking-widest text-center ${
                roundResultText === "ROUND WIN"
                  ? "text-green-400 drop-shadow-[0_0_25px_#22c55e]"
                  : roundResultText === "ROUND LOSS"
                  ? "text-red-500 drop-shadow-[0_0_25px_#ef4444]"
                  : "text-yellow-400 drop-shadow-[0_0_25px_#eab308]"
              }`}
            >
              {roundResultText}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full max-w-4xl h-56 flex justify-between items-center px-6 md:px-16">
          <div className="w-2/5 flex flex-col items-center justify-center h-full relative border-r border-white/5">
            <AnimatePresence>
              {playerChoice ? (
                <motion.div
                  key="player-choice"
                  initial={{ x: -200, rotate: -30, opacity: 0 }}
                  animate={{ x: 0, rotate: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="flex flex-col items-center gap-2 drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]"
                >
                  <ChoiceDisplay choice={playerChoice} />
                  <span className="text-xs font-black text-purple-300 tracking-widest">{getChoiceLabel(playerChoice)}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="player-wait"
                  className="text-white/10 font-black text-lg tracking-widest"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  PICK
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-1/5 flex justify-center">
            <motion.div
              className="w-3 h-3 rounded-full bg-purple-500/50"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>

          <div className="w-2/5 flex flex-col items-center justify-center h-full relative border-l border-white/5">
            <AnimatePresence>
              {opponentChoice ? (
                <motion.div
                  key="opp-choice"
                  initial={{ x: 200, rotate: 30, opacity: 0 }}
                  animate={{ x: 0, rotate: 0, opacity: 1 }}
                  exit={{ x: 200, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="flex flex-col items-center gap-2 drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]"
                >
                  <ChoiceDisplay choice={opponentChoice} />
                  <span className="text-xs font-black text-red-300 tracking-widest">{getChoiceLabel(opponentChoice)}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="opp-wait"
                  className="text-white/10 font-black text-lg tracking-widest"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  WAIT
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-6 md:p-8 flex justify-center gap-6 md:gap-10 bg-gradient-to-t from-black to-transparent">
        <motion.button
          onClick={() => handleChoiceClick("rock")}
          onHoverStart={() => playHover()}
          disabled={isAnimatingRound}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-24 h-24 rounded-full backdrop-blur-sm bg-gradient-to-br from-stone-700 to-stone-900 border border-stone-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-shadow flex flex-col items-center justify-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
          data-testid="btn-choice-rock"
        >
          <RockIcon size={40} />
          <span className="text-[9px] font-black text-stone-300 tracking-widest">ROCK</span>
        </motion.button>

        <motion.button
          onClick={() => handleChoiceClick("paper")}
          onHoverStart={() => playHover()}
          disabled={isAnimatingRound}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-24 h-24 rounded-full backdrop-blur-sm bg-gradient-to-br from-sky-800 to-indigo-950 border border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] transition-shadow flex flex-col items-center justify-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
          data-testid="btn-choice-paper"
        >
          <PaperIcon size={40} />
          <span className="text-[9px] font-black text-sky-300 tracking-widest">PAPER</span>
        </motion.button>

        <motion.button
          onClick={() => handleChoiceClick("scissors")}
          onHoverStart={() => playHover()}
          disabled={isAnimatingRound}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-24 h-24 rounded-full backdrop-blur-sm bg-gradient-to-br from-zinc-600 to-slate-900 border border-zinc-400/30 shadow-[0_0_15px_rgba(161,161,170,0.3)] hover:shadow-[0_0_30px_rgba(161,161,170,0.7)] transition-shadow flex flex-col items-center justify-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
          data-testid="btn-choice-scissors"
        >
          <ScissorsIcon size={40} />
          <span className="text-[9px] font-black text-zinc-300 tracking-widest">SCISSORS</span>
        </motion.button>
      </footer>
    </motion.div>
  );
}
