import { motion } from 'framer-motion';

export function EnergyBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(240,249,255,0.92) 0%, rgba(248,250,252,1) 44%, rgba(240,253,244,0.82) 100%)'
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(110deg,rgba(245,158,11,0.20),transparent_34%,rgba(14,165,233,0.14)_68%,rgba(22,163,74,0.16))]" />
      <motion.div
        className="absolute inset-x-[-15%] top-24 h-28 rotate-[-3deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.68),transparent)]"
        animate={{ x: ['-8%', '8%', '-8%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(to_top,rgba(220,252,231,0.72),transparent)]" />
    </div>
  );
}
