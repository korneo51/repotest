import { CATS, PM, PROFILES } from "../data/profiles.js";

export function isProfileUnlocked(profileId, rep) {
  const p = PM[profileId];
  if (!p) return false;
  return rep >= (p.minRep ?? 0);
}

/** Profilés achetables / utilisables en commande à cette réputation */
export function getUnlockedProfiles(rep) {
  return PROFILES.filter((p) => rep >= (p.minRep ?? 0));
}

/** Catégories qui ont au moins un profilé débloqué */
export function getUnlockedCategories(rep) {
  const unlocked = new Set(getUnlockedProfiles(rep).map((p) => p.cat));
  return CATS.filter((c) => unlocked.has(c));
}
