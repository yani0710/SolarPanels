import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import '../config/env.js';
import { prisma } from '../db/prisma.js';
import type { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

export function publicUser(user: User) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() };
}

export function signToken(user: User) {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(name: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.create({ data: { name, email: email.toLowerCase(), passwordHash } });
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, JWT_SECRET) as { sub?: string | number };
  return { sub: Number(payload.sub) };
}
