import { WELD_COST, WELD_LOSS } from "../../data/constants.js";
import { SAWS } from "../../data/saws.js";
import { STOS } from "../../data/storage.js";
import { SUP_LV } from "../../data/supplier.js";
import { C } from "../../theme/colors.js";
import Button from "../Button.jsx";

export default function UpgradesModal({ g }) {
  const {
    hasWelder,
    money,
    setMoney,
    setHasWelder,
    notify,
    supLv,
    setSupLv,
    sawLv,
    setSawLv,
    stoLv,
    setStoLv,
  } = g;
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3, color: C.purple, marginBottom: 10, textAlign: "center" }}>
        AMÉLIORATIONS
      </div>
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          marginBottom: 8,
          background: hasWelder ? C.red + "0d" : C.card,
          border: "1px solid " + (hasWelder ? C.red + "44" : C.border),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: hasWelder ? C.red : C.text }}>🔥 Soudeuse</div>
          <div style={{ fontSize: 10, color: C.dim }}>Ressouder 2 chutes (-{WELD_LOSS}mm)</div>
        </div>
        {!hasWelder ? (
          <Button
            disabled={money < WELD_COST}
            onClick={() => {
              setMoney((m) => m - WELD_COST);
              setHasWelder(true);
              notify("Soudeuse !", "success");
            }}
            bg={money >= WELD_COST ? "linear-gradient(135deg," + C.gold + ",#ffcc44)" : "#111e2e"}
          >
            {WELD_COST}€
          </Button>
        ) : (
          <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>ACHETÉ</span>
        )}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: 2, marginBottom: 6 }}>🤝 FOURNISSEUR</div>
      {SUP_LV.map((u, i) => (
        <div
          key={i}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            marginBottom: 4,
            background: i === supLv ? C.purple + "0d" : C.card,
            border: "1px solid " + (i === supLv ? C.purple + "44" : C.border),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: i < supLv ? 0.3 : 1,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: i === supLv ? C.purple : C.text }}>
              {i === supLv ? "▶ " : ""}
              {u.i} {u.n}
            </div>
            <div style={{ fontSize: 10, color: C.dim }}>-{u.d}%</div>
          </div>
          {i === supLv + 1 && (
            <Button
              disabled={money < u.c}
              onClick={() => {
                setMoney((m) => m - u.c);
                setSupLv(i);
                notify(u.n, "success");
              }}
              bg={money >= u.c ? "linear-gradient(135deg," + C.gold + ",#ffcc44)" : "#111e2e"}
            >
              {u.c}€
            </Button>
          )}
          {i === supLv && <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>ACTUEL</span>}
        </div>
      ))}
      <div style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: 2, margin: "8px 0 6px" }}>🔧 SCIE</div>
      {SAWS.map((u, i) => (
        <div
          key={i}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            marginBottom: 4,
            background: i === sawLv ? C.accent + "0d" : C.card,
            border: "1px solid " + (i === sawLv ? C.accent + "44" : C.border),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: i < sawLv ? 0.3 : 1,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: i === sawLv ? C.accent : C.text }}>
              {i === sawLv ? "▶ " : ""}
              {u.n}
            </div>
            <div style={{ fontSize: 10, color: C.dim }}>
              {u.desc} · {u.daily}€/j
            </div>
          </div>
          {i === sawLv + 1 && (
            <Button
              disabled={money < u.cost}
              onClick={() => {
                setMoney((m) => m - u.cost);
                setSawLv(i);
                notify(u.n, "success");
              }}
              bg={money >= u.cost ? "linear-gradient(135deg," + C.gold + ",#ffcc44)" : "#111e2e"}
            >
              {u.cost}€
            </Button>
          )}
          {i === sawLv && <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>ACTUEL</span>}
        </div>
      ))}
      <div style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: 2, margin: "8px 0 6px" }}>🏭 STOCKAGE</div>
      {STOS.map((u, i) => (
        <div
          key={i}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            marginBottom: 4,
            background: i === stoLv ? C.accent + "0d" : C.card,
            border: "1px solid " + (i === stoLv ? C.accent + "44" : C.border),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: i < stoLv ? 0.3 : 1,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: i === stoLv ? C.accent : C.text }}>
              {i === stoLv ? "▶ " : ""}
              {u.n}
            </div>
            <div style={{ fontSize: 10, color: C.dim }}>
              {u.m} places · {u.daily}€/j
            </div>
          </div>
          {i === stoLv + 1 && (
            <Button
              disabled={money < u.c}
              onClick={() => {
                setMoney((m) => m - u.c);
                setStoLv(i);
                notify(u.n, "success");
              }}
              bg={money >= u.c ? "linear-gradient(135deg," + C.gold + ",#ffcc44)" : "#111e2e"}
            >
              {u.c}€
            </Button>
          )}
          {i === stoLv && <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>ACTUEL</span>}
        </div>
      ))}
    </div>
  );
}
