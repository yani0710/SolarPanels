import type { RecommendationResult } from '../../types';

export function TopConsumers({ result }: { result: RecommendationResult }) {
  if (!result.topConsumers.length) return null;

  return (
    <div className="mobile-card border border-white/12 bg-white/[0.055] p-4 shadow-card backdrop-blur-xl sm:p-5">
      <h3 className="text-lg font-black text-white">Топ консуматори</h3>
      <div className="mt-4 grid gap-3">
        {result.topConsumers.map((item) => (
          <div key={item.name} className="grid gap-2 rounded-lg border border-white/10 bg-white/8 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="font-black text-white">{item.name}</div>
              <p className="mt-1 text-sm leading-6 text-muted">{item.advice}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-black text-white">
              <span className="rounded-md bg-navy/60 px-3 py-2">{item.monthlyKwh} kWh/мес.</span>
              <span className="rounded-md bg-mint/15 px-3 py-2 text-mint">{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
