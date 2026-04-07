const BASE = "/api";
const SESSION_KEY = "sc_session";

export function getStoredSession() {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("sc_player");
}

async function throwParsedError(res) {
  const err = await res.json().catch(() => ({ error: "Erreur réseau" }));
  const e = new Error(err.error || "Erreur API");
  if (err.code) e.code = err.code;
  throw e;
}

async function reqPublic(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body != null ? { "Content-Type": "application/json" } : {},
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) await throwParsedError(res);
  return res.json();
}

async function reqAuth(method, path, body) {
  const token = getStoredSession()?.token;
  if (!token) throw new Error("Non connecté");
  const res = await fetch(BASE + path, {
    method,
    headers: {
      ...(body != null ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) await throwParsedError(res);
  if (res.status === 204) return undefined;
  const text = await res.text();
  return text ? JSON.parse(text) : undefined;
}

/** Valide le JWT et retourne { id, pseudo, hasSave } */
export async function fetchAuthMe() {
  return reqAuth("GET", "/auth/me");
}

/** Inscription — enregistre la session et retourne le joueur */
export async function registerPlayer(pseudo, password) {
  const data = await reqPublic("POST", "/register", { pseudo, password });
  setStoredSession({ token: data.token, player: data.player });
  return data.player;
}

/** Connexion — enregistre la session et retourne le joueur */
export async function loginPlayer(pseudo, password) {
  const data = await reqPublic("POST", "/login", { pseudo, password });
  setStoredSession({ token: data.token, player: data.player });
  return data.player;
}

/** Compte legacy sans mot de passe — définit le MDP puis session */
export async function setPasswordForLegacy(pseudo, password) {
  const data = await reqPublic("POST", "/set-password", { pseudo, password });
  setStoredSession({ token: data.token, player: data.player });
  return data.player;
}

/** Charge la sauvegarde (JWT). Retourne { saveData } */
export async function loadSave() {
  return reqAuth("GET", "/save");
}

/** Enregistre la partie (JWT). */
export async function uploadSave(saveData, { rep, day, money, pseudo }) {
  return reqAuth("POST", "/save", { saveData, rep, day, money, pseudo });
}

export async function getLeaderboard() {
  const res = await fetch(BASE + "/leaderboard");
  if (!res.ok) await throwParsedError(res);
  return res.json();
}
