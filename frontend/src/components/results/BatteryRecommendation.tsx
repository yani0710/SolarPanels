import { BatteryCharging } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecommendationResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export function BatteryRecommendation({ result }: { result: RecommendationResult }) {
  const { t } = useLanguage();
  const fill = result.batteryNeeded ? Math.min(92, Math.max(42, result.recommendedBatteryKwh * 8)) : 22;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.08 }}
      className={`min-w-0 rounded-2xl border p-5 h-full ${result.batteryNeeded ? 'border-energy/30 bg-amber-50' : 'card'}`}
    >
      <BatteryCharging className={result.batteryNeeded ? 'text-energy' : 'text-muted'} />
      <h3 className="mt-3 text-lg font-black text-heading sm:text-xl">{t('Results', 'Battery')}</h3>
      <div className="mt-3 text-3xl font-black text-heading">
        {result.batteryNeeded ? `${result.recommendedBatteryRange} kWh` : t('Results', 'Not required')}
      </div>
      <div className="mt-4 rounded-xl border border-border bg-slate-50 p-3">
        <div className="h-10 overflow-hidden rounded-lg border border-border bg-slate-200 p-1">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${fill}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className={`h-full rounded-md ${result.batteryNeeded ? 'bg-gradient-to-r from-energy to-sky' : 'bg-slate-300'}`}
          />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">
        {result.batteryNeeded
          ? t('Results', 'Battery makes sense — part of consumption is in the evening or there is a backup need.')
          : t('Results', 'You can start without a battery if the goal is mainly to reduce the bill.')}
      </p>
    </motion.div>
  );
}
