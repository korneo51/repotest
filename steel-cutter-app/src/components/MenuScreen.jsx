import { useState } from "react";
import { GAME_VERSION } from "../data/constants.js";
import { CATS } from "../data/profiles.js";
import { C, CAT_C } from "../theme/colors.js";
import { loadSave as apiLoadSave } from "../lib/api.js";
import Button from "./Button.jsx";
import FontsLink from "./FontsLink.jsx";
import ProfileIcon from "./ProfileIcon.jsx";

export default function MenuScreen({ g }) {
  const { player, remoteSave, startGame, loadSave, logout, setModal } = g;
  const [resuming, setResuming] = useState(false);
  const [resumeError, setResumeError] = useState("");

  const handleResume = async () => {
    setResuming(true);
    setResumeError("");
    try {
      const { saveData } = await apiLoadSave();
      loadSave(saveData);
    } catch (e) {
      setResumeError("Impossible de charger la sauvegarde");
    } finally {
      setResuming(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        background: "radial-gradient(ellipse at 50% 30%,#0f2a44,#060c14 60%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Chakra Petch',sans-serif",
        color: C.text,
        padding: 20,
      }}
    >
      <FontsLink />

      {/* Pseudo connecté */}
      {player && (
        <div style={{ position: "absolute", top: 14, right: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.dim }}>
            👤 <span style={{ color: C.gold, fontWeight: 700 }}>{player.pseudo}</span>
          </span>
          <button
            onClick={logout}
            style={{ fontSize: 10, color: C.dim, background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ fontSize: 36, fontWeight: 700, color: C.accent, letterSpacing: 5, marginBottom: 2, textAlign: "center" }}>
        STEEL CUTTER
      </div>
      <div style={{ fontSize: 18, color: C.gold, letterSpacing: 8, fontWeight: 600, marginBottom: 6 }}>TYCOON</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: 2, marginBottom: 24 }}>v{GAME_VERSION}</div>

      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        {CATS.map((cat) => (
          <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <ProfileIcon cat={cat} size={44} />
            <span style={{ fontSize: 10, color: CAT_C[cat], fontWeight: 600 }}>{cat}</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 340, textAlign: "center", lineHeight: 1.8, fontSize: 14, color: C.dim, marginBottom: 28 }}>
        Planifiez, débitez, livrez. Soudez vos chutes, négociez avec vos fournisseurs.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
        {/* Reprendre — visible seulement si sauvegarde existante */}
        {remoteSave && (
          <>
            <Button
              onClick={handleResume}
              disabled={resuming}
              bg={"linear-gradient(135deg," + C.accent + ",#44ddff)"}
              style={{ fontSize: 15, padding: "14px 0", letterSpacing: 3, opacity: resuming ? 0.6 : 1 }}
            >
              {resuming ? "Chargement…" : "▶ REPRENDRE"}
            </Button>
            {resumeError && <div style={{ fontSize: 11, color: C.red, textAlign: "center" }}>{resumeError}</div>}
          </>
        )}

        {/* Nouvelle partie */}
        <Button
          onClick={startGame}
          bg={"linear-gradient(135deg," + C.gold + ",#ffcc44)"}
          style={{ fontSize: remoteSave ? 13 : 17, padding: remoteSave ? "11px 0" : "16px 0", letterSpacing: 3, boxShadow: "0 0 30px rgba(255,184,0,.3)" }}
        >
          {remoteSave ? "✦ NOUVELLE PARTIE" : "JOUER"}
        </Button>

        {/* Classement */}
        <Button
          onClick={() => setModal("leaderboard")}
          bg={C.purple + "20"}
          color={C.purple}
          style={{ fontSize: 13, padding: "11px 0", letterSpacing: 2, border: "1px solid " + C.purple + "40" }}
        >
          🏆 CLASSEMENT
        </Button>
      </div>
    </div>
  );
}
