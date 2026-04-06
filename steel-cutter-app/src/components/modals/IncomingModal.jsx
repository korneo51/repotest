import { PM } from "../../data/profiles.js";
import { C } from "../../theme/colors.js";
import { formatUrgentCountdown } from "../../game/urgentUi.js";
import Button from "../Button.jsx";
import ProfileIcon from "../ProfileIcon.jsx";

export default function IncomingModal({ g }) {
  const { pendingOrders, clientH, acceptOrder, declineOrder, now } = g;
  if (pendingOrders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 30, color: C.dim, fontSize: 14 }}>Aucune nouvelle commande</div>
    );
  }
  return pendingOrders.map((o) => {
    const urgent = o.isUrgent && o.expiresAt != null;
    const left = urgent ? formatUrgentCountdown(o.expiresAt, now) : "";
    const low = urgent && o.expiresAt - now < 25_000;
    return (
      <div
        key={o.id}
        style={{
          padding: 14,
          background: C.card,
          borderRadius: 14,
          marginBottom: 8,
          borderLeft: "4px solid " + (urgent ? C.red : o.color),
          boxShadow: urgent ? "0 0 0 1px " + C.red + "33" : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "flex-start", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: urgent ? C.red : o.color }}>
              {o.client}
              {(clientH[o.client] || 0) > 0 ? " 🤝" : ""}
              {urgent && (
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: C.red }}>URGENT</span>
              )}
            </span>
            {urgent && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: low ? C.red : C.orange,
                  fontFamily: "'Fira Code',monospace",
                }}
              >
                ⏱ {left}
              </span>
            )}
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.green, fontFamily: "'Fira Code',monospace", flexShrink: 0 }}>
            +{o.reward}€
          </span>
        </div>
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>
          {urgent ? "Livrez avant expiration du timer" : "Délai : " + o.deadline + "j"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {o.pieces.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                background: o.color + "10",
                border: "1px solid " + o.color + "20",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ProfileIcon cat={PM[p.profileId]?.cat} size={30} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: o.color, fontFamily: "'Fira Code',monospace" }}>
                  {p.qty}× {p.length}mm
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: PM[p.profileId]?.color }}>{PM[p.profileId]?.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => acceptOrder(o.id)} bg={"linear-gradient(135deg," + C.green + ",#45e888)"} style={{ flex: 1, padding: 12, fontSize: 15 }}>
            Accepter
          </Button>
          <Button
            onClick={() => declineOrder(o.id)}
            bg={C.red + "20"}
            color={C.red}
            style={{ flex: 1, padding: 12, fontSize: 15, border: "1px solid " + C.red + "40" }}
          >
            Refuser
          </Button>
        </div>
      </div>
    );
  });
}
