import 'dotenv/config';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dbPath = resolve(process.env.DATABASE_PATH ?? './data/solarwise.sqlite');
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);

db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS custom_appliances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  count REAL NOT NULL DEFAULT 1,
  wattage REAL NOT NULL,
  hours_per_day REAL NOT NULL,
  days_per_month REAL NOT NULL,
  usage_time TEXT NOT NULL,
  is_critical INTEGER NOT NULL DEFAULT 0,
  seasonality TEXT NOT NULL DEFAULT 'year-round',
  high_start_load INTEGER NOT NULL DEFAULT 0,
  certainty TEXT NOT NULL DEFAULT 'approximate',
  work_pattern TEXT NOT NULL DEFAULT 'daily',
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_systems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  input_snapshot TEXT NOT NULL,
  result_snapshot TEXT NOT NULL,
  recommended_power_kwp REAL NOT NULL,
  recommended_battery_kwh REAL NOT NULL,
  system_type TEXT NOT NULL,
  advice TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

for (const statement of [
  "ALTER TABLE custom_appliances ADD COLUMN count REAL NOT NULL DEFAULT 1",
  "ALTER TABLE custom_appliances ADD COLUMN seasonality TEXT NOT NULL DEFAULT 'year-round'",
  "ALTER TABLE custom_appliances ADD COLUMN high_start_load INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE custom_appliances ADD COLUMN certainty TEXT NOT NULL DEFAULT 'approximate'",
  "ALTER TABLE custom_appliances ADD COLUMN work_pattern TEXT NOT NULL DEFAULT 'daily'",
  "ALTER TABLE custom_appliances ADD COLUMN note TEXT NOT NULL DEFAULT ''"
]) {
  try {
    db.exec(statement);
  } catch {
    // Existing local databases already have the column.
  }
}
