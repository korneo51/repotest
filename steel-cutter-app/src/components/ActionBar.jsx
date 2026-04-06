import { C } from "../theme/colors.js";
import { tap } from "../theme/ui.js";

export default function ActionBar({ pendingCount, onIncoming, onShop, onStock, onUpgrades, onOptions, onEndDay }) {
  const items = [
    { l: "📋", a: onIncoming, b: pendingCount, c: C.accent },
    { l: "🏪", a: onShop, b: 0, c: C.gold },
    { l: "📦", a: onStock, b: 0, c: C.orange },
    { l: "⚙", a: onUpgrades, b: 0, c: C.purple },
    { l: "⚡", a: onOptions, b: 0, c: C.dim },
    { l: "▶ Jour suiv.", a: onEndDay, b: 0, c: C.green },
  ];
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        padding: "4px 8px",
        borderBottom: "1px solid " + C.border,
        background: C.surface,
        flexShrink: 0,
        overflowX: "auto",
      }}
    >
      {items.map((b) => (
        <button
          key={b.l}
          onClick={b.a}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
            background: b.c + "10",
            color: b.c,
            border: "1px solid " + b.c + "25",
            cursor: "pointer",
            minHeight: 32,
            position: "relative",
            fontFamily: "'Chakra Petch',sans-serif",
            ...tap,
          }}
        >
          {b.l}
          {b.b > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: C.red,
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "pulse 1.5s infinite",
              }}
            >
              {b.b}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
