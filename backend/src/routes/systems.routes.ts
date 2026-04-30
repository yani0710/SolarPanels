import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';
import type { SavedSystemRecord } from '../db/models.js';

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

const map = (row: SavedSystemRecord) => ({
  id: row.id,
  title: row.title,
  inputSnapshot: JSON.parse(row.input_snapshot),
  resultSnapshot: JSON.parse(row.result_snapshot),
  recommendedPowerKwp: row.recommended_power_kwp,
  recommendedBatteryKwh: row.recommended_battery_kwh,
  systemType: row.system_type,
  advice: row.advice,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

systemsRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM saved_systems WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id) as unknown as SavedSystemRecord[];
  res.json({ systems: rows.map(map) });
});

systemsRouter.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM saved_systems WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id) as SavedSystemRecord | undefined;
  if (!row) return res.status(404).json({ message: 'Сценарият не е намерен.' });
  res.json({ system: map(row) });
});

systemsRouter.post('/', (req, res, next) => {
  try {
    const input = systemSchema.parse(req.body);
    const r = input.resultSnapshot;
    const result = db.prepare('INSERT INTO saved_systems (user_id, title, input_snapshot, result_snapshot, recommended_power_kwp, recommended_battery_kwh, system_type, advice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(req.user!.id, input.title, JSON.stringify(input.inputSnapshot), JSON.stringify(input.resultSnapshot), r.recommendedPowerKwp, r.recommendedBatteryKwh, r.systemType, r.advice);
    const row = db.prepare('SELECT * FROM saved_systems WHERE id = ? AND user_id = ?').get(Number(result.lastInsertRowid), req.user!.id) as unknown as SavedSystemRecord;
    res.status(201).json({ system: map(row) });
  } catch (err) { next(err); }
});

systemsRouter.put('/:id', (req, res, next) => {
  try {
    const input = systemSchema.parse(req.body);
    const r = input.resultSnapshot;
    db.prepare('UPDATE saved_systems SET title=?, input_snapshot=?, result_snapshot=?, recommended_power_kwp=?, recommended_battery_kwh=?, system_type=?, advice=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?').run(input.title, JSON.stringify(input.inputSnapshot), JSON.stringify(input.resultSnapshot), r.recommendedPowerKwp, r.recommendedBatteryKwh, r.systemType, r.advice, req.params.id, req.user!.id);
    const row = db.prepare('SELECT * FROM saved_systems WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id) as unknown as SavedSystemRecord;
    res.json({ system: map(row) });
  } catch (err) { next(err); }
});

systemsRouter.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM saved_systems WHERE id = ? AND user_id = ?').run(req.params.id, req.user!.id);
  res.json({ ok: true });
});
