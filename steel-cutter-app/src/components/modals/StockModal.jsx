import { WELD_LOSS } from "../../data/constants.js";
import { PM } from "../../data/profiles.js";
import { C } from "../../theme/colors.js";
import { tap } from "../../theme/ui.js";
import Button from "../Button.jsx";
import ProfileIcon from "../ProfileIcon.jsx";

export default function StockModal({ g }) {
  const {
    hasWelder,
    bars,
    asgn,
    weldSel,
    setWeldSel,
    notify,
    doWeld,
    clientH,
  } = g;
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3, color: C.orange, marginBottom: 10, textAlign: "center" }}>
        INVENTAIRE
      </div>
      {hasWelder && (
        <div style={{ background: C.red + "08", border: "1px solid " + C.red + "25", borderRadius: 12, padding: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 6 }}>
            🔥 SOUDEUSE — 2 chutes même profil (-{WELD_LOSS}mm)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {bars
              .filter((b) => b.isRemnant && (asgn[b.id] || []).length === 0)
              .map((b) => {
                const sel = weldSel.includes(b.id);
                const prof = PM[b.profileId];
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      if (sel) setWeldSel((w) => w.filter((x) => x !== b.id));
                      else if (weldSel.length < 2) {
                        const other = weldSel.length === 1 ? bars.find((x) => x.id === weldSel[0]) : null;
                        if (other && other.profileId !== b.profileId) {
                          notify("Même profil !", "error");
                          return;
                        }
                        setWeldSel((w) => [...w, b.id]);
                      }
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      background: sel ? C.red + "25" : C.card,
                      color: sel ? C.red : prof?.color || C.dim,
                      border: sel ? "2px solid " + C.red : "1px solid " + C.border,
                      cursor: "pointer",
                      fontFamily: "'Fira Code',monospace",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      ...tap,
                    }}
                  >
                    <ProfileIcon cat={prof?.cat} size={18} />
                    {b.remaining}mm
                  </button>
                );
              })}
          </div>
          {weldSel.length === 2 && (
            <Button onClick={doWeld} bg={"linear-gradient(135deg," + C.red + ",#ff6b6b)"} color="#fff" style={{ width: "100%" }}>
              🔥 SOUDER
            </Button>
          )}
        </div>
      )}
      {Object.keys(clientH).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.gold, marginBottom: 4 }}>
            🤝 FIDÉLITÉ (commandes plus grosses)
          </div>
          {Object.entries(clientH)
            .sort((a, b) => b[1] - a[1])
            .map(([cl, cnt]) => (
              <div
                key={cl}
                style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderBottom: "1px solid " + C.border + "22" }}
              >
                <span style={{ fontSize: 12, color: C.text }}>{cl}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>
                  ×{cnt} livraisons → +{Math.floor(cnt * 50)}% qté
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
