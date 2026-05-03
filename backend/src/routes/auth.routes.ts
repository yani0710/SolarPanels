import { Router } from 'express';
import { z } from 'zod';
import { createUser, findUserByEmail, publicUser, signToken, verifyPassword } from '../services/auth.service.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

const registerSchema = z.object({ name: z.string().min(2), email: z.email(), password: z.string().min(6) });
const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });

authRouter.post('/register', async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    if (await findUserByEmail(input.email)) return res.status(409).json({ message: 'Вече има профил с този email.' });
    const user = await createUser(input.name, input.email, input.password);
    res.status(201).json({ user: publicUser(user), token: signToken(user) });
  } catch (err) { next(err); }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await findUserByEmail(input.email);
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) return res.status(401).json({ message: 'Грешен email или парола.' });
    res.json({ user: publicUser(user), token: signToken(user) });
  } catch (err) { next(err); }
});

authRouter.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user!) }));
authRouter.post('/logout', (_req, res) => res.json({ ok: true }));
