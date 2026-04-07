import { useState } from "react";
import { loginPlayer, setPasswordForLegacy } from "../lib/api.js";
import { CATS } from "../data/profiles.js";
import { GAME_VERSION } from "../data/constants.js";
import { C, CAT_C } from "../theme/colors.js";
import Button from "./Button.jsx";
import FontsLink from "./FontsLink.jsx";
import ProfileIcon from "./ProfileIcon.jsx";

const inputStyle = (C) => ({
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

export default function LoginScreen({ onLogin, onSwitchRegister }) {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [legacyMode, setLegacyMode] = useState(false);
  const [legacyPseudo, setLegacyPseudo] = useState("");
  const [legacyPass, setLegacyPass] = useState("");
  const [legacyPass2, setLegacyPass2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();
    const p = pseudo.trim();
    if (p.length < 2 || password.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const player = await loginPlayer(p, password);
      onLogin(player);
    } catch (err) {
      if (err.code === "NEEDS_PASSWORD") {
        setLegacyMode(true);
        setLegacyPseudo(p);
        setLegacyPass("");
        setLegacyPass2("");
        setError("");
      } else {
        setError(err.message || "Connexion impossible");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitLegacy = async (e) => {
    e.preventDefault();
    if (legacyPass.length < 8) {
      setError("Mot de passe : au moins 8 caractères");
      return;
    }
    if (legacyPass !== legacyPass2) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const player = await setPasswordForLegacy(legacyPseudo.trim(), legacyPass);
      setLegacyMode(false);
      onLogin(player);
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer le mot de passe");
    } finally {
      setLoading(false);
    }
  };

  if (legacyMode) {
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
        <div style={{ fontSize: 28, fontWeight: 700, color: C.accent, marginBottom: 8, textAlign: "center" }}>
          Sécuriser le compte
        </div>
        <div style={{ fontSize: 13, color: C.dim, maxWidth: 320, textAlign: "center", marginBottom: 20, lineHeight: 1.5 }}>
          Le pseudo <span style={{ color: C.gold, fontWeight: 700 }}>{legacyPseudo}</span> existe déjà sans mot de passe.
          Choisis-en un pour continuer (8 caractères min.).
        </div>
        <form
          onSubmit={submitLegacy}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: C.dim }}>MOT DE PASSE</label>
            <input
              type="password"
              value={legacyPass}
              onChange={(e) => setLegacyPass(e.target.value)}
              autoComplete="new-password"
              style={inputStyle(C)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: C.dim }}>CONFIRMER</label>
            <input
              type="password"
              value={legacyPass2}
              onChange={(e) => setLegacyPass2(e.target.value)}
              autoComplete="new-password"
              style={inputStyle(C)}
            />
          </div>
          {error && <div style={{ fontSize: 12, color: C.red, textAlign: "center", fontWeight: 600 }}>{error}</div>}
          <Button
            type="submit"
            disabled={loading || legacyPass.length < 8}
            bg={"linear-gradient(135deg," + C.gold + ",#ffcc44)"}
            style={{ fontSize: 15, padding: "13px 0", letterSpacing: 3 }}
          >
            {loading ? "Enregistrement…" : "VALIDER"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setLegacyMode(false);
              setError("");
            }}
            style={{ fontSize: 12, color: C.dim, background: "none", border: "none", cursor: "pointer" }}
          >
            ← Retour
          </button>
        </form>
      </div>
    );
  }

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
        onSubmit={submitLogin}
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
            placeholder="Ton pseudo"
            autoComplete="username"
            style={inputStyle(C)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, color: C.dim, letterSpacing: 1 }}>MOT DE PASSE</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={128}
            autoComplete="current-password"
            style={inputStyle(C)}
          />
        </div>

        {error && <div style={{ fontSize: 12, color: C.red, textAlign: "center", fontWeight: 600 }}>{error}</div>}

        <Button
          type="submit"
          disabled={loading || pseudo.trim().length < 2 || password.length === 0}
          bg={"linear-gradient(135deg," + C.gold + ",#ffcc44)"}
          style={{
            fontSize: 15,
            padding: "13px 0",
            letterSpacing: 3,
            opacity: loading || pseudo.trim().length < 2 || password.length === 0 ? 0.5 : 1,
            cursor: loading || pseudo.trim().length < 2 || password.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Connexion…" : "JOUER ▶"}
        </Button>

        <button
          type="button"
          onClick={onSwitchRegister}
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
          Pas encore de compte ? Inscription
        </button>
      </form>
    </div>
  );
}
