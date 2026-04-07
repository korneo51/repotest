import { C } from "../theme/colors.js";
import { tap } from "../theme/ui.js";

function IconLightning() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08-.07-.11C8.5 10.5 10.5 7 12 3c.35.89 1.2 2.63 2 4.36.75 1.61 1 2.64 1 3.64 0 .47-.11.92-.29 1.33L11 21z"
      />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.07.64-.07.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"
      />
    </svg>
  );
}

export default function ActionBar({ onShop, onStock, onUpgrades, onOptions, onLeaderboard, onEndDay }) {
  const items = [
    { id: "shop", label: "🏪", a: onShop, c: C.gold },
    { id: "stock", label: "📦", a: onStock, c: C.orange },
    { id: "upgrades", label: <IconLightning />, a: onUpgrades, c: C.gold, title: "Améliorations" },
    { id: "leader", label: "🏆", a: onLeaderboard, c: C.accent },
    { id: "options", label: <IconGear />, a: onOptions, c: C.purple, title: "Options" },
    { id: "end", label: "▶ Jour suiv.", a: onEndDay, c: C.green },
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
          key={b.id}
          type="button"
          title={b.title}
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
            minWidth: 36,
            fontFamily: "'Chakra Petch',sans-serif",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...tap,
          }}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
