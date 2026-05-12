import {
  ArrowRight,
  BatteryCharging,
  Gauge,
  Layers3,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SunMedium,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroVisual } from './HeroVisual';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const proofPoints = [
  'Roof, usage, battery, and grid signals in one model',
  'Built for practical home and small business decisions',
  'Clear recommendations before installer conversations',
  'Scenario planning for day, night, and backup loads'
];

const metrics = [
  ['5.8 kWp', 'recommended array', SunMedium],
  ['8 kWh', 'backup reserve', BatteryCharging],
  ['31%', 'projected bill drop', Gauge]
] as const;

export function Hero() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  return (
    <section id="top" className="relative isolate overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/2 top-10 h-[520px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,159,67,0.20),rgba(255,209,102,0.08)_38%,transparent_68%)] blur-3xl"
          animate={{ opacity: [0.5, 0.9, 0.55], scale: [0.98, 1.05, 0.98] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={"absolute right-[-16%] top-28 h-[560px] w-[640px] rounded-full blur-3xl " + (isLight ? "bg-[radial-gradient(circle,rgba(79,209,255,0.10),rgba(255,159,67,0.06)_42%,transparent_70%)]" : "bg-[radial-gradient(circle,rgba(79,209,255,0.18),rgba(31,38,48,0.14)_42%,transparent_70%)]")}
          animate={{ x: ['-2%', '4%', '-2%'], y: ['0%', '5%', '0%'], opacity: [0.42, 0.76, 0.42] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className={"absolute inset-x-0 top-0 h-80 " + (isLight ? "bg-[linear-gradient(to_bottom,rgba(250,250,248,0.86),transparent)]" : "bg-[linear-gradient(to_bottom,rgba(31,38,48,0.86),transparent)]")} />
        <div className={"absolute inset-x-0 bottom-0 h-40 " + (isLight ? "bg-[linear-gradient(to_top,rgba(250,250,248,0.92),transparent)]" : "bg-[linear-gradient(to_top,rgba(17,19,21,0.92),transparent)]")} />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.84fr_1.16fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10"
        >
          <div className={"mb-6 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] shadow-[0_0_32px_rgba(255,159,67,0.12)] backdrop-blur-xl " + (isLight ? "border-amber-200/60 bg-amber-50/80 text-energy" : "border-white/10 bg-white/[0.06] text-[#FFD166]")}>
            <Sparkles size={14} className="shrink-0 text-[#FF9F43]" />
            <span className="truncate">{t('Hero', 'Premium energy intelligence')}</span>
          </div>

          <h1 className={"max-w-[22rem] text-4xl font-black leading-[1.02] sm:max-w-4xl sm:text-6xl sm:leading-[0.96] lg:text-7xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>
            {t('Hero', 'Design your solar future before it reaches your roof.')}
          </h1>
          <p className={"mt-6 max-w-2xl text-lg leading-8 sm:text-xl " + (isLight ? "text-slate-600" : "text-[#AAB3C2]")}>
            {t('Hero', 'SolarPick models panels, battery capacity, household demand, and grid behavior in one cinematic workspace so you can size a cleaner energy system with confidence.')}
          </p>

          <div className="mt-8 grid gap-3 sm:flex sm:flex-row">
            <Link to="/byrza-otsenka" className="btn-primary">
              <Gauge size={18} /> {t('Hero', 'Start quick estimate')} <ArrowRight size={18} />
            </Link>
            <Link to="/detaylna-otsenka" className="btn-secondary">
              <SlidersHorizontal size={18} /> {t('Hero', 'Build detailed plan')}
            </Link>
          </div>

          <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-3">
            {metrics.map(([value, label, Icon]) => (
              <motion.div
                key={value}
                whileHover={{ y: -4, scale: 1.015 }}
                className={"rounded-xl border p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-colors " + (isLight ? "border-slate-200 bg-white/80 hover:border-amber-200 hover:bg-amber-50/60" : "border-white/10 bg-[#181B1F]/72 hover:border-[#4FD1FF]/30 hover:bg-[#1F2630]/82")}
              >
                <Icon size={18} className={"shrink-0 " + (isLight ? "text-energy" : "text-[#4FD1FF]")} />
                <div className={"mt-3 text-2xl font-black " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{value}</div>
                <div className={"mt-1 text-xs font-bold uppercase tracking-[0.16em] " + (isLight ? "text-slate-500" : "text-[#AAB3C2]")}>{t('Hero', label)}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
            {proofPoints.map((point) => (
              <div key={point} className={"flex items-center gap-3 text-sm font-semibold leading-6 " + (isLight ? "text-slate-700" : "text-[#D7DEE9]")}>
                <span className={"grid h-7 w-7 shrink-0 place-items-center rounded-lg border " + (isLight ? "border-energy/20 bg-amber-50 text-energy" : "border-[#FFD166]/20 bg-[#FFD166]/10 text-[#FFD166]")}>
                  <ShieldCheck size={15} />
                </span>
                {t('Hero', point)}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.55 }}
            className={"mt-8 hidden overflow-hidden rounded-xl border p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:block " + (isLight ? "border-slate-200 bg-white/70" : "border-white/10 bg-[#1F2630]/58")}
          >
            <div className={"mb-4 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.16em] " + (isLight ? "text-slate-500" : "text-[#AAB3C2]")}>
              <span className="inline-flex items-center gap-2">
                <Layers3 size={14} className={isLight ? "text-energy" : "text-[#4FD1FF]"} />
                {t('Hero', 'Live energy map')}
              </span>
              <span className={"inline-flex items-center gap-1 " + (isLight ? "text-energy" : "text-[#FFD166]")}>
                <Zap size={13} />
                {t('Hero', 'active')}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Solar gain', 'orientation + shade', '78%'],
                ['Load fit', 'day / night usage', '64%'],
                ['Backup signal', 'battery resilience', '52%']
              ].map(([label, text, width]) => (
                <div key={label} className={"rounded-lg border p-3 " + (isLight ? "border-slate-200 bg-white/60" : "border-white/10 bg-[#111315]/58")}>
                  <div className={"text-sm font-black " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{t('Hero', label)}</div>
                  <div className={"mt-1 text-xs font-semibold " + (isLight ? "text-slate-500" : "text-[#AAB3C2]")}>{t('Hero', text)}</div>
                  <div className={"mt-3 h-1.5 overflow-hidden rounded-full " + (isLight ? "bg-slate-200" : "bg-white/10")}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ delay: 0.35, duration: 0.9, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#FF9F43] via-[#FFD166] to-[#4FD1FF]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}