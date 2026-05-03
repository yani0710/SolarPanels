import { ShieldCheck, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateApplianceConsumption } from '../../logic/calculations';
import type { ApplianceInput } from '../../types';

export function ApplianceList({ appliances, onToggleCritical, onRemove }: { appliances: ApplianceInput[]; onToggleCritical: (id: string) => void; onRemove: (id: string) => void }) {
  if (!appliances.length) return <div className="rounded-lg border border-white/12 bg-white/[0.055] p-4 text-sm leading-6 text-muted">Добави първите си уреди или използвай готов профил.</div>;

  return (
    <div className="space-y-3">
      {appliances.map((item) => {
        const daily = calculateApplianceConsumption(item);
        const badges = [
          daily > 4 ? 'Голям консуматор' : '',
          item.isCritical ? 'Критичен' : '',
          item.usageTime === 'evening' || item.usageTime === 'night' ? 'Работи вечер' : '',
          item.seasonality && item.seasonality !== 'year-round' ? 'Сезонен' : '',
          item.certainty === 'average' ? 'Средна стойност' : '',
          item.isCustom ? 'Ръчно въведен' : '',
          item.highStartLoad ? 'Висок стартов ток' : ''
        ].filter(Boolean);

        return (
          <motion.div layout key={item.id} className="rounded-lg border border-white/12 bg-white/[0.055] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-black text-white">{item.name}</div>
                <div className="mt-1 text-sm text-muted">{item.label} · ≈ {Math.round(daily * 30)} kWh/мес.</div>
              </div>
              <button type="button" onClick={() => onRemove(item.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/12 bg-white/8 text-slate-300 hover:text-white" aria-label="Премахни уред"><Trash2 size={16} /></button>
            </div>
            {badges.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{badges.map((badge) => <span key={badge} className="rounded-md bg-white/8 px-2 py-1 text-[11px] font-bold text-slate-300">{badge}</span>)}</div>}
            <label className="mt-3 flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 text-xs font-bold text-slate-200">
              <input type="checkbox" checked={Boolean(item.isCritical)} onChange={() => onToggleCritical(item.id)} /> <ShieldCheck size={15} className="text-mint" /> Важно при спиране на тока
            </label>
          </motion.div>
        );
      })}
    </div>
  );
}
