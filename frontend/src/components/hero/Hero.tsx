import { ArrowRight, BatteryCharging, CheckCircle2, Gauge, MapPin, SlidersHorizontal, Sparkles, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
          {/* Announcement badge */}
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-sky/20 bg-sky-50 px-4 py-2 text-xs font-bold text-sky shadow-sm">
            <Sparkles size={14} className="shrink-0 text-solar" />
            <span className="truncate">Smart energy advisor за България</span>
          </div>

          <h1 className="max-w-4xl text-[2.35rem] font-black leading-[1.04] text-heading sm:text-5xl lg:text-6xl">
            Разбери каква соларна система ти трябва — без да си експерт.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            SolarWise BG анализира твоето потребление, уреди и условия, за да ти даде бърза и честна препоръка за мощност, батерия и тип система.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 grid gap-3 sm:flex sm:flex-row">
            <Link to="/byrza-otsenka" className="btn-primary">
              <Gauge size={18} /> Бърза оценка <ArrowRight size={18} />
            </Link>
            <Link to="/detaylna-otsenka" className="btn-secondary">
              <SlidersHorizontal size={18} /> Детайлна оценка
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-7 grid gap-2 sm:grid-cols-3">
            {stats.map(([label, value, Icon]) => (
              <div key={label} className="card p-3">
                <Icon size={17} className="text-energy" />
                <div className="mt-2 text-xs font-bold uppercase text-muted">{label}</div>
                <div className="text-sm font-black text-heading">{value}</div>
              </div>
            ))}
          </div>

          {/* Badges row */}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {badges.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CheckCircle2 size={17} className="text-energy" />
                {badge}
              </div>
            ))}
          </div>

          {/* Solar fit scan widget */}
          <div className="mt-6 card p-4">
            <div className="mb-3 flex items-center justify-between gap-3 text-xs font-black uppercase text-muted">
              <span>Solar fit scan</span>
              <span className="text-energy">live</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ['Roof', 'orientation + shade', '78%'],
                ['Usage', 'day / night load', '64%'],
                ['Backup', 'battery signal', '52%']
              ].map(([label, text, width]) => (
                <div key={label} className="rounded-xl border border-border bg-slate-50 p-3">
                  <div className="text-sm font-black text-heading">{label}</div>
                  <div className="mt-1 text-xs text-muted">{text}</div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-energy to-sky" style={{ width }} />
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
