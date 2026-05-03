import '../config/env.js';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databasePath = resolve(process.env.DATABASE_PATH ?? './data/solarwise.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });

process.env.DATABASE_URL ??= `file:${databasePath.replace(/\\/g, '/')}`;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const adapter = new PrismaBetterSqlite3({ url: databasePath }, { timestampFormat: 'iso8601' });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function ensureDatabase() {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await prisma.$executeRawUnsafe(`
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
      is_critical BOOLEAN NOT NULL DEFAULT false,
      seasonality TEXT NOT NULL DEFAULT 'year-round',
      high_start_load BOOLEAN NOT NULL DEFAULT false,
      certainty TEXT NOT NULL DEFAULT 'approximate',
      work_pattern TEXT NOT NULL DEFAULT 'daily',
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(`
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
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS assistant_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      guest_id TEXT,
      day_key TEXT NOT NULL,
      question_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS assistant_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      guest_id TEXT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS assistant_usage_user_day_key ON assistant_usage(user_id, day_key)');
  await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS assistant_usage_guest_day_key ON assistant_usage(guest_id, day_key)');
}
