export const MAX_BAR = 6000;
/** Prix au kg pour la ferraille (revente chutes) — augmenté en 0.2 */
export const SCRAP_PRICE = 0.22;
/** Bonus revente pour les chutes (isRemnant) */
export const SCRAP_REMNANT_MULT = 1.15;
export const WELD_COST = 18000;
export const WELD_LOSS = 25;

export const GAME_VERSION = "0.2";

/** Multiplicateur de récompense de commande (base plus basse qu’en 0.1) */
export const REWARD_BASE = 0.034;
export const REWARD_PER_REP = 0.0009;
export const REWARD_RAND = 0.007;
export const URGENT_REWARD_MULT = 1.28;
export const URGENT_CHANCE = 0.2;
export const URGENT_MS_MIN = 45_000;
export const URGENT_MS_MAX = 150_000;
/** Pénalité ★ si mission urgente expire (non acceptée) */
export const URGENT_REP_LOSS_PENDING = 3;
/** Pénalité ★ si acceptée mais non livrée à temps */
export const URGENT_REP_LOSS_ACCEPTED = 4;
/** Jours fictifs pour les urgentes (expiration gérée par expiresAt) */
export const URGENT_DAYS_PLACEHOLDER = 999;
