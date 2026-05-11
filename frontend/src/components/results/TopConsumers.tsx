import type { RecommendationResult } from '../../types';

export function TopConsumers({ result }: { result: RecommendationResult }) {
  if (!result.topConsumers.length) return null;
  return (
    <div className="card p-4 sm:p-5">
      <h3 className="text-lg font-black text-heading">Топ консуматори</h3>
      <div className="mt-4 grid gap-3">
        {result.topConsumers.map((item) => (
          <div key={item.name} className="grid gap-2 rounded-xl border border-border bg-slate-50 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="font-black text-heading">{item.name}</div>
              <p className="mt-1 text-sm leading-6 text-muted">{item.advice}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-black">
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-heading">{item.monthlyKwh} kWh/мес.</span>
              <span className="rounded-lg bg-amber-100 px-3 py-2 text-energy">{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
