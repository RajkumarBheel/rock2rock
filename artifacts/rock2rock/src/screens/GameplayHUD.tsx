import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, Choice } from "../context/GameContext";
import { CosmicBackground } from "../components/CosmicBackground";

const CHOICES: Choice[] = ["rock", "paper", "scissors"];

export function GameplayHUD() {
  const { 
    playerName, 
    selectedAvatar, 
    opponent, 
    matchWins, 
    matchLosses, 
    addRoundResult,
    endMatch
  } = useGame();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null);
  const [roundResultText, setRoundResultText] = useState<string | null>(null);
  const [isAnimatingRound, setIsAnimatingRound] = useState(false);

  useEffect(() => {
    if (matchWins >= 3) {
      setTimeout(() => endMatch(true), 1500);
    } else if (matchLosses >= 3) {
      setTimeout(() => endMatch(false), 1500);
    }
  }, [matchWins, matchLosses, endMatch]);

  const handleChoiceClick = (choice: Choice) => {
    if (isAnimatingRound || matchWins >= 3 || matchLosses >= 3) return;
    
    setIsAnimatingRound(true);
    setPlayerChoice(choice);
    
    // TODO: Integrate Howler.js audio sprite triggers here
    
    // Simulate opponent choice
    const oChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    setOpponentChoice(oChoice);

    let resultText = "TIE";
    let winner: "player" | "opponent" | "tie" = "tie";
    
    if (
      (choice === "rock" && oChoice === "scissors") ||
      (choice === "scissors" && oChoice === "paper") ||
      (choice === "paper" && oChoice === "rock")
    ) {
      resultText = "ROUND WIN \u2713";
      winner = "player";
    } else if (choice !== oChoice) {
      resultText = "ROUND LOSS \u2717";
      winner = "opponent";
    }

    setTimeout(() => {
      // Collision happens
      setRoundResultText(resultText);
      addRoundResult({ playerChoice: choice, opponentChoice: oChoice, winner });
      
      // TODO: Integrate Howler.js audio sprite triggers here
      
      setTimeout(() => {
        // Reset for next round if match not over
        setPlayerChoice(null);
        setOpponentChoice(null);
        setRoundResultText(null);
        setIsAnimatingRound(false);
      }, 2000);
      
    }, 1500); // Wait for countdown and slide in
  };

  const renderDots = (wins: number) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div 
        key={i} 
        className={`w-3 h-3 rounded-full border border-white/20 transition-all ${
          i < wins ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-gray-800'
        }`}
      />
    ));
  };

  const getChoiceIcon = (c: Choice | null) => {
    if (c === "rock") return "🪨";
    if (c === "paper") return "🛡️";
    if (c === "scissors") return "⚔️";
    return "?";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen bg-slate-950 flex flex-col overflow-hidden"
    >
      <CosmicBackground />

      <header className="relative z-10 p-6 flex justify-between items-center bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4">
          {selectedAvatar && (
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedAvatar.gradient} flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-500`}>
              {selectedAvatar.emoji}
            </div>
          )}
          <div>
            <div className="font-black text-xl text-white tracking-widest">{playerName}</div>
            <div className="flex gap-2 mt-1">{renderDots(matchWins)}</div>
          </div>
        </div>

        <div className="text-4xl font-black text-white/20 px-8">VS</div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="font-black text-xl text-red-400 tracking-widest">{opponent?.name || "CPU"}</div>
            <div className="flex gap-2 mt-1 justify-end">{renderDots(matchLosses)}</div>
          </div>
          {opponent?.avatar && (
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${opponent.avatar.gradient} flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500`}>
              {opponent.avatar.emoji}
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center">
        <AnimatePresence>
          {roundResultText && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`absolute z-30 font-black text-6xl tracking-widest text-center ${
                roundResultText.includes("WIN") ? "text-green-400 drop-shadow-[0_0_25px_#22c55e]" :
                roundResultText.includes("LOSS") ? "text-red-500 drop-shadow-[0_0_25px_#ef4444]" :
                "text-yellow-400 drop-shadow-[0_0_25px_#eab308]"
              }`}
            >
              {roundResultText}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full max-w-4xl h-64 flex justify-between items-center px-10">
          <div className="w-1/3 flex justify-center border-r border-white/5 h-full relative">
            <AnimatePresence>
              {playerChoice && (
                <motion.div
                  initial={{ x: "-100vw", rotate: -180 }}
                  animate={{ x: 0, rotate: 0 }}
                  exit={{ x: "-100vw", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute top-1/2 -translate-y-1/2 right-10 text-8xl drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]"
                >
                  {getChoiceIcon(playerChoice)}
                </motion.div>
              )}
            </AnimatePresence>
            {!playerChoice && <div className="absolute top-1/2 -translate-y-1/2 text-8xl opacity-10 blur-sm">{selectedAvatar?.emoji}</div>}
          </div>
          
          <div className="w-1/3 flex justify-center border-l border-white/5 h-full relative">
            <AnimatePresence>
              {opponentChoice && (
                <motion.div
                  initial={{ x: "100vw", rotate: 180 }}
                  animate={{ x: 0, rotate: 0 }}
                  exit={{ x: "100vw", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute top-1/2 -translate-y-1/2 left-10 text-8xl drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]"
                >
                  {getChoiceIcon(opponentChoice)}
                </motion.div>
              )}
            </AnimatePresence>
            {!opponentChoice && <div className="absolute top-1/2 -translate-y-1/2 text-8xl opacity-10 blur-sm">{opponent?.avatar?.emoji}</div>}
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-8 flex justify-center gap-8 bg-gradient-to-t from-black to-transparent">
        <button
          onClick={() => handleChoiceClick("rock")}
          disabled={isAnimatingRound}
          className="w-24 h-24 rounded-full backdrop-blur-sm bg-gradient-to-br from-stone-700 to-stone-900 border border-white/20 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-110 hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all flex items-center justify-center text-4xl disabled:opacity-50 disabled:hover:scale-100"
          data-testid="btn-choice-rock"
        >
          🪨
        </button>
        <button
          onClick={() => handleChoiceClick("paper")}
          disabled={isAnimatingRound}
          className="w-24 h-24 rounded-full backdrop-blur-sm bg-gradient-to-br from-sky-700 to-indigo-900 border border-white/20 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-110 hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all flex items-center justify-center text-4xl disabled:opacity-50 disabled:hover:scale-100"
          data-testid="btn-choice-paper"
        >
          🛡️
        </button>
        <button
          onClick={() => handleChoiceClick("scissors")}
          disabled={isAnimatingRound}
          className="w-24 h-24 rounded-full backdrop-blur-sm bg-gradient-to-br from-zinc-600 to-slate-900 border border-white/20 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-110 hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all flex items-center justify-center text-4xl disabled:opacity-50 disabled:hover:scale-100"
          data-testid="btn-choice-scissors"
        >
          ⚔️
        </button>
      </footer>
    </motion.div>
  );
}
