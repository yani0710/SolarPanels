import type { RecommendationResult } from '../../types';

export function ScenarioChart({ result }: { result: RecommendationResult }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {['on-grid', 'hybrid', 'off-grid'].map((type) => (
        <div key={type} className={`rounded-[1.3rem] border p-4 backdrop-blur-xl ${result.systemType === type ? 'border-mint bg-mint/12 shadow-glow' : 'border-white/12 bg-white/[0.055]'}`}>
          <div className="font-black uppercase text-white">{type}</div>
          <p className="mt-2 text-sm leading-6 text-muted">{result.systemType === type ? 'Най-близко до текущите данни.' : 'Възможно, но не е основната препоръка.'}</p>
        </div>
      ))}
    </div>
  );
}
