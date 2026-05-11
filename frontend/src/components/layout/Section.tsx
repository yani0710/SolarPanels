import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <section id={id} className={`relative isolate overflow-hidden scroll-mt-24 border-t px-4 py-12 sm:px-6 sm:py-16 lg:px-8 ${isLight ? 'border-slate-200' : 'border-white/10'} ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(112deg,rgba(255,159,67,0.035)_0%,transparent_38%,rgba(79,209,255,0.045)_72%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-12%] top-1/3 -z-10 h-36 rotate-[-3deg] bg-[linear-gradient(90deg,transparent_5%,rgba(255,209,102,0.045)_34%,rgba(79,209,255,0.035)_50%,transparent_86%)] blur-2xl"
      />
      <div className="relative z-10 mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
