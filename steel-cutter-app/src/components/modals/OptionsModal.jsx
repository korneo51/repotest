import { SAWS } from "../../data/saws.js";
import { C } from "../../theme/colors.js";
import Button from "../Button.jsx";

export default function OptionsModal({ g }) {
  const {
    day,
    money,
    rep,
    bars,
    maxB,
    sawLv,
    cutsToday,
    disc,
    hasWelder,
    clientH,
    cheatAmt,
    setCheatAmt,
    setMoney,
    notify,
    gameVersion,
  } = g;
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3, color: C.dim, marginBottom: 12, textAlign: "center" }}>
        OPTIONS
      </div>
      <div style={{ background: C.card, borderRadius: 12, padding: 14, border: "1px solid " + C.border, marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 8 }}>💰 Ajouter de l'argent (cheat)</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            value={cheatAmt}
            onChange={(e) => setCheatAmt(e.target.value)}
            placeholder="Montant"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid " + C.border,
              background: C.bg,
              color: C.bright,
              fontSize: 15,
              fontFamily: "'Fira Code',monospace",
              outline: "none",
            }}
          />
          <Button
            onClick={() => {
              const v = parseInt(cheatAmt, 10);
              if (v > 0) {
                setMoney((m) => m + v);
                notify("💰 +" + v + "€", "success");
                setCheatAmt("");
              }
            }}
            bg={C.gold}
            style={{ fontSize: 14 }}
          >
            +
          </Button>
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 12, padding: 14, border: "1px solid " + C.border }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>📊 Stats</div>
        {[
          ["Version", "v" + gameVersion],
          ["Jour", day],
          ["Argent", money + "€"],
          ["Réputation", "★" + rep],
          ["Barres", bars.length + "/" + maxB],
          ["Chutes", bars.filter((b) => b.isRemnant).length],
          ["Scie", SAWS[sawLv].n],
          ["Coupes aujourd'hui", cutsToday + "/" + SAWS[sawLv].maxCuts],
          ["Remise fournisseur", disc + "%"],
          ["Soudeuse", hasWelder ? "Oui" : "Non"],
          ["Clients fidèles", Object.keys(clientH).length],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid " + C.border + "22" }}
          >
            <span style={{ fontSize: 12, color: C.dim }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.bright, fontFamily: "'Fira Code',monospace" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
