import { ShieldCheck, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateApplianceConsumption } from '../../logic/calculations';
import type { ApplianceInput } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedText } from '../../utils/applianceTranslations';

export function ApplianceList({ appliances, onToggleCritical, onRemove }: { appliances: ApplianceInput[]; onToggleCritical: (id: string) => void; onRemove: (id: string) => void }) {
  const { t, language } = useLanguage();
  if (!appliances.length) return <div className="rounded-lg border border-white/12 bg-white/[0.055] p-4 text-sm leading-6 text-muted">{t('Appliance', 'First add some appliances or use a ready profile.')}</div>;

  return (
    <div className="space-y-3">
      {appliances.map((item) => {
        const daily = calculateApplianceConsumption(item);
        const name = getLocalizedText(item.name, language, item.id);
        const label = getLocalizedText(item.label, language);
        const badges = [
          daily > 4 ? t('Appliance', 'Big consumer') : '',
          item.isCritical ? t('Appliance', 'Critical') : '',
          item.usageTime === 'evening' || item.usageTime === 'night' ? t('Appliance', 'Works in evening') : '',
          item.seasonality && item.seasonality !== 'year-round' ? t('Appliance', 'Seasonal appliance') : '',
          item.certainty === 'average' ? t('Appliance', 'Average value') : '',
          item.isCustom ? t('Appliance', 'Manually entered') : '',
          item.highStartLoad ? t('Appliance', 'High startup current') : ''
        ].filter(Boolean);

        return (
          <motion.div layout key={item.id} className="rounded-lg border border-white/12 bg-white/[0.055] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-black text-white">{name}</div>
                <div className="mt-1 text-sm text-muted">{label} · ≈ {Math.round(daily * 30)} {t('ResultsText', 'kWh/month')}</div>
              </div>
              <button type="button" onClick={() => onRemove(item.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/12 bg-white/8 text-slate-300 hover:text-white" aria-label={t('Appliance', 'Remove appliance')}><Trash2 size={16} /></button>
            </div>
            {badges.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{badges.map((badge) => <span key={badge} className="rounded-md bg-white/8 px-2 py-1 text-[11px] font-bold text-slate-300">{badge}</span>)}</div>}
            <label className="mt-3 flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 text-xs font-bold text-slate-200">
              <input type="checkbox" checked={Boolean(item.isCritical)} onChange={() => onToggleCritical(item.id)} /> <ShieldCheck size={15} className="text-mint" /> {t('Appliance', 'Important during outage')}
            </label>
          </motion.div>
        );
      })}
    </div>
  );
}
