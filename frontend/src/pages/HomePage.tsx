import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  Gauge,
  Home,
  Layers3,
  LineChart,
  LockKeyhole,
  Map,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SunMedium,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Hero } from '../components/hero/Hero';
import { Section } from '../components/layout/Section';
import { FAQ } from '../components/education/FAQ';
import { Footer } from '../components/layout/Footer';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const features = [
  ['3D system modeling', 'A visual energy map connects roof, panels, inverter, battery, home load, and grid behavior.', Layers3],
  ['Smart sizing logic', 'Estimate practical kWp and battery ranges from consumption, roof context, and usage patterns.', Cpu],
  ['Scenario comparison', 'Compare grid-tied, hybrid, and backup-first options before committing to hardware.', BarChart3],
  ['Region-aware guidance', 'Solar assumptions adapt to local zones, production windows, and seasonal behavior.', Map],
  ['Resilience planning', 'Understand what a battery can realistically cover during evening peaks and outages.', BatteryCharging],
  ['Readable recommendations', 'Premium dashboards translate technical inputs into plain decisions and tradeoffs.', ShieldCheck]
] as const;

const savings = [
  ['31%', 'average bill reduction modeled for balanced day/night consumption'],
  ['5.8 kWp', 'sample home array size from the hero energy profile'],
  ['8 kWh', 'battery reserve for essential evening and backup loads'],
  ['92%', 'confidence score when roof and appliance data are complete']
] as const;

const comparisonRows = [
  ['Best for', 'Lowest upfront cost', 'Balanced autonomy', 'Critical load backup'],
  ['Battery', 'Optional later', 'Included', 'Priority sizing'],
  ['Grid reliance', 'High at night', 'Moderate', 'Low for essentials'],
  ['Planning depth', 'Fast estimate', 'Detailed scenarios', 'Load-by-load review']
] as const;

const testimonials = [
  ['The model made the system finally feel understandable. We could see how the battery, roof, and daily loads worked together before asking for quotes.', 'Maya P.', 'Homeowner'],
  ['It feels like a product dashboard, not a spreadsheet. The comparison flow helped us explain options clearly to our finance team.', 'Ivan K.', 'Operations lead'],
  ['The design is clean, but the real win is confidence. It shows where assumptions are strong and where a site visit still matters.', 'Elena D.', 'Energy consultant']
] as const;

export function HomePage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  return (
    <>
      <Hero />

      <Section id="features">
        <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
          <div>
            <p className={"text-sm font-black uppercase tracking-[0.2em] " + (isLight ? "text-navy" : "text-[#FF9F43]")}>{t('HomePage', 'Intelligent platform')}</p>
            <h2 className={"mt-3 text-3xl font-black leading-tight sm:text-4xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>
              {t('HomePage', 'Premium energy planning without burying people in technical noise.')}
            </h2>
            <p className={"mt-4 text-base leading-7 " + (isLight ? "text-slate-600" : "text-[#AAB3C2]")}>
              {t('HomePage', 'The interface keeps the 3D system at the center while the surrounding panels surface only the decisions that matter: size, savings, battery value, and confidence.')}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {features.map(([title, text, Icon], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.04, duration: 0.45 }}
                whileHover={{ y: -5 }}
                className={"rounded-xl border p-5 shadow-[0_18px_55px_rgba(0,0,0,0.20)] backdrop-blur-xl transition-colors " + (isLight ? "border-slate-200 bg-white/80 hover:border-amber-200 hover:bg-amber-50/60" : "border-white/10 bg-[#181B1F]/72 hover:border-[#4FD1FF]/30 hover:bg-[#1F2630]/82")}
              >
                <div className={"grid h-11 w-11 place-items-center rounded-xl border shadow-[0_0_26px_rgba(79,209,255,0.10)] transition group-hover:border-[#FFD166]/24 group-hover:text-[#FFD166] " + (isLight ? "border-sky-200 bg-sky-50 text-sky" : "border-[#4FD1FF]/18 bg-[#4FD1FF]/10 text-[#4FD1FF]")}>
                  <Icon size={21} />
                </div>
                <h3 className={"mt-4 text-lg font-black " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{t('HomePage', title)}</h3>
                <p className={"mt-2 text-sm leading-6 " + (isLight ? "text-slate-600" : "text-[#AAB3C2]")}>{t('HomePage', text)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="calculator" className={(isLight ? "bg-slate-100/50" : "bg-[#1F2630]/34")}>
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            className={"rounded-xl border p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6 " + (isLight ? "border-slate-200 bg-white/80" : "border-white/10 bg-[#181B1F]/72")}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className={"text-xs font-black uppercase tracking-[0.18em] " + (isLight ? "text-navy" : "text-[#4FD1FF]")}>{t('HomePage', 'Calculator preview')}</p>
                <h2 className={"mt-2 text-2xl font-black sm:text-3xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{t('HomePage', 'Configure a solar system in minutes.')}</h2>
              </div>
              <div className={"hidden rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] sm:block " + (isLight ? "border-amber-200 bg-amber-50 text-navy" : "border-[#FFD166]/20 bg-[#FFD166]/10 text-[#FFD166]")}>
                {t('HomePage', 'live model')}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ['Monthly usage', '680 kWh', '72%'],
                ['Daytime load', '44%', '44%'],
                ['Roof potential', '42 m2', '82%'],
                ['Backup priority', 'Essential', '58%']
              ] as const).map(([label, value, width]) => (
                <div key={label} className={"rounded-lg border p-4 " + (isLight ? "border-slate-200 bg-white/60" : "border-white/10 bg-[#111315]/58")}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={"text-sm font-bold " + (isLight ? "text-slate-500" : "text-[#AAB3C2]")}>{t('HomePage', label)}</span>
                    <span className={"text-sm font-black " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{value}</span>
                  </div>
                  <div className={"mt-4 h-2 overflow-hidden rounded-full " + (isLight ? "bg-slate-200" : "bg-white/10")}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#FF9F43] via-[#FFD166] to-[#4FD1FF]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={"mt-5 rounded-lg border p-4 " + (isLight ? "border-sky-200 bg-sky-50" : "border-[#4FD1FF]/16 bg-[#4FD1FF]/[0.06]")}>
              <div className="grid gap-4 sm:grid-cols-3">
                {([
                  ['System', '5.8 kWp'],
                  ['Battery', '8 kWh'],
                  ['Payback', '6.4 yrs']
                ] as const).map(([label, value]) => (
                  <div key={label}>
                    <div className={"text-xs font-black uppercase tracking-[0.16em] " + (isLight ? "text-slate-500" : "text-[#AAB3C2]")}>{t('HomePage', label)}</div>
                    <div className={"mt-1 text-2xl font-black " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
          >
            <p className={"text-sm font-black uppercase tracking-[0.2em] " + (isLight ? "text-navy" : "text-[#FFD166]")}>{t('HomePage', 'Guided workflow')}</p>
            <h2 className={"mt-3 text-3xl font-black leading-tight sm:text-4xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>
              {t('HomePage', 'Start simple, then add detail only where it improves the recommendation.')}
            </h2>
            <p className={"mt-4 text-base leading-7 " + (isLight ? "text-slate-600" : "text-[#AAB3C2]")}>
              {t('HomePage', 'Quick Estimate gets you a clean first pass. Detailed Design adds appliances, backup behavior, and confidence signals when you want a sharper system plan.')}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link to="/byrza-otsenka" className="btn-primary">
                <Gauge size={18} />
                {t('HomePage', 'Quick estimate')}
                <ArrowRight size={18} />
              </Link>
              <Link to="/detaylna-otsenka" className="btn-secondary">
                <SlidersHorizontal size={18} />
                {t('HomePage', 'Detailed design')}
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section id="compare">
        <div className="mb-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className={"text-sm font-black uppercase tracking-[0.2em] " + (isLight ? "text-navy" : "text-[#4FD1FF]")}>{t('HomePage', 'Compare scenarios')}</p>
            <h2 className={"mt-3 text-3xl font-black leading-tight sm:text-4xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{t('HomePage', 'Choose the energy path that fits the way you actually live.')}</h2>
          </div>
          <p className={"text-base leading-7 " + (isLight ? "text-slate-600" : "text-[#AAB3C2]")}>
            {t('HomePage', 'The table favors clarity over jargon, so homeowners can compare budget, resilience, and autonomy without decoding installer terminology.')}
          </p>
        </div>

        <div className={"overflow-hidden rounded-xl border shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl " + (isLight ? "border-slate-200 bg-white/80" : "border-white/10 bg-[#181B1F]/72")}>
          <div className={"grid min-w-[760px] grid-cols-4 border-b text-sm font-black " + (isLight ? "border-slate-200 bg-slate-50 text-navy" : "border-white/10 bg-white/[0.04] text-[#F5F7FA]")}>
            {(['Scenario', 'Grid-tied', 'Hybrid', 'Backup-first'] as const).map((heading) => (
              <div key={heading} className="px-5 py-4">{t('HomePage', heading)}</div>
            ))}
          </div>
          <div className={"min-w-[760px] divide-y " + (isLight ? "divide-slate-200" : "divide-white/10")}>
            {comparisonRows.map((row) => (
              <div key={row[0]} className="grid grid-cols-4 text-sm">
                {row.map((cell, index) => (
                  <div key={cell} className={`px-5 py-4 ${index === 0 ? (isLight ? 'font-black text-navy' : 'font-black text-[#F5F7FA]') : (isLight ? 'font-semibold text-slate-600' : 'font-semibold text-[#AAB3C2]')}`}>
                    {index > 0 && row[0] !== 'Best for' ? <CheckCircle2 size={15} className="mr-2 inline text-[#FFD166]" /> : null}
                    {t('HomePage', cell)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="savings" className={(isLight ? "bg-slate-100/50" : "bg-[#111315]/36")}>
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className={"text-sm font-black uppercase tracking-[0.2em] " + (isLight ? "text-navy" : "text-[#FF9F43]")}>{t('HomePage', 'Savings intelligence')}</p>
            <h2 className={"mt-3 text-3xl font-black leading-tight sm:text-4xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>
              {t('HomePage', 'Practical savings, backup, and confidence metrics in one view.')}
            </h2>
            <p className={"mt-4 text-base leading-7 " + (isLight ? "text-slate-600" : "text-[#AAB3C2]")}>
              {t('HomePage', 'A premium visual system is useful only when the numbers stay readable. SolarPick keeps the dashboard calm, scannable, and decision-ready.')}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {savings.map(([value, label], index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
                className={"rounded-xl border p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl " + (isLight ? "border-slate-200 bg-white/80" : "border-white/10 bg-[#1F2630]/72")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={"text-4xl font-black " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{value}</div>
                  <LineChart size={22} className="text-[#4FD1FF]" />
                </div>
                <p className={"mt-3 text-sm font-semibold leading-6 " + (isLight ? "text-slate-600" : "text-[#AAB3C2]")}>{t('HomePage', label)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="testimonials">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={"text-sm font-black uppercase tracking-[0.2em] " + (isLight ? "text-navy" : "text-[#FFD166]")}>{t('HomePage', 'Customer signal')}</p>
            <h2 className={"mt-3 text-3xl font-black leading-tight sm:text-4xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{t('HomePage', 'Built for confident decisions, not dashboard theater.')}</h2>
          </div>
            <div className={"inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-3 text-sm font-black " + (isLight ? "border-sky-200 bg-sky-50 text-navy" : "border-[#4FD1FF]/18 bg-[#4FD1FF]/10 text-[#A6EAFF]")}>
            <Sparkles size={17} />
            {t('HomePage', 'Renewable energy, premium UX')}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, name, role], index) => (
            <motion.figure
              key={name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              whileHover={{ y: -5 }}
              className={"rounded-xl border p-5 shadow-[0_18px_55px_rgba(0,0,0,0.20)] backdrop-blur-xl " + (isLight ? "border-slate-200 bg-white/80" : "border-white/10 bg-[#181B1F]/72")}
            >
              <blockquote className={"text-sm font-semibold leading-7 " + (isLight ? "text-slate-700" : "text-[#D7DEE9]")}>"{t('Testimonials', quote)}"</blockquote>
              <figcaption className={"mt-5 border-t pt-4 " + (isLight ? "border-slate-200" : "border-white/10")}>
                <div className={"font-black " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{name}</div>
                <div className={"text-sm font-semibold " + (isLight ? "text-slate-500" : "text-[#AAB3C2]")}>{role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Section>

      <Section id="faq" className={(isLight ? "bg-slate-100/50" : "bg-[#1F2630]/26")}>
        <div className="mb-8 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className={"text-sm font-black uppercase tracking-[0.2em] " + (isLight ? "text-navy" : "text-[#FF9F43]")}>FAQ</p>
            <h2 className={"mt-3 text-3xl font-black leading-tight sm:text-4xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>{t('HomePage', 'Solar planning, made plain.')}</h2>
          </div>
          <p className={"text-base leading-7 " + (isLight ? "text-slate-600" : "text-[#AAB3C2]")}>
            {t('HomePage', 'Short answers for the questions that usually slow down a solar decision.')}
          </p>
        </div>
        <FAQ />
      </Section>

      <Section className="border-t-0 py-8">
        <div className={"rounded-xl border p-6 shadow-[0_28px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-8 lg:flex lg:items-center lg:justify-between " + (isLight ? "border-amber-200/50 bg-gradient-to-br from-amber-50 via-white to-sky-50" : "border-[#FF9F43]/18 bg-[linear-gradient(135deg,rgba(255,159,67,0.16),rgba(79,209,255,0.10)_52%,rgba(31,38,48,0.72))]")}>
          <div>
            <div className={"inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.16em] " + (isLight ? "border-amber-200 bg-amber-50 text-energy" : "border-white/10 bg-white/[0.06] text-[#FFD166]")}>
              <Zap size={14} />
              {t('HomePage', 'Ready when you are')}
            </div>
            <h2 className={"mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-4xl " + (isLight ? "text-navy" : "text-[#F5F7FA]")}>
              {t('HomePage', 'Turn your home energy profile into a clear solar plan.')}
            </h2>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link to="/byrza-otsenka" className="btn-primary">
              {t('HomePage', 'Start now')}
              <ArrowRight size={18} />
            </Link>
            <Link to="/detaylna-otsenka" className="btn-secondary">
              {t('HomePage', 'Explore details')}
            </Link>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}