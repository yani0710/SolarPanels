import { ShieldCheck } from 'lucide-react';
import type { RecommendationResult } from '../../types';

export function HonestAdvice({ result }: { result: RecommendationResult }) {
  const risky = result.systemType === 'needs-inspection' || result.warnings.length > 1;
  return (
    <div className={`mobile-card border p-5 shadow-card backdrop-blur-xl sm:p-6 ${risky ? 'border-warning/35 bg-warning/10' : 'border-mint/30 bg-mint/10'}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-mint"><ShieldCheck /></span>
        <h3 className="text-xl font-black text-white">Честен съвет</h3>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">{result.advice}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {result.nextSteps.map((step) => <span key={step} className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-bold text-slate-200 sm:text-sm">{step}</span>)}
      </div>
    </div>
  );
}
