import { ArrowRight, CheckCircle2, Gauge, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroVisual } from './HeroVisual';

const badges = ['Без технически знания', 'С резултат за минути', 'Честна препоръка', 'Пресети за уреди'];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.96fr_1.04fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan backdrop-blur-xl">
            <Sparkles size={15} className="shrink-0 text-solar" />
            <span className="truncate">Smart energy advisor за България</span>
          </div>
          <h1 className="max-w-4xl text-[2.55rem] font-black leading-[1.02] text-white sm:text-5xl lg:text-6xl">
            Разбери каква соларна система ти трябва - без да си експерт.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            SolarWise BG анализира твоето потребление, уреди и условия, за да ти даде бърза и честна препоръка за мощност, батерия и тип система.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-row">
            <a href="#assessment" className="premium-button bg-gradient-to-r from-mint to-cyan text-navy shadow-glow hover:-translate-y-0.5">
              <Gauge size={18} /> Направи бърза оценка <ArrowRight size={18} />
            </a>
            <a href="#assessment" className="premium-button border border-white/14 bg-white/8 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-cyan/50">
              <SlidersHorizontal size={18} /> Детайлна оценка
            </a>
          </div>
          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            {badges.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <CheckCircle2 size={17} className="text-mint" />
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
        <HeroVisual />
      </div>
    </section>
  );
}
