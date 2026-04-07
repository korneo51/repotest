const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { stmts } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET;
if (isProd && !JWT_SECRET) {
  console.error("FATAL: définir JWT_SECRET en production");
  process.exit(1);
}
const jwtSecret = JWT_SECRET || "dev-only-steelcutter-jwt-ne-pas-utiliser-en-prod";
const JWT_EXPIRES = "30d";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function validPseudo(p) {
  return typeof p === "string" && p.length >= 2 && p.length <= 24;
}

function validPassword(p) {
  return typeof p === "string" && p.length >= 8 && p.length <= 128;
}

function issueToken(playerId) {
  return jwt.sign({ sub: playerId }, jwtSecret, { expiresIn: JWT_EXPIRES });
}

function playerPayload(row) {
  const hasSave = !!stmts.hasSave.get(row.id);
  return { id: row.id, pseudo: row.pseudo, hasSave };
}

function requireAuth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  try {
    const payload = jwt.verify(h.slice(7), jwtSecret);
    if (!payload.sub) return res.status(401).json({ error: "Session invalide" });
    req.playerId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Session invalide ou expirée" });
  }
}

// --- Auth (rate-limited) ---
app.post("/register", authLimiter, (req, res) => {
  const pseudo = (req.body.pseudo || "").trim();
  const password = req.body.password;
  if (!validPseudo(pseudo)) {
    return res.status(400).json({ error: "Pseudo invalide (2-24 caractères)" });
  }
  if (!validPassword(password)) {
    return res.status(400).json({ error: "Mot de passe invalide (8-128 caractères)" });
  }
  if (stmts.getByPseudo.get(pseudo)) {
    return res.status(409).json({ error: "Ce pseudo est déjà pris" });
  }
  const id = uuidv4();
  const hash = bcrypt.hashSync(password, 10);
  stmts.insertPlayer.run(id, pseudo, hash);
  const row = { id, pseudo };
  const token = issueToken(id);
  res.status(201).json({ token, player: playerPayload(row) });
});

app.post("/login", authLimiter, (req, res) => {
  const pseudo = (req.body.pseudo || "").trim();
  const password = req.body.password;
  if (!validPseudo(pseudo)) {
    return res.status(400).json({ error: "Pseudo invalide (2-24 caractères)" });
  }
  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "Mot de passe requis" });
  }
  const row = stmts.getByPseudo.get(pseudo);
  if (!row) {
    return res.status(401).json({ error: "Pseudo ou mot de passe incorrect" });
  }
  if (row.password_hash == null || row.password_hash === "") {
    return res.status(403).json({
      error: "Compte créé avant les mots de passe : définis-en un pour continuer.",
      code: "NEEDS_PASSWORD",
    });
  }
  if (!bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: "Pseudo ou mot de passe incorrect" });
  }
  const token = issueToken(row.id);
  res.json({ token, player: playerPayload(row) });
});

/** Comptes legacy (password_hash NULL) : premier mot de passe */
app.post("/set-password", authLimiter, (req, res) => {
  const pseudo = (req.body.pseudo || "").trim();
  const password = req.body.password;
  if (!validPseudo(pseudo)) {
    return res.status(400).json({ error: "Pseudo invalide (2-24 caractères)" });
  }
  if (!validPassword(password)) {
    return res.status(400).json({ error: "Mot de passe invalide (8-128 caractères)" });
  }
  const row = stmts.getByPseudo.get(pseudo);
  if (!row) {
    return res.status(404).json({ error: "Pseudo introuvable" });
  }
  if (row.password_hash != null && row.password_hash !== "") {
    return res.status(400).json({ error: "Ce compte a déjà un mot de passe — connecte-toi." });
  }
  const hash = bcrypt.hashSync(password, 10);
  const info = stmts.setPasswordHash.run(hash, row.id);
  if (info.changes === 0) {
    return res.status(400).json({ error: "Impossible de définir le mot de passe" });
  }
  const updated = stmts.getByPseudo.get(pseudo);
  const token = issueToken(updated.id);
  res.json({ token, player: playerPayload(updated) });
});

app.get("/auth/me", requireAuth, (req, res) => {
  const row = stmts.getById.get(req.playerId);
  if (!row) return res.status(401).json({ error: "Joueur introuvable" });
  res.json(playerPayload(row));
});

// --- Sauvegardes (JWT uniquement) ---
app.get("/save", requireAuth, (req, res) => {
  const row = stmts.getSave.get(req.playerId);
  if (!row) return res.status(404).json({ error: "Aucune sauvegarde" });
  try {
    res.json({ saveData: JSON.parse(row.save_data) });
  } catch {
    res.status(500).json({ error: "Sauvegarde corrompue" });
  }
});

app.post("/save", requireAuth, (req, res) => {
  const { saveData, rep = 0, day = 1, money = 0, pseudo = "" } = req.body;
  if (!saveData) return res.status(400).json({ error: "Données manquantes" });
  const playerId = req.playerId;
  stmts.upsertSave.run(playerId, JSON.stringify(saveData));
  const row = stmts.getById.get(playerId);
  const name = (pseudo || row?.pseudo || "").trim();
  if (name) stmts.upsertLeaderboard.run(playerId, name, rep, day, money);
  res.json({ ok: true });
});

// Ancienne API : désactivée
app.get("/save/:playerId", (_req, res) => {
  res.status(401).json({ error: "Connexion requise (session JWT)" });
});
app.post("/save/:playerId", (_req, res) => {
  res.status(401).json({ error: "Connexion requise (session JWT)" });
});

app.get("/leaderboard", (_req, res) => {
  res.json(stmts.getLeaderboard.all());
});

app.listen(PORT, () => {
  console.log(`Steel Cutter API running on port ${PORT}`);
});
