import { CLIENTS, OC } from "../data/clientsAndColors.js";
import { PM, PROFILES } from "../data/profiles.js";
import { uid } from "./ids.js";

export function genOrders(day, rep, ch) {
  const n = Math.min(2 + Math.floor(day / 3), 6);
  const used = new Set();
  const pool = [...CLIENTS];
  Object.entries(ch).forEach(([cl, cnt]) => {
    for (let i = 0; i < Math.min(cnt, 3); i++) pool.push(cl);
  });
  return Array.from({ length: n }, (_, i) => {
    let cl;
    do {
      cl = pool[Math.floor(Math.random() * pool.length)];
    } while (used.has(cl));
    used.add(cl);
    const avail = PROFILES.filter((_, idx) => idx < 4 + Math.floor(day / 2));
    const loyaltyQty = ch[cl] || 0;
    const pieces = Array.from({ length: 1 + Math.floor(Math.random() * (2 + Math.floor(day / 4))) }, () => {
      const prof = avail[Math.floor(Math.random() * avail.length)];
      const baseQty = 1 + Math.floor(Math.random() * (2 + Math.floor(day / 6)));
      const bonusQty = Math.floor(loyaltyQty * 0.5);
      return {
        profileId: prof.id,
        length: Math.min(Math.round((120 + Math.random() * (300 + day * 30)) / 10) * 10, 3500),
        qty: baseQty + bonusQty,
      };
    });
    const tot = pieces.reduce((s, p) => s + p.length * p.qty * PM[p.profileId].pm, 0);
    return {
      id: uid(),
      client: cl,
      pieces,
      reward: Math.round(tot * (0.055 + rep * 0.002 + Math.random() * 0.015)),
      deadline: 2 + Math.floor(Math.random() * 3),
      daysLeft: 2 + Math.floor(Math.random() * 3),
      color: OC[i % OC.length],
      accepted: false,
    };
  });
}
