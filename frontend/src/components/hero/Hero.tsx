import { ArrowRight, BatteryCharging, CheckCircle2, Gauge, MapPin, SlidersHorizontal, Sparkles, SunMedium, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroVisual } from './HeroVisual';
import Logo from '../../assets/SolarPick.png';

const proofPoints = ['Без технически знания', 'Препоръка за минути', 'Честен диапазон', 'Сценарии с батерия'];
const metrics = [
  ['Климат', 'BG региони', MapPin],
  ['Мощност', 'kWp модел', SunMedium],
  ['Backup', 'kWh батерия', BatteryCharging]
] as const;

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-28 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden dark:block">
        <motion.div
          className="absolute -left-36 top-0 h-[620px] w-[78%] rotate-[-5deg] bg-[linear-gradient(105deg,transparent_0%,rgba(245,158,11,0.16)_24%,rgba(180,83,9,0.14)_45%,rgba(8,10,13,0)_74%)] blur-xl mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_72%,transparent_100%)]"
          animate={{ x: ['-4%', '5%', '-4%'], y: ['0%', '7%', '0%'], opacity: [0.52, 0.78, 0.56] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-[22%] top-32 h-[360px] w-[56%] rotate-[3deg] bg-[linear-gradient(95deg,transparent_0%,rgba(251,191,36,0.10)_30%,rgba(245,158,11,0.12)_46%,rgba(8,10,13,0)_76%)] blur-2xl mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent_0%,black_24%,black_66%,transparent_100%)]"
          animate={{ x: ['5%', '-4%', '5%'], y: ['-2%', '10%', '-2%'], opacity: [0.38, 0.68, 0.4] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-x-[-8%] top-48 h-36 rotate-[-4deg] bg-[linear-gradient(90deg,transparent_8%,rgba(245,158,11,0.10)_34%,rgba(251,191,36,0.09)_48%,rgba(39,39,42,0.10)_62%,transparent_90%)] blur-2xl mix-blend-screen"
          animate={{ x: ['-8%', '10%', '-8%'], y: ['0%', '14%', '0%'], opacity: [0.38, 0.74, 0.38] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-[5%] top-24 h-px w-[62%] rotate-[-3deg] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent"
          animate={{ x: ['-6%', '8%', '-6%'], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-[16%] top-64 h-px w-[54%] rotate-[-3deg] bg-gradient-to-r from-transparent via-amber-500/42 to-transparent"
          animate={{ x: ['8%', '-7%', '8%'], opacity: [0.3, 0.72, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.86fr_1.14fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }} className="relative z-10">
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-wide text-sky shadow-sm backdrop-blur">
            <Sparkles size={14} className="shrink-0 text-solar" />
            <span className="truncate">Smart energy advisor за България</span>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <img src={Logo} alt="SolarPick Logo" className="h-11 w-11 rounded-xl bg-gradient-to-br from-solar to-energy object-cover shadow-green" />
            <span className="text-base font-black uppercase tracking-[0.24em] text-heading">SolarPick</span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.96] text-heading sm:text-6xl lg:text-7xl">SolarPick</h1>
          <p className="mt-5 max-w-2xl text-xl font-extrabold leading-tight text-slate-800 sm:text-2xl">
            Интелигентен соларен конфигуратор за домове, батерии и реално потребление.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Въвеждаш как живееш, какви уреди използваш и какъв backup искаш. Получаваш ясна препоръка за мощност,
            батерия, тип система и рискове преди да говориш с инсталатор.
          </p>

          <div className="mt-7 grid gap-3 sm:flex sm:flex-row">
            <Link to="/byrza-otsenka" className="btn-primary">
              <Gauge size={18} /> Бърза оценка <ArrowRight size={18} />
            </Link>
            <Link to="/detaylna-otsenka" className="btn-secondary">
              <SlidersHorizontal size={18} /> Детайлна оценка
            </Link>
          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-3">
            {metrics.map(([label, value, Icon]) => (
              <div key={label} className="rounded-xl border border-white/80 bg-white/78 p-3 shadow-card backdrop-blur">
                <Icon size={17} className="text-energy" />
                <div className="mt-2 text-[11px] font-black uppercase tracking-wide text-muted">{label}</div>
                <div className="text-sm font-black text-heading">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {proofPoints.map((point) => (
              <div key={point} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle2 size={17} className="text-energy" />
                {point}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white/82 p-4 shadow-card backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide text-muted">
              <span>Solar fit scan</span>
              <span className="inline-flex items-center gap-1 text-energy">
                <Zap size={13} />
                live
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ['Roof', 'orientation + shade', '78%'],
                ['Usage', 'day / night load', '64%'],
                ['Backup', 'battery signal', '52%']
              ].map(([label, text, width]) => (
                <div key={label} className="rounded-lg border border-border bg-slate-50 p-3">
                  <div className="text-sm font-black text-heading">{label}</div>
                  <div className="mt-1 text-xs font-semibold text-muted">{text}</div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-energy via-sky to-solar" style={{ width }} />
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
