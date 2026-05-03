import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import type { CustomAppliance } from '@prisma/client';

export const appliancesRouter = Router();
appliancesRouter.use(requireAuth);

const applianceSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  count: z.coerce.number().positive().default(1),
  wattage: z.coerce.number().positive(),
  hoursPerDay: z.coerce.number().min(0).max(24),
  daysPerMonth: z.coerce.number().min(1).max(31),
  usageTime: z.string(),
  isCritical: z.boolean().optional(),
  seasonality: z.string().default('year-round'),
  highStartLoad: z.boolean().optional(),
  certainty: z.string().default('approximate'),
  workPattern: z.string().default('daily'),
  note: z.string().max(500).optional().default('')
});

const map = (row: CustomAppliance) => ({
  id: `custom-db-${row.id}`,
  name: row.name,
  category: row.category,
  count: row.count,
  wattage: row.wattage,
  hoursPerDay: row.hoursPerDay,
  daysPerMonth: row.daysPerMonth,
  usageTime: row.usageTime,
  isCritical: row.isCritical,
  seasonality: row.seasonality,
  highStartLoad: row.highStartLoad,
  certainty: row.certainty,
  workPattern: row.workPattern,
  note: row.note,
  label: 'Мой уред',
  confidence: 0.86,
  explanation: 'Запазен собствен уред.',
  isCustom: true
});

appliancesRouter.get('/', async (req, res) => {
  const rows = await prisma.customAppliance.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json({ appliances: rows.map(map) });
});

appliancesRouter.get('/saved', async (req, res) => {
  const rows = await prisma.customAppliance.findMany({ 
    where: { userId: req.user!.id }, 
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      category: true,
      wattage: true,
      hoursPerDay: true,
      daysPerMonth: true,
      count: true,
      createdAt: true
    }
  });
  res.json({ appliances: rows });
});

const addApplianceSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  wattage: z.coerce.number().positive().max(50000),
  hoursPerDay: z.coerce.number().min(0).max(24),
  daysPerMonth: z.coerce.number().min(1).max(31),
  count: z.coerce.number().positive().default(1).optional()
});

appliancesRouter.post('/add', async (req, res, next) => {
  try {
    const input = addApplianceSchema.parse(req.body);
    const row = await prisma.customAppliance.create({
      data: {
        userId: req.user!.id,
        name: input.name,
        category: input.category,
        wattage: input.wattage,
        hoursPerDay: input.hoursPerDay,
        daysPerMonth: input.daysPerMonth,
        count: input.count || 1,
        usageTime: 'flexible',
        certainty: 'approximate',
        isCritical: false,
        seasonality: 'year-round',
        highStartLoad: false,
        workPattern: 'daily',
        note: ''
      }
    });
    res.status(201).json({ 
      appliance: {
        id: row.id,
        name: row.name,
        category: row.category,
        wattage: row.wattage,
        hoursPerDay: row.hoursPerDay,
        daysPerMonth: row.daysPerMonth,
        count: row.count,
        createdAt: row.createdAt
      }
    });
  } catch (err) { next(err); }
});

appliancesRouter.post('/', async (req, res, next) => {
  try {
    const input = applianceSchema.parse(req.body);
    const row = await prisma.customAppliance.create({
      data: {
        userId: req.user!.id,
        name: input.name,
        category: input.category,
        count: input.count,
        wattage: input.wattage,
        hoursPerDay: input.hoursPerDay,
        daysPerMonth: input.daysPerMonth,
        usageTime: input.usageTime,
        isCritical: Boolean(input.isCritical),
        seasonality: input.seasonality,
        highStartLoad: Boolean(input.highStartLoad),
        certainty: input.certainty,
        workPattern: input.workPattern,
        note: input.note
      }
    });
    res.status(201).json({ appliance: map(row) });
  } catch (err) { next(err); }
});

appliancesRouter.put('/:id', async (req, res, next) => {
  try {
    const input = applianceSchema.parse(req.body);
    const id = Number(String(req.params.id).replace('custom-db-', ''));
    const existing = await prisma.customAppliance.findFirst({ where: { id, userId: req.user!.id } });
    if (!existing) return res.status(404).json({ message: 'Уредът не е намерен.' });
    const row = await prisma.customAppliance.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        category: input.category,
        count: input.count,
        wattage: input.wattage,
        hoursPerDay: input.hoursPerDay,
        daysPerMonth: input.daysPerMonth,
        usageTime: input.usageTime,
        isCritical: Boolean(input.isCritical),
        seasonality: input.seasonality,
        highStartLoad: Boolean(input.highStartLoad),
        certainty: input.certainty,
        workPattern: input.workPattern,
        note: input.note
      }
    });
    res.json({ appliance: map(row) });
  } catch (err) { next(err); }
});

appliancesRouter.delete('/:id', async (req, res) => {
  const id = Number(String(req.params.id).replace('custom-db-', ''));
  await prisma.customAppliance.deleteMany({ where: { id, userId: req.user!.id } });
  res.json({ ok: true });
});
