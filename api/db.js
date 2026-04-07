const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "game.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id   TEXT PRIMARY KEY,
    pseudo TEXT UNIQUE NOT NULL COLLATE NOCASE,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS saves (
    player_id TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
    save_data TEXT NOT NULL,
    updated_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    player_id TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
    pseudo    TEXT NOT NULL,
    rep       INTEGER DEFAULT 0,
    day       INTEGER DEFAULT 1,
    money     INTEGER DEFAULT 0,
    updated_at INTEGER DEFAULT (unixepoch())
  );
`);

try {
  db.exec(`ALTER TABLE players ADD COLUMN password_hash TEXT`);
} catch (e) {
  if (!String(e.message).includes("duplicate column name")) throw e;
}

const stmts = {
  getByPseudo: db.prepare("SELECT * FROM players WHERE pseudo = ? COLLATE NOCASE"),
  getById: db.prepare("SELECT id, pseudo, password_hash FROM players WHERE id = ?"),
  insertPlayer: db.prepare(
    "INSERT INTO players (id, pseudo, password_hash) VALUES (?, ?, ?)"
  ),
  setPasswordHash: db.prepare(
    "UPDATE players SET password_hash = ? WHERE id = ? AND password_hash IS NULL"
  ),
  hasSave: db.prepare("SELECT 1 FROM saves WHERE player_id = ?"),
  getSave: db.prepare("SELECT save_data FROM saves WHERE player_id = ?"),
  upsertSave: db.prepare(`
    INSERT INTO saves (player_id, save_data, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(player_id) DO UPDATE SET save_data = excluded.save_data, updated_at = unixepoch()
  `),
  upsertLeaderboard: db.prepare(`
    INSERT INTO leaderboard (player_id, pseudo, rep, day, money, updated_at)
    VALUES (?, ?, ?, ?, ?, unixepoch())
    ON CONFLICT(player_id) DO UPDATE SET
      pseudo = excluded.pseudo,
      rep = excluded.rep,
      day = excluded.day,
      money = excluded.money,
      updated_at = unixepoch()
  `),
  getLeaderboard: db.prepare(`
    SELECT pseudo, rep, day, money
    FROM leaderboard
    ORDER BY rep DESC, day ASC, money DESC
    LIMIT 20
  `),
};

module.exports = { stmts };
