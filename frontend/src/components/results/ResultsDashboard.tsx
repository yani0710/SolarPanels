import { ResultCards } from './ResultCards';
import { WarningsList } from './WarningsList';
import { TopConsumers } from './TopConsumers';
import { ConsumptionChart } from '../charts/ConsumptionChart';
import { DayNightChart } from '../charts/DayNightChart';
import { ScenarioChart } from '../charts/ScenarioChart';
import type { RecommendationResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ResultsDashboardProps {
  result: RecommendationResult;
  onSave?: () => void;
  title?: string;
}

export function ResultsDashboard({ result, onSave, title }: ResultsDashboardProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-energy">{t('Results', 'Energy dashboard')}</p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">{title ?? t('Results', 'Your estimated recommendation')}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{t('Results', 'Estimated recommendation — not a final quote.')}</p>
      </div>
      <ResultCards result={result} onSave={onSave} />
      <div className="grid min-w-0 gap-5 grid-cols-1 lg:grid-cols-2">
        <ConsumptionChart result={result} />
        <DayNightChart result={result} />
      </div>
      <ScenarioChart result={result} />
      <TopConsumers result={result} />
      <WarningsList warnings={result.warnings} />
    </div>
  );
}
