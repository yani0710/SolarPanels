import type { RecommendationResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export function ScenarioChart({ result }: { result: RecommendationResult }) {
  const { t } = useLanguage();
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {['on-grid', 'hybrid', 'off-grid'].map((type) => (
        <div key={type} className={`rounded-2xl border p-4 transition ${result.systemType === type ? 'border-energy bg-amber-50 shadow-green' : 'card'}`}>
          <div className="flex items-center justify-between gap-3">
            <div className={`font-black uppercase ${result.systemType === type ? 'text-energy' : 'text-heading'}`}>{type}</div>
            <span className={`h-2.5 w-2.5 rounded-full ${result.systemType === type ? 'bg-energy' : 'bg-slate-300'}`} />
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">
            {result.systemType === type
              ? t('Results', 'Closest to current data.')
              : t('Results', 'Possible, but not the primary recommendation.')}
          </p>
        </div>
      ))}
    </div>
  );
}
