import 'dotenv/config';
import { resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

const databasePath = resolve(process.env.DATABASE_PATH ?? './backend/data/solarwise.sqlite').replace(/\\/g, '/');

export default defineConfig({
  schema: 'backend/prisma/schema.prisma',
  migrations: {
    path: 'backend/prisma/migrations'
  },
  datasource: {
    url: process.env.DATABASE_URL ?? `file:${databasePath}`
  }
});
