import { useState } from "react";
import { registerPlayer } from "../lib/api.js";
import { CATS } from "../data/profiles.js";
import { GAME_VERSION } from "../data/constants.js";
import { C, CAT_C } from "../theme/colors.js";
import Button from "./Button.jsx";
import FontsLink from "./FontsLink.jsx";
import ProfileIcon from "./ProfileIcon.jsx";

const field = (C) => ({
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
});

export default function RegisterScreen({ onRegistered, onSwitchLogin }) {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const p = pseudo.trim();
    if (password !== password2) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      setError("Mot de passe : au moins 8 caractères");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const player = await registerPlayer(p, password);
      onRegistered(player);
    } catch (err) {
      setError(err.message || "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  const okLen = pseudo.trim().length >= 2 && password.length >= 8 && password === password2;

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

      <div style={{ fontSize: 34, fontWeight: 700, color: C.accent, letterSpacing: 5, marginBottom: 2, textAlign: "center" }}>
        STEEL CUTTER
      </div>
      <div style={{ fontSize: 17, color: C.gold, letterSpacing: 8, fontWeight: 600, marginBottom: 4 }}>TYCOON</div>
      <div style={{ fontSize: 11, color: C.dim, letterSpacing: 2, marginBottom: 22 }}>v{GAME_VERSION}</div>

      <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
        {CATS.map((cat) => (
          <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <ProfileIcon cat={cat} size={38} />
            <span style={{ fontSize: 9, color: CAT_C[cat], fontWeight: 600 }}>{cat}</span>
          </div>
        ))}
      </div>

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
          CRÉER UN COMPTE
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, color: C.dim, letterSpacing: 1 }}>PSEUDO</label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            maxLength={24}
            placeholder="2-24 caractères"
            autoComplete="username"
            style={field(C)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, color: C.dim, letterSpacing: 1 }}>MOT DE PASSE</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={128}
            placeholder="Au moins 8 caractères"
            autoComplete="new-password"
            style={field(C)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, color: C.dim, letterSpacing: 1 }}>CONFIRMER</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            maxLength={128}
            autoComplete="new-password"
            style={field(C)}
          />
        </div>

        {error && (
          <div style={{ fontSize: 12, color: C.red, textAlign: "center", fontWeight: 600 }}>{error}</div>
        )}

        <Button
          type="submit"
          disabled={loading || !okLen}
          bg={"linear-gradient(135deg," + C.gold + ",#ffcc44)"}
          style={{
            fontSize: 15,
            padding: "13px 0",
            letterSpacing: 3,
            opacity: loading || !okLen ? 0.5 : 1,
            cursor: loading || !okLen ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Création…" : "S'INSCRIRE"}
        </Button>

        <button
          type="button"
          onClick={onSwitchLogin}
          style={{
            fontSize: 12,
            color: C.accent,
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            letterSpacing: 1,
          }}
        >
          Déjà un compte ? Connexion
        </button>
      </form>
    </div>
  );
}
