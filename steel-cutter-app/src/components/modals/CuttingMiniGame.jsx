import { useEffect, useRef, useState } from "react";
import { SAWS } from "../../data/saws.js";
import { C } from "../../theme/colors.js";

/**
 * Mini-jeu de découpe : power-bar timing.
 * Le curseur oscille de gauche à droite. Le joueur clique pour l'arrêter.
 * Zone verte (35-65%) → fee × 0.5 (Parfait)
 * Zone jaune (20-35% / 65-80%) → fee × 1.0 (Correct)
 * Zone rouge (0-20% / 80-100%) → fee × 1.8 (Raté)
 */
export default function CuttingMiniGame({ miniGame, sawLv, onComplete }) {
  const { barId, numCuts, fee } = miniGame;
  const [cursorPct, setCursorPct] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null); // { label, mult, color }
  const animRef = useRef(null);
  const startTimeRef = useRef(null);
  // Période complète (aller-retour) en ms : plus rapide avec scie circulaire
  const period = sawLv === 0 ? 2000 : sawLv === 1 ? 1600 : 1200;

  useEffect(() => {
    if (done) return;
    const animate = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      // Oscillation sinusoïdale 0→100→0
      const raw = Math.sin((elapsed / period) * Math.PI);
      setCursorPct(Math.abs(raw) * 100);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [done, period]);

  const handleCut = () => {
    if (done) return;
    cancelAnimationFrame(animRef.current);
    setDone(true);
    let mult, label, color;
    if (cursorPct >= 35 && cursorPct <= 65) {
      mult = 0.5;
      label = "Parfait !";
      color = C.green;
    } else if (cursorPct >= 20 && cursorPct <= 80) {
      mult = 1.0;
      label = "Correct";
      color = C.gold;
    } else {
      mult = 1.8;
      label = "Raté…";
      color = C.red;
    }
    setResult({ label, mult, color });
    setTimeout(() => onComplete(barId, mult), 700);
  };

  const finalFee = result ? Math.round(fee * result.mult) : fee;

  return (
    <div
      onClick={!done ? handleCut : undefined}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        cursor: done ? "default" : "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div
        style={{
          background: C.card,
          border: "1px solid " + C.border,
          borderRadius: 16,
          padding: "28px 32px",
          width: "min(360px, 90vw)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titre */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, fontFamily: "'Chakra Petch',sans-serif" }}>
            ✂ DÉCOUPE
          </div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>
            {SAWS[sawLv].n} · {numCuts} coupe{numCuts > 1 ? "s" : ""}
          </div>
        </div>

        {/* Barre de précision */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 44,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid " + C.border,
          }}
        >
          {/* Zone rouge gauche */}
          <div style={{ position: "absolute", left: 0, top: 0, width: "20%", height: "100%", background: C.red + "55" }} />
          {/* Zone jaune gauche */}
          <div style={{ position: "absolute", left: "20%", top: 0, width: "15%", height: "100%", background: C.gold + "55" }} />
          {/* Zone verte */}
          <div style={{ position: "absolute", left: "35%", top: 0, width: "30%", height: "100%", background: C.green + "55" }} />
          {/* Zone jaune droite */}
          <div style={{ position: "absolute", left: "65%", top: 0, width: "15%", height: "100%", background: C.gold + "55" }} />
          {/* Zone rouge droite */}
          <div style={{ position: "absolute", left: "80%", top: 0, width: "20%", height: "100%", background: C.red + "55" }} />

          {/* Labels zones */}
          <div style={{ position: "absolute", left: "37%", top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 800, color: C.green, fontFamily: "'Chakra Petch',sans-serif" }}>PERFECT</div>

          {/* Curseur */}
          <div
            style={{
              position: "absolute",
              left: cursorPct + "%",
              top: 0,
              width: 3,
              height: "100%",
              background: "#fff",
              boxShadow: "0 0 8px #fff",
              transform: "translateX(-50%)",
              transition: done ? "none" : undefined,
            }}
          />
        </div>

        {/* Résultat ou instruction */}
        {result ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: result.color, fontFamily: "'Chakra Petch',sans-serif" }}>
              {result.label}
            </div>
            <div style={{ fontSize: 14, color: C.text, marginTop: 6 }}>
              Coût : <span style={{ color: result.color, fontWeight: 700 }}>{finalFee}€</span>
              {result.mult < 1 && <span style={{ color: C.green, fontSize: 12 }}> (économie !)</span>}
              {result.mult > 1 && <span style={{ color: C.red, fontSize: 12 }}> (surcoût)</span>}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: C.text }}>Arrêtez le curseur dans la zone verte</div>
            <button
              onClick={handleCut}
              style={{
                marginTop: 14,
                padding: "12px 36px",
                borderRadius: 10,
                background: C.gold + "22",
                border: "2px solid " + C.gold + "66",
                color: C.gold,
                fontSize: 16,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "'Chakra Petch',sans-serif",
                letterSpacing: 1,
              }}
            >
              ✂ COUPER
            </button>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>
              Coût estimé : {fee}€ · Tap ou clic n&apos;importe où
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
