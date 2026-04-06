export default function ProfileIcon({ cat, size = 36, style: sx }) {
  if (cat === "Tube rond")
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" style={sx}>
        <circle cx="20" cy="20" r="16" fill="none" stroke="#38bdf8" strokeWidth="3" />
        <circle cx="20" cy="20" r="9" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity=".5" />
      </svg>
    );
  if (cat === "Tube carré")
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" style={sx}>
        <rect x="5" y="5" width="30" height="30" rx="2" fill="none" stroke="#a78bfa" strokeWidth="3" />
        <rect x="11" y="11" width="18" height="18" rx="1" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity=".5" />
      </svg>
    );
  if (cat === "IPN")
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" style={sx}>
        <path
          d="M8 6h24v5H25v18h7v5H8v-5h7V11H8z"
          fill="none"
          stroke="#fb7185"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (cat === "UPN")
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" style={sx}>
        <path
          d="M8 6h5v28H8zM27 6h5v28h-5zM13 29h14v5H13z"
          fill="none"
          stroke="#f97316"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (cat === "Fer plat")
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" style={sx}>
        <rect x="4" y="14" width="32" height="12" rx="2" fill="none" stroke="#34d399" strokeWidth="2.5" />
      </svg>
    );
  return null;
}
