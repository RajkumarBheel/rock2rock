import { AnimatePresence } from "framer-motion";
import { GameProvider, useGame } from "./context/GameContext";
import { IntroSplash } from "./screens/IntroSplash";
import { LoginSignup } from "./screens/LoginSignup";
import { AvatarSelection } from "./screens/AvatarSelection";
import { MainLobby } from "./screens/MainLobby";
import { GameplayHUD } from "./screens/GameplayHUD";
import { GameOver } from "./screens/GameOver";
import { Toaster } from "@/components/ui/toaster";

function ScreenManager() {
  const { currentScreen } = useGame();

  return (
    <AnimatePresence mode="wait">
      {currentScreen === "INTRO_SPLASH" && <IntroSplash key="intro" />}
      {currentScreen === "LOGIN_SIGNUP" && <LoginSignup key="login" />}
      {currentScreen === "AVATAR_SELECTION" && <AvatarSelection key="avatar" />}
      {currentScreen === "MAIN_LOBBY" && <MainLobby key="lobby" />}
      {currentScreen === "GAMEPLAY_HUD" && <GameplayHUD key="gameplay" />}
      {currentScreen === "GAME_OVER" && <GameOver key="gameover" />}
    </AnimatePresence>
  );
}

function App() {
  return (
    <GameProvider>
      <ScreenManager />
      <Toaster />
    </GameProvider>
  );
}

export default App;
