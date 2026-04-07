import { C } from "../theme/colors.js";
import { tap } from "../theme/ui.js";

export default function ActionBar({ onShop, onStock, onUpgrades, onOptions, onEndDay }) {
  const items = [
    { l: "🏪", a: onShop, c: C.gold },
    { l: "📦", a: onStock, c: C.orange },
    { l: "⚙", a: onUpgrades, c: C.purple },
    { l: "⚡", a: onOptions, c: C.dim },
    { l: "▶ Jour suiv.", a: onEndDay, c: C.green },
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
            fontFamily: "'Chakra Petch',sans-serif",
            ...tap,
          }}
        >
          {b.l}
        </button>
      ))}
    </div>
  );
}
