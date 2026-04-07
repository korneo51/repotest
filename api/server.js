const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { stmts } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// POST /login — crée ou récupère un joueur par son pseudo
app.post("/login", (req, res) => {
  const pseudo = (req.body.pseudo || "").trim();
  if (!pseudo || pseudo.length < 2 || pseudo.length > 24) {
    return res.status(400).json({ error: "Pseudo invalide (2-24 caractères)" });
  }

  let player = stmts.getByPseudo.get(pseudo);
  if (!player) {
    const id = uuidv4();
    stmts.insertPlayer.run(id, pseudo);
    player = { id, pseudo };
  }

  const hasSave = !!stmts.hasSave.get(player.id);
  res.json({ id: player.id, pseudo: player.pseudo, hasSave });
});

// GET /save/:playerId — charge la sauvegarde d'un joueur
app.get("/save/:playerId", (req, res) => {
  const row = stmts.getSave.get(req.params.playerId);
  if (!row) return res.status(404).json({ error: "Aucune sauvegarde" });
  try {
    res.json({ saveData: JSON.parse(row.save_data) });
  } catch {
    res.status(500).json({ error: "Sauvegarde corrompue" });
  }
});

// POST /save/:playerId — enregistre la sauvegarde + leaderboard
app.post("/save/:playerId", (req, res) => {
  const { saveData, rep = 0, day = 1, money = 0, pseudo = "" } = req.body;
  if (!saveData) return res.status(400).json({ error: "Données manquantes" });

  const playerId = req.params.playerId;
  stmts.upsertSave.run(playerId, JSON.stringify(saveData));
  if (pseudo) stmts.upsertLeaderboard.run(playerId, pseudo, rep, day, money);
  res.json({ ok: true });
});

// GET /leaderboard — top 20 joueurs
app.get("/leaderboard", (_req, res) => {
  res.json(stmts.getLeaderboard.all());
});

app.listen(PORT, () => {
  console.log(`Steel Cutter API running on port ${PORT}`);
});
