import { motion } from 'framer-motion';

export function EnergyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(53,229,139,.18),transparent_28rem),radial-gradient(circle_at_82%_18%,rgba(56,189,248,.16),transparent_30rem),linear-gradient(135deg,#06111f_0%,#071a2f_52%,#09233a_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(164,231,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(164,231,255,.18)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,17,31,.30)_70%,rgba(6,17,31,.78)_100%)]" />
      {[0, 1, 2, 3, 4, 5].map((dot) => (
        <motion.span
          key={dot}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan/50 blur-[1px]"
          style={{ left: `${12 + dot * 16}%`, top: `${20 + (dot % 3) * 22}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.25, 0.8, 0.25] }}
          transition={{ duration: 5 + dot, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-navy to-transparent" />
    </div>
  );
}
