import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

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

const map = (row: any) => ({
  id: `custom-db-${row.id}`,
  name: row.name,
  category: row.category,
  count: row.count,
  wattage: row.wattage,
  hoursPerDay: row.hours_per_day,
  daysPerMonth: row.days_per_month,
  usageTime: row.usage_time,
  isCritical: Boolean(row.is_critical),
  seasonality: row.seasonality,
  highStartLoad: Boolean(row.high_start_load),
  certainty: row.certainty,
  workPattern: row.work_pattern,
  note: row.note,
  label: 'Мой уред',
  confidence: 0.86,
  explanation: 'Запазен собствен уред.',
  isCustom: true
});

appliancesRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM custom_appliances WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id);
  res.json({ appliances: rows.map(map) });
});

appliancesRouter.post('/', (req, res, next) => {
  try {
    const input = applianceSchema.parse(req.body);
    const result = db.prepare(`
      INSERT INTO custom_appliances
      (user_id, name, category, count, wattage, hours_per_day, days_per_month, usage_time, is_critical, seasonality, high_start_load, certainty, work_pattern, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user!.id, input.name, input.category, input.count, input.wattage, input.hoursPerDay, input.daysPerMonth, input.usageTime, input.isCritical ? 1 : 0, input.seasonality, input.highStartLoad ? 1 : 0, input.certainty, input.workPattern, input.note);
    const row = db.prepare('SELECT * FROM custom_appliances WHERE id = ? AND user_id = ?').get(Number(result.lastInsertRowid), req.user!.id);
    res.status(201).json({ appliance: map(row) });
  } catch (err) { next(err); }
});

appliancesRouter.put('/:id', (req, res, next) => {
  try {
    const input = applianceSchema.parse(req.body);
    const id = String(req.params.id).replace('custom-db-', '');
    db.prepare(`
      UPDATE custom_appliances
      SET name=?, category=?, count=?, wattage=?, hours_per_day=?, days_per_month=?, usage_time=?, is_critical=?, seasonality=?, high_start_load=?, certainty=?, work_pattern=?, note=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=? AND user_id=?
    `).run(input.name, input.category, input.count, input.wattage, input.hoursPerDay, input.daysPerMonth, input.usageTime, input.isCritical ? 1 : 0, input.seasonality, input.highStartLoad ? 1 : 0, input.certainty, input.workPattern, input.note, id, req.user!.id);
    const row = db.prepare('SELECT * FROM custom_appliances WHERE id = ? AND user_id = ?').get(id, req.user!.id);
    if (!row) return res.status(404).json({ message: 'Уредът не е намерен.' });
    res.json({ appliance: map(row) });
  } catch (err) { next(err); }
});

appliancesRouter.delete('/:id', (req, res) => {
  const id = String(req.params.id).replace('custom-db-', '');
  db.prepare('DELETE FROM custom_appliances WHERE id = ? AND user_id = ?').run(id, req.user!.id);
  res.json({ ok: true });
});
