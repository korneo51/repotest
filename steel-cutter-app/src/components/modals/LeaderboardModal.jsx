import { useEffect, useState } from "react";
import { getLeaderboard } from "../../lib/api.js";
import { C } from "../../theme/colors.js";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardModal({ player }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeaderboard()
      .then(setRows)
      .catch(() => setError("Impossible de charger le classement"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 3,
          color: C.gold,
          textAlign: "center",
          marginBottom: 16,
          fontFamily: "'Chakra Petch',sans-serif",
        }}
      >
        🏆 CLASSEMENT
      </div>

      {loading && (
        <div style={{ textAlign: "center", color: C.dim, padding: 24, fontSize: 13 }}>Chargement…</div>
      )}

      {error && (
        <div style={{ textAlign: "center", color: C.red, padding: 16, fontSize: 13 }}>{error}</div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div style={{ textAlign: "center", color: C.dim, padding: 24, fontSize: 13 }}>
          Aucun joueur encore classé
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* En-tête */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 48px 44px 72px",
              gap: 6,
              padding: "4px 8px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              color: C.dim,
            }}
          >
            <span>#</span>
            <span>PSEUDO</span>
            <span style={{ textAlign: "center" }}>★</span>
            <span style={{ textAlign: "center" }}>JOUR</span>
            <span style={{ textAlign: "right" }}>ARGENT</span>
          </div>

          {rows.map((row, i) => {
            const isMe = player && row.pseudo.toLowerCase() === player.pseudo.toLowerCase();
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr 48px 44px 72px",
                  gap: 6,
                  padding: "8px 8px",
                  borderRadius: 8,
                  background: isMe ? C.gold + "12" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  border: isMe ? "1px solid " + C.gold + "30" : "1px solid transparent",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <span style={{ fontSize: i < 3 ? 15 : 12, color: i < 3 ? undefined : C.dim, textAlign: "center" }}>
                  {i < 3 ? MEDALS[i] : i + 1}
                </span>
                <span
                  style={{
                    fontWeight: isMe ? 800 : 600,
                    color: isMe ? C.gold : C.bright,
                    fontFamily: "'Chakra Petch',sans-serif",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.pseudo}
                  {isMe && <span style={{ fontSize: 9, color: C.gold, marginLeft: 4 }}>← toi</span>}
                </span>
                <span
                  style={{
                    textAlign: "center",
                    fontWeight: 700,
                    color: C.accent,
                    fontFamily: "'Fira Code',monospace",
                  }}
                >
                  {row.rep}★
                </span>
                <span style={{ textAlign: "center", color: C.dim, fontSize: 12, fontFamily: "'Fira Code',monospace" }}>
                  J{row.day}
                </span>
                <span
                  style={{
                    textAlign: "right",
                    color: C.green,
                    fontFamily: "'Fira Code',monospace",
                    fontSize: 12,
                  }}
                >
                  {row.money}€
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
