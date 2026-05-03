import type { NextFunction, Request, Response } from 'express';
import { findUserById, verifyToken } from '../services/auth.service.js';

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    const user = await findUserById(Number(payload.sub));
    if (user) req.user = user;
  } catch {
    // Anonymous assistant access still works when a stale token is present.
  }
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Моля, влезте в профила си.' });
  try {
    const payload = verifyToken(token);
    const user = await findUserById(Number(payload.sub));
    if (!user) return res.status(401).json({ message: 'Профилът не е намерен.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Сесията е изтекла. Влезте отново.' });
  }
}
