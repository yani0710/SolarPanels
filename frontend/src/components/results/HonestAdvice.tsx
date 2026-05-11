import { ShieldCheck } from 'lucide-react';
import type { RecommendationResult } from '../../types';

export function HonestAdvice({ result }: { result: RecommendationResult }) {
  const risky = result.systemType === 'needs-inspection' || result.warnings.length > 1;
  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${risky ? 'border-amber-300 bg-amber-50' : 'border-energy/30 bg-amber-50/60'}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${risky ? 'bg-amber-100 text-amber-600' : 'bg-amber-100 text-energy'}`}>
          <ShieldCheck />
        </span>
        <h3 className="text-xl font-black text-heading">Честен съвет</h3>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">{result.advice}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {result.nextSteps.map((step) => (
          <span key={step} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold text-slate-700 sm:text-sm">
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
