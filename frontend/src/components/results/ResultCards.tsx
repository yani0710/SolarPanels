import { Save, SolarPanel } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecommendationResult } from '../../types';
import { BatteryRecommendation } from './BatteryRecommendation';
import { SystemTypeRecommendation } from './SystemTypeRecommendation';
import { ConfidenceScore } from './ConfidenceScore';
import { useLanguage } from '../../context/LanguageContext';

export function ResultCards({ result, onSave }: { result: RecommendationResult; onSave?: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-5">
      {/* Main kWp card — spans 3 of 5 columns on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card min-w-0 p-5 lg:col-span-3"
      >
        <SolarPanel className="text-energy" />
        <h3 className="mt-3 text-lg font-black text-heading sm:text-xl">{t('Results', 'Required power')}</h3>
        <div className="mt-3 text-4xl font-black text-heading sm:text-5xl">
          {result.recommendedPowerRange} <span className="text-xl text-energy">kWp</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{t('Results', 'Estimated power for your consumption and local solar conditions.')}</p>
        <div className="mt-5"><ConfidenceScore result={result} /></div>
        {onSave && (
          <button onClick={onSave} className="btn-primary mt-5 w-full sm:w-auto">
            <Save size={16} /> {t('Results', 'Save result')}
          </button>
        )}
      </motion.div>

      {/* Battery card — 2 of 5 columns */}
      <div className="min-w-0 lg:col-span-2">
        <BatteryRecommendation result={result} />
      </div>

      {/* System type — full width */}
      <div className="min-w-0 lg:col-span-5">
        <SystemTypeRecommendation result={result} />
      </div>
    </div>
  );
}
