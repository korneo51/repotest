import { useState } from "react";
import { loginPlayer } from "../lib/api.js";
import { CATS } from "../data/profiles.js";
import { GAME_VERSION } from "../data/constants.js";
import { C, CAT_C } from "../theme/colors.js";
import Button from "./Button.jsx";
import FontsLink from "./FontsLink.jsx";
import ProfileIcon from "./ProfileIcon.jsx";

export default function LoginScreen({ onLogin }) {
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const p = pseudo.trim();
    if (!p) return;
    setLoading(true);
    setError("");
    try {
      const player = await loginPlayer(p);
      // Persiste la session dans localStorage
      localStorage.setItem("sc_player", JSON.stringify({ id: player.id, pseudo: player.pseudo }));
      onLogin(player); // { id, pseudo, hasSave }
    } catch (err) {
      setError(err.message || "Connexion impossible");
    } finally {
      setLoading(false);
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

      {/* Titre */}
      <div style={{ fontSize: 34, fontWeight: 700, color: C.accent, letterSpacing: 5, marginBottom: 2, textAlign: "center" }}>
        STEEL CUTTER
      </div>
      <div style={{ fontSize: 17, color: C.gold, letterSpacing: 8, fontWeight: 600, marginBottom: 4 }}>TYCOON</div>
      <div style={{ fontSize: 11, color: C.dim, letterSpacing: 2, marginBottom: 22 }}>v{GAME_VERSION}</div>

      {/* Icônes profils */}
      <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
        {CATS.map((cat) => (
          <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <ProfileIcon cat={cat} size={38} />
            <span style={{ fontSize: 9, color: CAT_C[cat], fontWeight: 600 }}>{cat}</span>
          </div>
        ))}
      </div>

      {/* Formulaire login */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 320,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid " + C.border,
          borderRadius: 16,
          padding: "24px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: C.bright, textAlign: "center", letterSpacing: 2 }}>
          CONNEXION
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, color: C.dim, letterSpacing: 1 }}>PSEUDO</label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            maxLength={24}
            placeholder="Ton pseudo (2-24 car.)"
            autoComplete="off"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid " + C.border,
              borderRadius: 8,
              padding: "10px 12px",
              color: C.bright,
              fontSize: 15,
              fontFamily: "'Chakra Petch',sans-serif",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <div style={{ fontSize: 12, color: C.red, textAlign: "center", fontWeight: 600 }}>{error}</div>
        )}

        <Button
          type="submit"
          disabled={loading || pseudo.trim().length < 2}
          bg={"linear-gradient(135deg," + C.gold + ",#ffcc44)"}
          style={{
            fontSize: 15,
            padding: "13px 0",
            letterSpacing: 3,
            opacity: loading || pseudo.trim().length < 2 ? 0.5 : 1,
            cursor: loading || pseudo.trim().length < 2 ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Connexion…" : "JOUER ▶"}
        </Button>

        <div style={{ fontSize: 11, color: C.dim, textAlign: "center", lineHeight: 1.6 }}>
          Nouveau pseudo = nouveau compte.<br />Pseudo existant = reprise de ta partie.
        </div>
      </form>
    </div>
  );
}
