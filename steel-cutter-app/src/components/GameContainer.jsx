import { useState, useEffect } from "react";
import { useSteelGame } from "../game/useSteelGame.js";
import GameScreen from "./GameScreen.jsx";
import LoginScreen from "./LoginScreen.jsx";
import RegisterScreen from "./RegisterScreen.jsx";
import MenuScreen from "./MenuScreen.jsx";

export default function GameContainer() {
  const g = useSteelGame();
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    if (g.scr === "login") setAuthMode("login");
  }, [g.scr]);

  if (g.scr === "login") {
    if (authMode === "register") {
      return (
        <RegisterScreen
          onRegistered={g.setPlayer}
          onSwitchLogin={() => setAuthMode("login")}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={g.setPlayer}
        onSwitchRegister={() => setAuthMode("register")}
      />
    );
  }
  if (g.scr === "menu") return <MenuScreen g={g} />;
  return <GameScreen g={g} />;
}
