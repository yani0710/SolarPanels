import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  current: number;
  onNavigate?: (index: number) => void;
}

export function Stepper({ steps, current, onNavigate }: StepperProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;
          const isClickable = onNavigate && index <= current;

          return (
            <div key={step} className="flex flex-1 items-center">
              <button
                type="button"
                title={step}
                disabled={!isClickable}
                onClick={() => isClickable && onNavigate(index)}
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${
                  isCompleted
                    ? 'bg-energy text-white hover:bg-green-700 cursor-pointer'
                    : isCurrent
                      ? 'bg-energy text-white ring-4 ring-amber-100 cursor-default'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check size={14} /> : index + 1}
              </button>
              {index < steps.length - 1 && (
                <div className={`mx-1 h-1 flex-1 rounded-full transition-all duration-300 ${index < current ? 'bg-energy' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
      {/* Step labels — visible on sm+ */}
      <div className="mt-2 hidden items-center sm:flex">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-1 items-center">
            <button
              type="button"
              disabled={!onNavigate || index > current}
              onClick={() => onNavigate && index <= current && onNavigate(index)}
              className={`truncate text-[11px] font-semibold leading-tight transition-colors ${
                index === current ? 'text-energy font-bold' : index < current ? 'text-slate-500 hover:text-energy cursor-pointer' : 'text-slate-300 cursor-default'
              }`}
            >
              {step}
            </button>
            {index < steps.length - 1 && <div className="mx-1 flex-1" />}
          </div>
        ))}
      </div>
      {/* Mobile — only show current step label */}
      <p className="mt-1 text-xs font-semibold text-muted sm:hidden">
        Стъпка {current + 1} от {steps.length} — <span className="font-bold text-heading">{steps[current]}</span>
      </p>
    </div>
  );
}
