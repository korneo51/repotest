import { MAX_BAR } from "../data/constants.js";
import { CATS, PM } from "../data/profiles.js";
import { SAWS } from "../data/saws.js";
import { STOS } from "../data/storage.js";
import { canFitPiece, getUsed, getUsedForAdd } from "../game/barMath.js";
import { C, CAT_C } from "../theme/colors.js";
import { tap } from "../theme/ui.js";
import ProfileIcon from "./ProfileIcon.jsx";

export default function BarsPanel({
  bars,
  maxB,
  barFilter,
  setBarFilter,
  barSort,
  setBarSort,
  grouped,
  collapsed,
  setCollapsed,
  asgn,
  sw,
  sawLv,
  stoLv,
  dropTarget,
  drag,
  dragProfId,
  regBar,
  debitBar,
  scrapBar,
  removeAssign,
  getScrapVal,
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          gap: 3,
          padding: "5px 8px",
          overflowX: "auto",
          flexShrink: 0,
          borderBottom: "1px solid " + C.border + "66",
        }}
      >
        {["all", ...CATS].map((f) => {
          const active = barFilter === f;
          const col = f === "all" ? C.accent : CAT_C[f];
          return (
            <button
              key={f}
              onClick={() => setBarFilter(f)}
              style={{
                padding: "3px 8px",
                borderRadius: 6,
                fontSize: 10,
                fontWeight: 700,
                whiteSpace: "nowrap",
                background: active ? col + "20" : "transparent",
                color: active ? col : C.dim,
                border: "1px solid " + (active ? col + "40" : C.border),
                cursor: "pointer",
                minHeight: 28,
                fontFamily: "'Chakra Petch',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 2,
                ...tap,
              }}
            >
              {f !== "all" && <ProfileIcon cat={f} size={14} />}
              {f === "all" ? "Tout" : f}
            </button>
          );
        })}
        <div style={{ width: 1, background: C.border, margin: "0 1px", flexShrink: 0 }} />
        {[
          { k: "profile", l: "Profil" },
          { k: "diameter", l: "Taille" },
          { k: "length", l: "Long." },
        ].map((s) => (
          <button
            key={s.k}
            onClick={() => setBarSort(s.k)}
            style={{
              padding: "3px 7px",
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 700,
              background: barSort === s.k ? C.purple + "20" : "transparent",
              color: barSort === s.k ? C.purple : C.dim,
              border: "1px solid " + (barSort === s.k ? C.purple + "40" : C.border),
              cursor: "pointer",
              minHeight: 28,
              fontFamily: "'Chakra Petch',sans-serif",
              ...tap,
            }}
          >
            ↕{s.l}
          </button>
        ))}
        <span style={{ fontSize: 10, color: C.dim, padding: "4px 6px", whiteSpace: "nowrap" }}>
          {bars.length}/{maxB}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "6px 8px 12px", WebkitOverflowScrolling: "touch" }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: "center", padding: 24, color: C.dim, fontSize: 13 }}>
            {bars.length === 0 ? "Aucune barre — 🏪" : "Aucun résultat"}
          </div>
        ) : (
          Object.entries(grouped).map(([pid, barsG]) => {
            const prof = PM[pid];
            if (!prof) return null;
            const ic = collapsed[pid];
            const isMatch = dragProfId === pid;
            return (
              <div
                key={pid}
                style={{
                  marginBottom: 5,
                  background: isMatch ? prof.color + "08" : C.card,
                  borderRadius: 12,
                  border: "1px solid " + (isMatch ? prof.color + "44" : C.border),
                  overflow: "hidden",
                }}
              >
                <div
                  onClick={() => setCollapsed((p) => ({ ...p, [pid]: !p[pid] }))}
                  style={{
                    padding: "7px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    background: "rgba(0,0,0,0.15)",
                    ...tap,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ProfileIcon cat={prof.cat} size={32} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: prof.color }}>{prof.label}</div>
                      <div style={{ fontSize: 10, color: C.dim }}>
                        {barsG.length} barre{barsG.length > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      color: C.dim,
                      transform: ic ? "rotate(-90deg)" : "",
                      transition: "transform .15s",
                    }}
                  >
                    ▼
                  </span>
                </div>
                {!ic && (
                  <div style={{ padding: "4px 6px 6px" }}>
                    {barsG.map((bar) => {
                      const ba = asgn[bar.id] || [];
                      const used = getUsed(ba, bar.remaining, sw);
                      const rem = bar.remaining - used;
                      const hasUncut = ba.some((a) => !a.debited);
                      const isTarget = dropTarget === bar.id;
                      const cf = drag && dragProfId === pid && canFitPiece(ba, drag.piece.length, bar.remaining, sw);
                      const gaugeW = Math.max(20, Math.round((bar.remaining / MAX_BAR) * 100));
                      return (
                        <div
                          key={bar.id}
                          ref={(el) => regBar(bar.id, el)}
                          style={{
                            padding: "6px 8px",
                            marginBottom: 3,
                            borderRadius: 10,
                            background: isTarget && cf ? C.green + "12" : isTarget ? C.red + "08" : "rgba(0,0,0,0.1)",
                            border:
                              isTarget && cf ? "2px solid " + C.green + "55" : "1px solid " + C.border + "44",
                            animation: isTarget && cf ? "dropGlow .8s ease infinite" : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 3,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              {bar.isRemnant && (
                                <span
                                  style={{
                                    fontSize: 9,
                                    padding: "1px 5px",
                                    borderRadius: 4,
                                    background: C.orange + "20",
                                    color: C.orange,
                                    fontWeight: 700,
                                  }}
                                >
                                  CHUTE
                                </span>
                              )}
                              <span
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: C.bright,
                                  fontFamily: "'Fira Code',monospace",
                                }}
                              >
                                {bar.remaining}mm
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              {hasUncut && (
                                <button
                                  onClick={() => debitBar(bar.id)}
                                  style={{
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    background: C.gold + "20",
                                    border: "1px solid " + C.gold + "40",
                                    color: C.gold,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "'Chakra Petch',sans-serif",
                                    ...tap,
                                  }}
                                >
                                  ✂ DÉBITER
                                </button>
                              )}
                              {ba.length === 0 && (
                                <button
                                  onClick={() => scrapBar(bar.id)}
                                  style={{
                                    padding: "3px 8px",
                                    borderRadius: 6,
                                    background: C.orange + "10",
                                    border: "1px solid " + C.orange + "25",
                                    color: C.orange,
                                    fontSize: 10,
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    ...tap,
                                  }}
                                >
                                  ♻{Math.round(getScrapVal(bar))}€
                                </button>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              width: gaugeW + "%",
                              height: 26,
                              background: "#070d16",
                              borderRadius: 5,
                              position: "relative",
                              overflow: "hidden",
                              border: "1px solid " + C.border,
                            }}
                          >
                            {
                              ba.reduce(
                                (acc, a, i) => {
                                  const sc = 1 / bar.remaining;
                                  const x = acc.off;
                                  const w = a.length * sc * 100;
                                  const isLast = i === ba.length - 1;
                                  const pf = isLast && bar.remaining - acc.tl - a.length === 0;
                                  const ww = pf ? 0 : sw * sc * 100;
                                  acc.tl += a.length + (pf ? 0 : sw);
                                  acc.els.push(
                                    <div
                                      key={"p" + i}
                                      style={{
                                        position: "absolute",
                                        left: x + "%",
                                        top: 0,
                                        width: w + "%",
                                        height: "100%",
                                        background: a.debited
                                          ? "linear-gradient(180deg," + a.color + "77," + a.color + "33)"
                                          : "repeating-linear-gradient(135deg," +
                                            a.color +
                                            "33," +
                                            a.color +
                                            "33 3px," +
                                            a.color +
                                            "18 3px," +
                                            a.color +
                                            "18 6px)",
                                        borderRight: "1px solid " + a.color + "88",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {w > 5 && (
                                        <span
                                          style={{
                                            fontSize: 8,
                                            color: "#fff",
                                            fontWeight: 700,
                                            fontFamily: "'Fira Code',monospace",
                                          }}
                                        >
                                          {a.length}
                                        </span>
                                      )}
                                    </div>,
                                  );
                                  if (ww > 0.3)
                                    acc.els.push(
                                      <div
                                        key={"w" + i}
                                        style={{
                                          position: "absolute",
                                          left: x + w + "%",
                                          top: 0,
                                          width: ww + "%",
                                          height: "100%",
                                          background:
                                            "repeating-linear-gradient(45deg,#401515,#401515 2px,#301010 2px,#301010 4px)",
                                        }}
                                      />,
                                    );
                                  acc.off = x + w + ww;
                                  return acc;
                                },
                                { off: 0, els: [], tl: 0 },
                              ).els
                            }
                            {isTarget && cf && drag && (
                              <div
                                style={{
                                  position: "absolute",
                                  left: (getUsedForAdd(ba, sw) / bar.remaining) * 100 + "%",
                                  top: 0,
                                  width: (drag.piece.length / bar.remaining) * 100 + "%",
                                  height: "100%",
                                  background: drag.orderColor + "33",
                                  border: "1px dashed " + drag.orderColor + "88",
                                }}
                              />
                            )}
                            {rem > 10 && ba.length > 0 && (
                              <div
                                style={{
                                  position: "absolute",
                                  right: 3,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  fontSize: 8,
                                  color: C.dim,
                                  fontFamily: "'Fira Code',monospace",
                                }}
                              >
                                {rem}
                              </div>
                            )}
                          </div>
                          {ba.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 3 }}>
                              {ba.map((a) => (
                                <div
                                  key={a.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    padding: "2px 5px",
                                    borderRadius: 4,
                                    background: a.debited ? a.color + "15" : a.color + "08",
                                    border: "1px solid " + (a.debited ? a.color + "33" : a.color + "15"),
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 600,
                                      color: a.debited ? a.color : C.dim,
                                      fontFamily: "'Fira Code',monospace",
                                    }}
                                  >
                                    {a.length}
                                    {a.debited ? "✓" : ""}
                                  </span>
                                  {!a.debited && (
                                    <button
                                      onClick={() => removeAssign(bar.id, a.id)}
                                      style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 4,
                                        background: "rgba(255,0,0,0.1)",
                                        border: "none",
                                        color: C.red,
                                        fontSize: 11,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        ...tap,
                                      }}
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
        {SAWS[sawLv].daily + STOS[stoLv].daily > 0 && (
          <div style={{ textAlign: "center", padding: "4px", fontSize: 10, color: C.dim }}>
            Coût/jour : {SAWS[sawLv].daily + STOS[stoLv].daily}€
          </div>
        )}
      </div>
    </div>
  );
}
