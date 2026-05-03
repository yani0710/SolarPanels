import { ArrowRight, BatteryCharging, CheckCircle2, Gauge, MapPin, SlidersHorizontal, Sparkles, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroVisual } from './HeroVisual';

const badges = ['Без технически знания', 'С резултат за минути', 'Честна препоръка', 'Пресети за уреди'];
const stats = [
  ['Климат', 'BG региони', MapPin],
  ['Мощност', 'kWp диапазон', SunMedium],
  ['Backup', 'kWh батерия', BatteryCharging]
] as const;

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-md border border-white/12 bg-black/35 px-4 py-2 text-xs font-bold uppercase text-cyan shadow-[0_0_34px_rgba(56,189,248,.1)] backdrop-blur-xl">
            <Sparkles size={15} className="shrink-0 text-solar" />
            <span className="truncate">Smart energy advisor за България</span>
          </div>
          <h1 className="max-w-4xl text-[2.35rem] font-black leading-[1.04] text-white sm:text-5xl lg:text-6xl">
            Разбери каква соларна система ти трябва - без да си експерт.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            SolarWise BG анализира твоето потребление, уреди и условия, за да ти даде бърза и честна препоръка за мощност, батерия и тип система.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-row">
            <a href="#assessment" className="premium-button bg-gradient-to-r from-mint to-cyan text-navy shadow-glow hover:-translate-y-0.5">
              <Gauge size={18} /> Направи бърза оценка <ArrowRight size={18} />
            </a>
            <a href="#assessment" className="premium-button border border-white/14 bg-white/7 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-cyan/50">
              <SlidersHorizontal size={18} /> Детайлна оценка
            </a>
          </div>
          <div className="mt-7 grid gap-2 sm:grid-cols-3">
            {stats.map(([label, value, Icon]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.045] p-3 backdrop-blur-xl">
                <Icon size={17} className="text-mint" />
                <div className="mt-2 text-xs font-bold uppercase text-muted">{label}</div>
                <div className="text-sm font-black text-white">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {badges.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <CheckCircle2 size={17} className="text-mint" />
                {badge}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.045] p-3 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-3 text-xs font-black uppercase text-muted">
              <span>Solar fit scan</span>
              <span className="text-mint">live</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ['Roof', 'orientation + shade', '78%'],
                ['Usage', 'day / night load', '64%'],
                ['Backup', 'battery signal', '52%']
              ].map(([label, text, width]) => (
                <div key={label} className="rounded-md border border-white/10 bg-black/18 p-3">
                  <div className="text-sm font-black text-white">{label}</div>
                  <div className="mt-1 text-xs text-muted">{text}</div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-mint to-cyan" style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <HeroVisual />
      </div>
    </section>
  );
}
