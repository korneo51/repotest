import { C } from "../theme/colors.js";
import { tap } from "../theme/ui.js";

export default function Button({ children, onClick, disabled, bg, color, style: sx }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "'Chakra Petch',sans-serif",
        color: disabled ? "#3a4a5a" : color || "#000",
        background: disabled ? "#111e2e" : bg || C.gold,
        border: "none",
        borderRadius: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        minHeight: 40,
        letterSpacing: 1,
        ...tap,
        ...sx,
      }}
    >
      {children}
    </button>
  );
}
