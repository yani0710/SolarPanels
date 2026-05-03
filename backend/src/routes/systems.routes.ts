import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import type { SavedSystem } from '@prisma/client';

export const systemsRouter = Router();
systemsRouter.use(requireAuth);

const systemSchema = z.object({
  title: z.string().min(1),
  inputSnapshot: z.unknown(),
  resultSnapshot: z.object({
    recommendedPowerKwp: z.number(),
    recommendedBatteryKwh: z.number(),
    systemType: z.string(),
    advice: z.string()
  }).passthrough()
});

const map = (row: SavedSystem) => ({
  id: row.id,
  title: row.title,
  inputSnapshot: JSON.parse(row.inputSnapshot),
  resultSnapshot: JSON.parse(row.resultSnapshot),
  recommendedPowerKwp: row.recommendedPowerKwp,
  recommendedBatteryKwh: row.recommendedBatteryKwh,
  systemType: row.systemType,
  advice: row.advice,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
});

systemsRouter.get('/', async (req, res) => {
  const rows = await prisma.savedSystem.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json({ systems: rows.map(map) });
});

systemsRouter.get('/:id', async (req, res) => {
  const row = await prisma.savedSystem.findFirst({ where: { id: Number(req.params.id), userId: req.user!.id } });
  if (!row) return res.status(404).json({ message: 'Сценарият не е намерен.' });
  res.json({ system: map(row) });
});

systemsRouter.post('/', async (req, res, next) => {
  try {
    const input = systemSchema.parse(req.body);
    const r = input.resultSnapshot;
    const row = await prisma.savedSystem.create({
      data: {
        userId: req.user!.id,
        title: input.title,
        inputSnapshot: JSON.stringify(input.inputSnapshot),
        resultSnapshot: JSON.stringify(input.resultSnapshot),
        recommendedPowerKwp: r.recommendedPowerKwp,
        recommendedBatteryKwh: r.recommendedBatteryKwh,
        systemType: r.systemType,
        advice: r.advice
      }
    });
    res.status(201).json({ system: map(row) });
  } catch (err) { next(err); }
});

systemsRouter.put('/:id', async (req, res, next) => {
  try {
    const input = systemSchema.parse(req.body);
    const r = input.resultSnapshot;
    const existing = await prisma.savedSystem.findFirst({ where: { id: Number(req.params.id), userId: req.user!.id } });
    if (!existing) return res.status(404).json({ message: 'Сценарият не е намерен.' });
    const row = await prisma.savedSystem.update({
      where: { id: existing.id },
      data: {
        title: input.title,
        inputSnapshot: JSON.stringify(input.inputSnapshot),
        resultSnapshot: JSON.stringify(input.resultSnapshot),
        recommendedPowerKwp: r.recommendedPowerKwp,
        recommendedBatteryKwh: r.recommendedBatteryKwh,
        systemType: r.systemType,
        advice: r.advice
      }
    });
    res.json({ system: map(row) });
  } catch (err) { next(err); }
});

systemsRouter.delete('/:id', async (req, res) => {
  await prisma.savedSystem.deleteMany({ where: { id: Number(req.params.id), userId: req.user!.id } });
  res.json({ ok: true });
});
