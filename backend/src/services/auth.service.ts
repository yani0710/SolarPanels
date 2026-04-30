import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import type { UserRecord } from '../db/models.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

export function publicUser(user: UserRecord) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.created_at };
}

export function signToken(user: UserRecord) {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
}

export function findUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as UserRecord | undefined;
}

export function findUserById(id: number) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRecord | undefined;
}

export async function createUser(name: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email.toLowerCase(), passwordHash);
  return findUserById(Number(result.lastInsertRowid))!;
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, JWT_SECRET) as { sub?: string | number };
  return { sub: Number(payload.sub) };
}
