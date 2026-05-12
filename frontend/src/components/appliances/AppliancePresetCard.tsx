import { CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateApplianceConsumption } from '../../logic/calculations';
import type { ApplianceInput, AppliancePreset } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedText } from '../../utils/applianceTranslations';

export function AppliancePresetCard({ preset, selected, onToggle }: { preset: AppliancePreset; selected: boolean; onToggle: (appliance: ApplianceInput) => void }) {
  const { t, language } = useLanguage();
  const daily = calculateApplianceConsumption(preset);
  const name = getLocalizedText(preset.name, language, preset.id);
  const label = getLocalizedText(preset.label, language);
  const explanation = getLocalizedText(preset.explanation, language);
  const labelStr = typeof preset.label === 'string' ? preset.label : preset.label[language] ?? '';

  const badges = [
    daily > 4 ? t('Appliance', 'Big consumer') : '',
    preset.usageTime === 'evening' || preset.usageTime === 'night' ? t('Appliance', 'Works in evening') : '',
    preset.certainty === 'average' || labelStr.toLowerCase().includes('не знам') || labelStr.toLowerCase().includes('unknown') ? t('Appliance', 'Average value') : '',
    preset.isCustom ? t('Appliance', 'Manually entered') : '',
    preset.highStartLoad ? t('Appliance', 'High startup current') : ''
  ].filter(Boolean);

  return (
    <motion.button type="button" whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} onClick={() => onToggle({ ...preset })} className={`relative min-h-40 overflow-hidden rounded-lg border p-4 text-left transition ${selected ? 'border-mint bg-mint/14 shadow-glow' : 'border-white/12 bg-white/[0.055] hover:border-cyan/45 hover:bg-white/[0.075]'}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/35 to-transparent" />
      <div className="relative flex items-start gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${selected ? 'bg-mint text-navy' : 'bg-white/8 text-cyan'}`}>
          {selected ? <CheckCircle2 size={20} /> : <Zap size={18} />}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-black text-white">{name} · {label}</div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{explanation}</p>
        </div>
      </div>
      <div className="relative mt-4 text-xs font-black text-mint">≈ {daily.toFixed(1)} {t('Appliance', 'kWh/day')} · {Math.round(daily * 30)} {t('ResultsText', 'kWh/month')}</div>
      {badges.length > 0 && <div className="relative mt-3 flex flex-wrap gap-1.5">{badges.slice(0, 3).map((badge) => <span key={badge} className="rounded-md bg-white/8 px-2 py-1 text-[11px] font-bold text-slate-300">{badge}</span>)}</div>}
    </motion.button>
  );
}
