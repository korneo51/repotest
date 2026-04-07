import { CLIENTS, OC } from "../data/clientsAndColors.js";
import { PM, PROFILES } from "../data/profiles.js";
import {
  REWARD_BASE,
  REWARD_PER_REP,
  REWARD_RAND,
  URGENT_CHANCE,
  URGENT_DAYS_PLACEHOLDER,
  URGENT_MS_MAX,
  URGENT_MS_MIN,
  URGENT_REWARD_MULT,
} from "../data/constants.js";
import { getUnlockedProfiles } from "./progression.js";
import { uid } from "./ids.js";

function pickReward(tot, rep, isUrgent) {
  const base = tot * (REWARD_BASE + rep * REWARD_PER_REP + Math.random() * REWARD_RAND);
  const r = Math.round(isUrgent ? base * URGENT_REWARD_MULT : base);
  return Math.max(1, r);
}

export function genOrders(day, rep, ch) {
  const n = Math.min(2 + Math.floor(day / 3), 6);
  const used = new Set();
  const pool = [...CLIENTS];
  Object.entries(ch).forEach(([cl, cnt]) => {
    for (let i = 0; i < Math.min(cnt, 3); i++) pool.push(cl);
  });

  let unlocked = getUnlockedProfiles(day);
  if (unlocked.length === 0) unlocked = [PROFILES[0]];

  return Array.from({ length: n }, (_, i) => {
    let cl;
    do {
      cl = pool[Math.floor(Math.random() * pool.length)];
    } while (used.has(cl));
    used.add(cl);

    const loyaltyQty = ch[cl] || 0;
    const isUrgent = Math.random() < URGENT_CHANCE;
    const expiresAt = isUrgent ? Date.now() + URGENT_MS_MIN + Math.random() * (URGENT_MS_MAX - URGENT_MS_MIN) : null;

    const pieces = Array.from({ length: 1 + Math.floor(Math.random() * (2 + Math.floor(day / 4))) }, () => {
      const prof = unlocked[Math.floor(Math.random() * unlocked.length)];
      const baseQty = 1 + Math.floor(Math.random() * (2 + Math.floor(day / 6)));
      const bonusQty = Math.floor(loyaltyQty * 0.5);
      return {
        profileId: prof.id,
        length: Math.min(Math.round((120 + Math.random() * (300 + day * 30)) / 10) * 10, 3500),
        qty: baseQty + bonusQty,
      };
    });
    const tot = pieces.reduce((s, p) => s + p.length * p.qty * PM[p.profileId].pm, 0);

    const deadline = isUrgent ? 0 : 2 + Math.floor(Math.random() * 3);
    const daysLeft = isUrgent ? URGENT_DAYS_PLACEHOLDER : 2 + Math.floor(Math.random() * 3);

    return {
      id: uid(),
      client: cl,
      pieces,
      reward: pickReward(tot, rep, isUrgent),
      deadline,
      daysLeft,
      color: OC[i % OC.length],
      accepted: false,
      isUrgent,
      expiresAt,
    };
  });
}
