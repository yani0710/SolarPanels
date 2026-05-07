import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export function EnergyBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface"
      style={{
        backgroundImage: isDark
          ? 'linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(15,23,42,1) 44%, rgba(2,6,23,1) 100%)'
          : 'linear-gradient(180deg, rgba(240,249,255,0.92) 0%, rgba(248,250,252,1) 44%, rgba(240,253,244,0.82) 100%)'
      }}
      aria-hidden="true"
    >
      {/* Grid overlay — light lines in dark mode, dark lines in light mode */}
      <div
        className={
          isDark
            ? 'absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]'
            : 'absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]'
        }
      />
      {/* Top color accent */}
      <div
        className={
          isDark
            ? 'absolute inset-x-0 top-0 h-44 bg-[linear-gradient(110deg,rgba(245,158,11,0.08),transparent_34%,rgba(14,165,233,0.06)_68%,rgba(22,163,74,0.07))]'
            : 'absolute inset-x-0 top-0 h-44 bg-[linear-gradient(110deg,rgba(245,158,11,0.20),transparent_34%,rgba(14,165,233,0.14)_68%,rgba(22,163,74,0.16))]'
        }
      />
      {/* Shimmer band */}
      <motion.div
        className={
          isDark
            ? 'absolute inset-x-[-15%] top-24 h-28 rotate-[-3deg] bg-[linear-gradient(90deg,transparent,rgba(51,65,85,0.25),transparent)]'
            : 'absolute inset-x-[-15%] top-24 h-28 rotate-[-3deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.68),transparent)]'
        }
        animate={{ x: ['-8%', '8%', '-8%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Bottom glow */}
      <div
        className={
          isDark
            ? 'absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(to_top,rgba(22,163,74,0.06),transparent)]'
            : 'absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(to_top,rgba(220,252,231,0.72),transparent)]'
        }
      />
    </div>
  );
}
