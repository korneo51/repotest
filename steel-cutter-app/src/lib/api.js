const BASE = "/api";

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur réseau" }));
    throw new Error(err.error || "Erreur API");
  }
  return res.json();
}

/** Crée ou récupère un joueur par son pseudo. Retourne {id, pseudo, hasSave} */
export async function loginPlayer(pseudo) {
  return req("POST", "/login", { pseudo });
}

/** Charge la sauvegarde du joueur. Retourne {saveData} ou lance une erreur 404. */
export async function loadSave(playerId) {
  return req("GET", `/save/${playerId}`);
}

/** Enregistre la partie et met à jour le leaderboard. */
export async function uploadSave(playerId, saveData, { rep, day, money, pseudo }) {
  return req("POST", `/save/${playerId}`, { saveData, rep, day, money, pseudo });
}

/** Retourne le top 20 du classement [{pseudo, rep, day, money}]. */
export async function getLeaderboard() {
  return req("GET", "/leaderboard");
}
