import { useSteelGame } from "../game/useSteelGame.js";
import GameScreen from "./GameScreen.jsx";
import MenuScreen from "./MenuScreen.jsx";

export default function GameContainer() {
  const g = useSteelGame();
  if (g.scr === "menu") {
    return <MenuScreen onStart={g.startGame} />;
  }
  return <GameScreen g={g} />;
}
