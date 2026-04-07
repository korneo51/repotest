import { SCRAP_REMNANT_MULT, SCRAP_VALUE_RATIO } from "../data/constants.js";
import { PM } from "../data/profiles.js";

/** Masse en kg pour une longueur donnée (kgm = kg par mètre linéaire) */
export function massKg(profileId, lengthMm) {
  const p = PM[profileId];
  if (!p) return 0;
  return p.kgm * (lengthMm / 1000);
}

/**
 * Prix d'achat neuf arrondi à l'euro (remise fournisseur en %).
 */
export function buyPriceRounded(profId, lengthMm, discountPct) {
  const p = PM[profId];
  if (!p || p.buyEurKg == null) return 999;
  const kg = massKg(profId, lengthMm);
  if (kg <= 0) return 999;
  const raw = kg * p.buyEurKg * (1 - discountPct / 100);
  return Math.max(1, Math.round(raw));
}

/**
 * Prix catalogue sans remise (pour barré dans le magasin).
 */
export function listPriceRounded(profId, lengthMm) {
  const p = PM[profId];
  if (!p || p.buyEurKg == null) return 0;
  const kg = massKg(profId, lengthMm);
  return Math.max(1, Math.round(kg * p.buyEurKg));
}

/**
 * Valeur ferraille arrondie à l'euro, liée au prix matière du profilé.
 */
export function scrapValueRounded(bar) {
  const p = PM[bar.profileId];
  if (!p || p.buyEurKg == null) return 0;
  const kg = massKg(bar.profileId, bar.remaining);
  if (kg <= 0) return 0;
  let v = kg * p.buyEurKg * SCRAP_VALUE_RATIO;
  if (bar.isRemnant) v *= SCRAP_REMNANT_MULT;
  return Math.max(1, Math.round(v));
}
