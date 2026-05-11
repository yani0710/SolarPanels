import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export function EnergyBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { scrollYProgress } = useScroll();
  const amberX = useTransform(scrollYProgress, [0, 0.5, 1], ['-10%', '5%', '-4%']);
  const amberY = useTransform(scrollYProgress, [0, 0.5, 1], ['-14%', '8%', '20%']);
  const cyanX = useTransform(scrollYProgress, [0, 0.5, 1], ['8%', '-5%', '9%']);
  const cyanY = useTransform(scrollYProgress, [0, 0.5, 1], ['18%', '-4%', '12%']);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface"
      style={{
        backgroundImage: isDark
          ? 'linear-gradient(145deg, #111315 0%, #181B1F 42%, #1F2630 74%, #111315 100%)'
          : 'linear-gradient(180deg, #F8FAFC 0%, #EEF7FF 48%, #F8FAFC 100%)'
      }}
      aria-hidden="true"
    >
      <div
        className={
          isDark
            ? 'absolute inset-0 bg-[linear-gradient(to_right,rgba(245,247,250,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,247,250,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]'
            : 'absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]'
        }
      />

      <motion.div
        className="absolute left-[-18%] top-[-18%] h-[82vh] w-[78vw] rounded-full bg-[radial-gradient(circle,rgba(255,159,67,0.22),rgba(255,209,102,0.08)_38%,transparent_70%)] blur-3xl"
        style={{ x: amberX, y: amberY }}
        animate={{ opacity: [0.46, 0.78, 0.5], scale: [1, 1.04, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-20%] top-[10%] h-[72vh] w-[68vw] rounded-full bg-[radial-gradient(circle,rgba(79,209,255,0.18),rgba(31,38,48,0.14)_42%,transparent_72%)] blur-3xl"
        style={{ x: cyanX, y: cyanY }}
        animate={{ opacity: [0.34, 0.68, 0.38], scale: [1.02, 1, 1.02] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-[-15%] top-24 h-28 rotate-[-3deg] bg-[linear-gradient(90deg,transparent,rgba(255,209,102,0.10),rgba(79,209,255,0.12),transparent)] blur-lg"
        animate={{ x: ['-8%', '8%', '-8%'], opacity: [0.35, 0.72, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className={"absolute inset-x-0 bottom-0 h-80 " + (isDark ? "bg-[linear-gradient(to_top,rgba(17,19,21,0.90),rgba(24,27,31,0.42),transparent)]" : "bg-[linear-gradient(to_top,rgba(248,250,252,0.90),rgba(238,247,255,0.42),transparent)]")} />
    </div>
  );
}
