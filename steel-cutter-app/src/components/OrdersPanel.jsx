import { PM } from "../data/profiles.js";
import { C } from "../theme/colors.js";
import { tap } from "../theme/ui.js";
import { formatUrgentCountdown } from "../game/urgentUi.js";
import Button from "./Button.jsx";
import ProfileIcon from "./ProfileIcon.jsx";

export default function OrdersPanel({
  activeOrders,
  clientH,
  getFulP,
  getFulD,
  isReady,
  isPlanned,
  isDragging,
  drag,
  handlePD,
  shipOrder,
  now,
}) {
  return (
    <div style={{ flexShrink: 0, borderBottom: "1px solid " + C.border, background: C.surface }}>
      <div style={{ padding: "4px 10px 2px", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.dim }}>
        COMMANDES
      </div>
      {activeOrders.length === 0 ? (
        <div style={{ padding: "8px 10px 10px", fontSize: 13, color: C.dim }}>Aucune — tapez 📋</div>
      ) : (
        <div style={{ display: "flex", gap: 6, padding: "4px 10px 8px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {activeOrders.map((order) => {
            const fP = getFulP(order);
            const fD = getFulD(order);
            const ready = isReady(order);
            const planned = isPlanned(order);
            const loy = clientH[order.client] || 0;
            const urgent = order.isUrgent && order.expiresAt != null;
            const left = urgent ? formatUrgentCountdown(order.expiresAt, now) : "";
            const lowUrgent = urgent && order.expiresAt - now < 25_000;
            return (
              <div
                key={order.id}
                style={{
                  minWidth: 220,
                  maxWidth: 300,
                  flexShrink: 0,
                  background: C.card,
                  borderRadius: 12,
                  border:
                    "1px solid " +
                    (ready ? C.green + "44" : urgent ? C.red + "55" : planned ? C.gold + "44" : C.border),
                  padding: "8px 10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                    <div style={{ width: 3, height: 22, borderRadius: 2, background: ready ? C.green : order.color }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: ready ? C.green : order.color }}>{order.client}</span>
                    {loy > 0 && <span style={{ fontSize: 9, color: C.gold }}>🤝{loy}</span>}
                    {urgent && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: C.red,
                          background: C.red + "18",
                          padding: "1px 6px",
                          borderRadius: 4,
                        }}
                      >
                        URGENT
                      </span>
                    )}
                  </div>
                  {urgent ? (
                    <span
                      style={{
                        fontSize: 11,
                        color: lowUrgent ? C.red : C.orange,
                        fontWeight: 700,
                        fontFamily: "'Fira Code',monospace",
                      }}
                    >
                      ⏱{left}
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: order.daysLeft <= 1 ? C.red : C.dim, fontWeight: 700 }}>
                      {order.daysLeft}j
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                  {order.pieces.map((p, idx) => {
                    const pD = fD[idx];
                    const pP = fP[idx];
                    const doneD = pD.done >= pD.needed;
                    const doneP = pP.done >= pP.needed;
                    const prof = PM[p.profileId];
                    const bd = isDragging && drag?.orderId === order.id && drag?.pieceIdx === idx;
                    return (
                      <div
                        key={idx}
                        onTouchStart={(e) => {
                          if (!doneP) handlePD(e, order.id, idx, p, order.color);
                        }}
                        onMouseDown={(e) => {
                          if (!doneP) handlePD(e, order.id, idx, p, order.color);
                        }}
                        style={{
                          padding: "5px 7px",
                          borderRadius: 8,
                          background: bd
                            ? order.color + "40"
                            : doneD
                              ? C.green + "10"
                              : doneP
                                ? C.gold + "10"
                                : "rgba(255,255,255,0.02)",
                          border: doneD
                            ? "1px solid " + C.green + "30"
                            : doneP
                              ? "1px solid " + C.gold + "30"
                              : "1px dashed " + order.color + "44",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          cursor: doneP ? "default" : "grab",
                          opacity: bd ? 0.4 : doneD ? 0.5 : 1,
                          ...tap,
                        }}
                      >
                        <ProfileIcon cat={prof?.cat} size={28} style={{ flexShrink: 0 }} />
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              fontFamily: "'Fira Code',monospace",
                              color: doneD ? C.green : C.text,
                            }}
                          >
                            {pD.done}/{p.qty}×{p.length}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: doneD ? C.green : prof?.color }}>{prof?.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.green, fontFamily: "'Fira Code',monospace" }}>
                    {order.reward}€
                  </span>
                  {ready && (
                    <Button
                      onClick={() => shipOrder(order.id)}
                      bg={"linear-gradient(135deg," + C.green + ",#45e888)"}
                      style={{ padding: "5px 12px", fontSize: 12 }}
                    >
                      📦 LIVRER
                    </Button>
                  )}
                  {planned && !ready && (
                    <span style={{ fontSize: 10, color: C.gold, fontWeight: 700 }}>⏳ À débiter</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
