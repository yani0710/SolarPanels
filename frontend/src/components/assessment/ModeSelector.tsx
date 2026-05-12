import { CheckCircle2, Gauge, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export function ModeSelector({ mode, onChange }: { mode: 'quick' | 'detailed'; onChange: (mode: 'quick' | 'detailed') => void }) {
  const { t } = useLanguage();

  const modes = [
    {
      id: 'quick' as const,
      titleKey: 'Quick assessment',
      textKey: 'For people who want results with few questions and reasonable averages.',
      icon: Gauge,
      featureKeys: ['5-7 easy steps', 'I do not know options', 'Result in minutes', 'Appliances via groups']
    },
    {
      id: 'detailed' as const,
      titleKey: 'Detailed assessment',
      textKey: 'Premium configurator with appliances, backup needs, and live summary panel.',
      icon: SlidersHorizontal,
      featureKeys: ['Specific appliances', 'Presets and manual settings', 'Backup analysis', 'More accurate recommendation']
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modes.map((item, index) => {
        const Icon = item.icon;
        const selected = mode === item.id;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -2 }}
            type="button"
            onClick={() => onChange(item.id)}
            className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all sm:p-6 cursor-pointer ${
              selected
                ? 'border-energy bg-amber-50 shadow-green ring-1 ring-energy/30'
                : 'card hover:border-energy/40 hover:shadow-card-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${selected ? 'bg-energy text-white' : 'bg-slate-100 text-energy'}`}>
                <Icon size={24} />
              </span>
              <div>
                <div className="text-xl font-black text-heading">{t('ModeSelector', item.titleKey)}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{t('ModeSelector', item.textKey)}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {item.featureKeys.map((key) => (
                <span key={key} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CheckCircle2 size={16} className="text-energy" />
                  {t('ModeSelector', key)}
                </span>
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
