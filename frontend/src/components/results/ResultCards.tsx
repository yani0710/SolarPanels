import { Save, SolarPanel } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecommendationResult } from '../../types';
import { BatteryRecommendation } from './BatteryRecommendation';
import { SystemTypeRecommendation } from './SystemTypeRecommendation';
import { ConfidenceScore } from './ConfidenceScore';

export function ResultCards({ result, onSave }: { result: RecommendationResult; onSave: () => void }) {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-3">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mobile-card min-w-0 border border-white/12 bg-white/[0.065] p-5 shadow-card backdrop-blur-xl">
        <SolarPanel className="text-mint" />
        <h3 className="mt-3 text-lg font-black text-white sm:text-xl">Нужна мощност</h3>
        <div className="mt-3 text-4xl font-black text-white sm:text-5xl">{result.recommendedPowerRange} <span className="text-xl text-mint">kWp</span></div>
        <p className="mt-3 text-sm leading-6 text-muted">Ориентировъчна мощност за твоето потребление и локални слънчеви условия.</p>
        <div className="mt-5"><ConfidenceScore result={result} /></div>
        <button onClick={onSave} className="premium-button mt-5 w-full bg-gradient-to-r from-mint to-cyan text-navy shadow-glow sm:w-auto">
          <Save size={16} /> Запази резултата
        </button>
      </motion.div>
      <BatteryRecommendation result={result} />
      <SystemTypeRecommendation result={result} />
    </div>
  );
}
