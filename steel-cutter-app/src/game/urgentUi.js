/** Compte à rebours MM:SS pour missions urgentes */
export function formatUrgentCountdown(expiresAt, nowMs) {
  if (expiresAt == null) return "";
  const s = Math.max(0, Math.ceil((expiresAt - nowMs) / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
