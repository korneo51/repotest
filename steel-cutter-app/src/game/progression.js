import { CATS, PM, PROFILES } from "../data/profiles.js";

export function isProfileUnlocked(profileId, day) {
  const p = PM[profileId];
  if (!p) return false;
  const d = Number(day) || 1;
  return d >= (p.minDay ?? 1);
}

/** Profilés disponibles à ce jour (achat + commandes) */
export function getUnlockedProfiles(day) {
  const d = Number(day) || 1;
  return PROFILES.filter((p) => d >= (p.minDay ?? 1));
}

/** Catégories qui ont au moins un profilé débloqué */
export function getUnlockedCategories(day) {
  const unlocked = new Set(getUnlockedProfiles(day).map((p) => p.cat));
  return CATS.filter((c) => unlocked.has(c));
}
