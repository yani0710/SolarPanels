import type { RecommendationResult } from '../../types';

export function ScenarioChart({ result }: { result: RecommendationResult }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {['on-grid', 'hybrid', 'off-grid'].map((type) => (
        <div key={type} className={`rounded-lg border p-4 backdrop-blur-xl transition ${result.systemType === type ? 'border-mint bg-mint/12 shadow-glow' : 'border-white/12 bg-white/[0.055]'}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="font-black uppercase text-white">{type}</div>
            <span className={`h-2 w-2 rounded-full ${result.systemType === type ? 'bg-mint shadow-[0_0_18px_rgba(53,229,139,.75)]' : 'bg-white/25'}`} />
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{result.systemType === type ? 'Най-близко до текущите данни.' : 'Възможно, но не е основната препоръка.'}</p>
        </div>
      ))}
    </div>
  );
}
