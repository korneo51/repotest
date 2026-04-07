import { useSteelGame } from "../game/useSteelGame.js";
import GameScreen from "./GameScreen.jsx";
import LoginScreen from "./LoginScreen.jsx";
import MenuScreen from "./MenuScreen.jsx";

export default function GameContainer() {
  const g = useSteelGame();
  if (g.scr === "login") return <LoginScreen onLogin={g.setPlayer} />;
  if (g.scr === "menu")  return <MenuScreen g={g} />;
  return <GameScreen g={g} />;
}
