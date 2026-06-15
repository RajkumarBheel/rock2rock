import { createContext, useContext, useState, ReactNode } from "react";

export type Screen = "INTRO_SPLASH" | "LOGIN_SIGNUP" | "AVATAR_SELECTION" | "MAIN_LOBBY" | "GAMEPLAY_HUD" | "GAME_OVER";

export interface Avatar {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  gender: "male" | "female";
}

export interface Opponent {
  name: string;
  region: string;
  avatar: Avatar;
  score: number;
}

export type Choice = "rock" | "paper" | "scissors";

export interface RoundResult {
  playerChoice: Choice;
  opponentChoice: Choice;
  winner: "player" | "opponent" | "tie";
}

export interface GameState {
  currentScreen: Screen;
  playerId: number | null;
  playerName: string;
  playerRegion: string;
  selectedAvatar: Avatar | null;
  playerScore: number;
  opponent: Opponent | null;
  matchWins: number;
  matchLosses: number;
  roundHistory: RoundResult[];
  isWinner: boolean;
}

export interface GameContextType extends GameState {
  setScreen: (screen: Screen) => void;
  setPlayerProfile: (id: number, name: string, region: string, score: number) => void;
  setAvatar: (avatar: Avatar) => void;
  setOpponent: (opponent: Opponent) => void;
  addRoundResult: (result: RoundResult) => void;
  resetMatch: () => void;
  endMatch: (isWinner: boolean) => void;
  logout: () => void;
  updateScore: (score: number) => void;
}

const defaultState: GameState = {
  currentScreen: "INTRO_SPLASH",
  playerId: null,
  playerName: "",
  playerRegion: "",
  selectedAvatar: null,
  playerScore: 0,
  opponent: null,
  matchWins: 0,
  matchLosses: 0,
  roundHistory: [],
  isWinner: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(defaultState);

  const setScreen = (currentScreen: Screen) => setState(s => ({ ...s, currentScreen }));

  const setPlayerProfile = (id: number, playerName: string, playerRegion: string, score: number) =>
    setState(s => ({ ...s, playerId: id, playerName, playerRegion, playerScore: score }));

  const setAvatar = (selectedAvatar: Avatar) =>
    setState(s => ({ ...s, selectedAvatar }));

  const setOpponent = (opponent: Opponent) =>
    setState(s => ({ ...s, opponent }));

  const addRoundResult = (result: RoundResult) => {
    setState(s => {
      const isPlayerWin = result.winner === "player";
      const isOpponentWin = result.winner === "opponent";
      return {
        ...s,
        roundHistory: [...s.roundHistory, result],
        matchWins: s.matchWins + (isPlayerWin ? 1 : 0),
        matchLosses: s.matchLosses + (isOpponentWin ? 1 : 0),
      };
    });
  };

  const endMatch = (isWinner: boolean) => {
    setState(s => ({
      ...s,
      isWinner,
      playerScore: s.playerScore + (isWinner ? 100 : 0),
      currentScreen: "GAME_OVER"
    }));
  };

  const resetMatch = () => {
    setState(s => ({
      ...s,
      opponent: null,
      matchWins: 0,
      matchLosses: 0,
      roundHistory: [],
      isWinner: false,
      currentScreen: "MAIN_LOBBY"
    }));
  };

  const logout = () => {
    setState({ ...defaultState, currentScreen: "LOGIN_SIGNUP" });
  };

  const updateScore = (score: number) => {
    setState(s => ({ ...s, playerScore: score }));
  };

  return (
    <GameContext.Provider value={{
      ...state,
      setScreen,
      setPlayerProfile,
      setAvatar,
      setOpponent,
      addRoundResult,
      resetMatch,
      endMatch,
      logout,
      updateScore,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
