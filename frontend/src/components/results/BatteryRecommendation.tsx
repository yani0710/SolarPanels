import { BatteryCharging } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecommendationResult } from '../../types';

export function BatteryRecommendation({ result }: { result: RecommendationResult }) {
  const fill = result.batteryNeeded ? Math.min(92, Math.max(42, result.recommendedBatteryKwh * 8)) : 22;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.08 }}
      className={`min-w-0 rounded-2xl border p-5 h-full ${result.batteryNeeded ? 'border-energy/30 bg-green-50' : 'card'}`}
    >
      <BatteryCharging className={result.batteryNeeded ? 'text-energy' : 'text-muted'} />
      <h3 className="mt-3 text-lg font-black text-heading sm:text-xl">Батерия</h3>
      <div className="mt-3 text-3xl font-black text-heading">
        {result.batteryNeeded ? `${result.recommendedBatteryRange} kWh` : 'Не е задължителна'}
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
          ? 'Има смисъл, защото част от потреблението е вечер или има backup нужда.'
          : 'Може да започнеш без батерия, ако целта е основно намаляване на сметката.'}
      </p>
    </motion.div>
  );
}
