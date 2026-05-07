import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export function EnergyBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { scrollYProgress } = useScroll();
  const amberX = useTransform(scrollYProgress, [0, 0.5, 1], ['-14%', '6%', '-6%']);
  const amberY = useTransform(scrollYProgress, [0, 0.5, 1], ['-18%', '8%', '24%']);
  const amberXAlt = useTransform(scrollYProgress, [0, 0.5, 1], ['10%', '-7%', '8%']);
  const amberYAlt = useTransform(scrollYProgress, [0, 0.5, 1], ['28%', '2%', '-10%']);
  const amberYLower = useTransform(scrollYProgress, [0, 0.5, 1], ['26%', '-6%', '18%']);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface"
      style={{
        backgroundImage: isDark
          ? 'linear-gradient(135deg, #050608 0%, #101216 48%, #07080a 100%)'
          : 'linear-gradient(180deg, rgba(240,249,255,0.92) 0%, rgba(248,250,252,1) 44%, rgba(240,253,244,0.82) 100%)'
      }}
      aria-hidden="true"
    >
      {/* Grid overlay — light lines in dark mode, dark lines in light mode */}
      <div
        className={
          isDark
            ? 'absolute inset-0 bg-[linear-gradient(to_right,rgba(226,232,240,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]'
            : 'absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]'
        }
      />
      {/* Moving color fields */}
      <div
        className={
          isDark
            ? 'absolute inset-[-12%] bg-[linear-gradient(115deg,rgba(245,158,11,0.08)_0%,rgba(120,53,15,0.08)_28%,rgba(8,10,13,0)_56%),linear-gradient(245deg,rgba(8,10,13,0)_20%,rgba(245,158,11,0.06)_48%,rgba(8,10,13,0)_78%)]'
            : 'absolute inset-x-0 top-0 h-44 bg-[linear-gradient(110deg,rgba(245,158,11,0.20),transparent_34%,rgba(14,165,233,0.14)_68%,rgba(22,163,74,0.16))]'
        }
      />
      {isDark && (
        <>
          <motion.div
            className="absolute inset-x-[-28%] top-[-22%] h-[92vh] rotate-[-7deg] bg-[linear-gradient(90deg,transparent_3%,rgba(245,158,11,0.10)_24%,rgba(245,158,11,0.18)_39%,rgba(120,53,15,0.10)_55%,transparent_82%)] blur-2xl mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_70%,transparent_100%)]"
            style={{ x: amberX, y: amberY }}
            animate={{ opacity: [0.45, 0.82, 0.52], scale: [1, 1.03, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-x-[-30%] top-[8%] h-[78vh] rotate-[8deg] bg-[linear-gradient(90deg,transparent_8%,rgba(251,191,36,0.08)_30%,rgba(245,158,11,0.14)_47%,transparent_72%)] blur-2xl mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_74%,transparent_100%)]"
            style={{ x: amberXAlt, y: amberYAlt }}
            animate={{ opacity: [0.34, 0.7, 0.4], scale: [1.02, 1, 1.02] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-x-[-22%] bottom-[-14%] h-[52vh] rotate-[-4deg] bg-[linear-gradient(90deg,transparent_8%,rgba(245,158,11,0.10)_34%,rgba(251,191,36,0.08)_50%,rgba(63,63,70,0.10)_68%,transparent_92%)] blur-2xl mix-blend-screen"
            style={{ y: amberYLower }}
            animate={{ x: ['-8%', '7%', '-8%'], opacity: [0.28, 0.58, 0.28] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
      {/* Shimmer band */}
      <motion.div
        className={
          isDark
            ? 'absolute inset-x-[-15%] top-24 h-24 rotate-[-3deg] bg-[linear-gradient(90deg,transparent,rgba(245,158,11,0.10),rgba(82,82,91,0.12),transparent)] blur-lg'
            : 'absolute inset-x-[-15%] top-24 h-28 rotate-[-3deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.68),transparent)]'
        }
        animate={{ x: ['-8%', '8%', '-8%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Bottom glow */}
      <div
        className={
          isDark
            ? 'absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(to_top,rgba(2,6,23,0.74),rgba(24,24,27,0.24),transparent)]'
            : 'absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(to_top,rgba(220,252,231,0.72),transparent)]'
        }
      />
    </div>
  );
}
