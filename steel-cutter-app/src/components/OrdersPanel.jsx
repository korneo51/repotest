import { PM } from "../data/profiles.js";
import { C } from "../theme/colors.js";
import { tap } from "../theme/ui.js";
import { formatUrgentCountdown } from "../game/urgentUi.js";
import Button from "./Button.jsx";
import ProfileIcon from "./ProfileIcon.jsx";

export default function OrdersPanel({
  activeOrders,
  pendingOrders,
  clientH,
  getFulP,
  getFulD,
  isReady,
  isPlanned,
  isDragging,
  drag,
  handlePD,
  shipOrder,
  acceptOrder,
  declineOrder,
  now,
}) {
  const hasAny = pendingOrders.length > 0 || activeOrders.length > 0;
  return (
    <div style={{ flexShrink: 0, borderBottom: "1px solid " + C.border, background: C.surface }}>
      <div style={{ padding: "4px 10px 2px", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.dim }}>
        COMMANDES
      </div>
      {!hasAny ? (
        <div style={{ padding: "8px 10px 10px", fontSize: 13, color: C.dim }}>Aucune commande</div>
      ) : (
        <div style={{ display: "flex", gap: 6, padding: "4px 10px 8px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>

          {/* Commandes en attente */}
          {pendingOrders.map((o) => {
            const urgent = o.isUrgent && o.expiresAt != null;
            const left = urgent ? formatUrgentCountdown(o.expiresAt, now) : "";
            const low = urgent && o.expiresAt - now < 25_000;
            const loy = clientH[o.client] || 0;
            return (
              <div
                key={o.id}
                style={{
                  minWidth: 220,
                  maxWidth: 280,
                  flexShrink: 0,
                  background: urgent ? C.red + "08" : C.card,
                  borderRadius: 12,
                  border: "1.5px dashed " + (urgent ? C.red + "88" : o.color + "66"),
                  padding: "8px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {/* En-tête */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: C.dim }}>NOUVEAU</span>
                      {urgent && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: C.red, background: C.red + "18", padding: "1px 5px", borderRadius: 4 }}>
                          URGENT
                        </span>
                      )}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: urgent ? C.red : o.color }}>
                      {o.client}{loy > 0 ? " 🤝" : ""}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {urgent ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: low ? C.red : C.orange, fontFamily: "'Fira Code',monospace" }}>⏱ {left}</span>
                    ) : (
                      <span style={{ fontSize: 10, color: C.dim }}>délai {o.deadline}j</span>
                    )}
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.green, fontFamily: "'Fira Code',monospace" }}>+{o.reward}€</div>
                  </div>
                </div>

                {/* Pièces */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {o.pieces.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "4px 7px",
                        borderRadius: 7,
                        background: o.color + "10",
                        border: "1px solid " + o.color + "20",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <ProfileIcon cat={PM[p.profileId]?.cat} size={22} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: o.color, fontFamily: "'Fira Code',monospace" }}>
                          {p.qty}× {p.length}mm
                        </div>
                        <div style={{ fontSize: 10, color: PM[p.profileId]?.color }}>{PM[p.profileId]?.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Boutons */}
                <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                  <Button
                    onClick={() => acceptOrder(o.id)}
                    bg={"linear-gradient(135deg," + C.green + ",#45e888)"}
                    style={{ flex: 1, padding: "7px 0", fontSize: 12 }}
                  >
                    ✓ Accepter
                  </Button>
                  <Button
                    onClick={() => declineOrder(o.id)}
                    bg={C.red + "15"}
                    color={C.red}
                    style={{ flex: 1, padding: "7px 0", fontSize: 12, border: "1px solid " + C.red + "35" }}
                  >
                    ✕ Refuser
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Séparateur si les deux listes sont non vides */}
          {pendingOrders.length > 0 && activeOrders.length > 0 && (
            <div style={{ width: 1, background: C.border, flexShrink: 0, alignSelf: "stretch", margin: "0 2px" }} />
          )}

          {/* Commandes actives */}
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

