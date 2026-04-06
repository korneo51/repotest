import { GAME_VERSION } from "../data/constants.js";
import { CATS } from "../data/profiles.js";
import { C, CAT_C } from "../theme/colors.js";
import Button from "./Button.jsx";
import FontsLink from "./FontsLink.jsx";
import ProfileIcon from "./ProfileIcon.jsx";

export default function MenuScreen({ onStart }) {
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
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: C.accent,
          letterSpacing: 5,
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        STEEL CUTTER
      </div>
      <div
        style={{
          fontSize: 18,
          color: C.gold,
          letterSpacing: 8,
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        TYCOON
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: 2, marginBottom: 24 }}>v{GAME_VERSION}</div>
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        {CATS.map((cat) => (
          <div key={cat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <ProfileIcon cat={cat} size={44} />
            <span style={{ fontSize: 10, color: CAT_C[cat], fontWeight: 600 }}>{cat}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 340,
          textAlign: "center",
          lineHeight: 1.8,
          fontSize: 14,
          color: C.dim,
          marginBottom: 28,
        }}
      >
        Planifiez, débitez, livrez. Soudez vos chutes, négociez avec vos fournisseurs.
      </div>
      <Button
        onClick={onStart}
        bg={"linear-gradient(135deg," + C.gold + ",#ffcc44)"}
        style={{ fontSize: 17, padding: "16px 60px", letterSpacing: 4, boxShadow: "0 0 30px rgba(255,184,0,.3)" }}
      >
        JOUER
      </Button>
    </div>
  );
}
