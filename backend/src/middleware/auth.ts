import type { NextFunction, Request, Response } from 'express';
import { findUserById, verifyToken } from '../services/auth.service.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Моля, влезте в профила си.' });
  try {
    const payload = verifyToken(token);
    const user = findUserById(Number(payload.sub));
    if (!user) return res.status(401).json({ message: 'Профилът не е намерен.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Сесията е изтекла. Влезте отново.' });
  }
}
