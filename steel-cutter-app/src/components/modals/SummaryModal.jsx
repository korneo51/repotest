import { C } from "../../theme/colors.js";
import Button from "../Button.jsx";

export default function SummaryModal({ g }) {
  const { day, dayLog, setModal } = g;
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3, color: C.gold, marginBottom: 12, textAlign: "center" }}>
        FIN DU JOUR {day - 1}
      </div>
      {dayLog.map((l, i) => (
        <div
          key={i}
          style={{
            fontSize: 14,
            fontWeight: 600,
            padding: "10px 14px",
            borderRadius: 10,
            marginBottom: 4,
            background: C.card,
            color: l.ty === "error" ? C.red : l.ty === "warn" ? C.orange : C.dim,
            border: "1px solid " + C.border,
          }}
        >
          {l.t}
        </div>
      ))}
      {dayLog.length === 0 && (
        <div style={{ color: C.dim, textAlign: "center", padding: 16, fontSize: 14 }}>RAS.</div>
      )}
      <Button
        onClick={() => setModal(null)}
        bg={"linear-gradient(135deg," + C.gold + ",#ffcc44)"}
        style={{ width: "100%", marginTop: 10, padding: 14, fontSize: 16, letterSpacing: 2 }}
      >
        CONTINUER ▶
      </Button>
    </div>
  );
}
