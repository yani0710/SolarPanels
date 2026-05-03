import { BatteryCharging } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecommendationResult } from '../../types';

export function BatteryRecommendation({ result }: { result: RecommendationResult }) {
  const fill = result.batteryNeeded ? Math.min(92, Math.max(42, result.recommendedBatteryKwh * 8)) : 22;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className={`mobile-card min-w-0 border p-5 shadow-card backdrop-blur-xl ${result.batteryNeeded ? 'border-mint/35 bg-mint/10' : 'border-white/12 bg-white/[0.065]'}`}>
      <BatteryCharging className={result.batteryNeeded ? 'text-mint' : 'text-muted'} />
      <h3 className="mt-3 text-lg font-black text-white sm:text-xl">Батерия</h3>
      <div className="mt-3 text-3xl font-black text-white">
        {result.batteryNeeded ? `${result.recommendedBatteryRange} kWh` : 'Не е задължителна'}
      </div>
      <div className="mt-4 rounded-lg border border-white/12 bg-navy/60 p-3">
        <div className="h-10 overflow-hidden rounded-md border border-white/12 bg-white/8 p-1">
          <motion.div initial={{ width: 0 }} whileInView={{ width: `${fill}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} className={`h-full rounded ${result.batteryNeeded ? 'bg-gradient-to-r from-mint to-cyan shadow-glow' : 'bg-white/20'}`} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">
        {result.batteryNeeded ? 'Има смисъл, защото част от потреблението е вечер или има backup нужда.' : 'Може да започнеш без батерия, ако целта е основно намаляване на сметката.'}
      </p>
    </motion.div>
  );
}
