import { ResultCards } from './ResultCards';
import { HonestAdvice } from './HonestAdvice';
import { WarningsList } from './WarningsList';
import { TopConsumers } from './TopConsumers';
import { ConsumptionChart } from '../charts/ConsumptionChart';
import { DayNightChart } from '../charts/DayNightChart';
import { ScenarioChart } from '../charts/ScenarioChart';
import type { RecommendationResult } from '../../types';

interface ResultsDashboardProps {
  result: RecommendationResult;
  onSave?: () => void;
  title?: string;
}

export function ResultsDashboard({ result, onSave, title }: ResultsDashboardProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-energy">Energy dashboard</p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">{title ?? 'Твоята ориентировъчна препоръка'}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">Ориентировъчна препоръка — не окончателна оферта.</p>
      </div>
      <ResultCards result={result} onSave={onSave} />
      <div className="grid min-w-0 gap-5 grid-cols-1 lg:grid-cols-2">
        <ConsumptionChart result={result} />
        <DayNightChart result={result} />
      </div>
      <ScenarioChart result={result} />
      <TopConsumers result={result} />
      <HonestAdvice result={result} />
      <WarningsList warnings={result.warnings} />
    </div>
  );
}
