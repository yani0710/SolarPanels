import { AlertTriangle, BatteryCharging, Home, Network, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecommendationResult, SystemType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const iconMap: Record<SystemType, typeof Network> = {
  'on-grid': Network,
  hybrid: BatteryCharging,
  'off-grid': Home,
  'needs-inspection': AlertTriangle,
};

const toneMap: Record<SystemType, string> = {
  'on-grid': 'from-sky-50 to-white border-sky-200',
  hybrid: 'from-amber-50 to-sky-50 border-energy/30',
  'off-grid': 'from-amber-50 to-amber-50/60 border-solar/30',
  'needs-inspection': 'from-amber-100 to-red-50 border-warning/30',
};

const iconColorMap: Record<SystemType, string> = {
  'on-grid': 'text-sky',
  hybrid: 'text-energy',
  'off-grid': 'text-solar',
  'needs-inspection': 'text-warning',
};

const titleKeyMap: Record<SystemType, string> = {
  'on-grid': 'On-grid',
  hybrid: 'Hybrid',
  'off-grid': 'Off-grid',
  'needs-inspection': 'Inspection needed',
};

const textKeyMap: Record<SystemType, string> = {
  'on-grid': 'Suitable for reducing the bill without a mandatory battery.',
  hybrid: 'Suitable for evening consumption, backup and a more flexible system.',
  'off-grid': 'Suitable for autonomy and weak or missing grid access.',
  'needs-inspection': 'There is risk in the conditions. Professional inspection recommended.',
};

export function SystemTypeRecommendation({ result }: { result: RecommendationResult }) {
  const { t } = useLanguage();
  const Icon = iconMap[result.systemType];
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.14 }}
      className={`min-w-0 rounded-2xl border bg-gradient-to-br ${toneMap[result.systemType]} p-5`}
    >
      <Icon className={iconColorMap[result.systemType]} />
      <h3 className="mt-3 text-lg font-black text-heading sm:text-xl">{t('Results', 'System type')}</h3>
      <div className="mt-2 text-4xl font-black text-heading">{t('Results', titleKeyMap[result.systemType])}</div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[SunMedium, BatteryCharging, Network].map((SmallIcon, index) => (
          <div key={index} className={`grid h-14 place-items-center rounded-xl border ${index === 1 && result.systemType === 'on-grid' ? 'border-border bg-slate-50 text-slate-300' : 'border-energy/20 bg-amber-100 text-energy'}`}>
            <SmallIcon size={20} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{t('Results', textKeyMap[result.systemType])}</p>
    </motion.div>
  );
}
