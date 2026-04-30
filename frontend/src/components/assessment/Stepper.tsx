export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
      {steps.map((step, index) => <span key={step} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${index === current ? 'bg-navy text-white' : index < current ? 'bg-mint/15 text-mint' : 'bg-slate-100 text-slate-500'}`}>{index + 1}. {step}</span>)}
    </div>
  );
}
