export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
      {steps.map((step, index) => (
        <span
          key={step}
          className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-semibold ${
            index === current
              ? 'border-mint/55 bg-mint/15 text-white shadow-glow'
              : index < current
                ? 'border-mint/25 bg-mint/10 text-mint'
                : 'border-white/10 bg-white/[0.055] text-muted'
          }`}
        >
          {index + 1}. {step}
        </span>
      ))}
    </div>
  );
}
