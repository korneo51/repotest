import { SAWS } from "../data/saws.js";
import { C } from "../theme/colors.js";

export default function HudBar({ day, money, rep, cutsToday, sawLv }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 12px",
        background: "rgba(0,0,0,0.4)",
        borderBottom: "1px solid " + C.border,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.accent, letterSpacing: 3 }}>SC</span>
        <span
          style={{
            fontSize: 12,
            color: C.gold,
            fontWeight: 700,
            background: C.gold + "18",
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          J{day}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.green, fontFamily: "'Fira Code',monospace" }}>
          {money}€
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>★{rep}</span>
        <span
          style={{
            fontSize: 11,
            color: cutsToday >= SAWS[sawLv].maxCuts ? C.red : C.dim,
          }}
        >
          ✂{cutsToday}/{SAWS[sawLv].maxCuts === 999 ? "∞" : SAWS[sawLv].maxCuts}
        </span>
      </div>
    </div>
  );
}
