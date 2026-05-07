export function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative isolate overflow-hidden scroll-mt-24 border-t border-white/70 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block bg-[linear-gradient(112deg,rgba(245,158,11,0.035)_0%,transparent_38%,rgba(63,63,70,0.045)_72%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-12%] top-1/3 -z-10 hidden h-36 rotate-[-3deg] dark:block bg-[linear-gradient(90deg,transparent_5%,rgba(245,158,11,0.045)_34%,rgba(251,191,36,0.035)_50%,transparent_86%)] blur-2xl"
      />
      <div className="relative z-10 mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
