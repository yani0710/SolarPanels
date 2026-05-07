import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, BatteryCharging, CheckCircle2, Gauge, Home, SlidersHorizontal, SunMedium } from 'lucide-react';
import { Hero } from '../components/hero/Hero';
import { Section } from '../components/layout/Section';
import { EnergyBasics } from '../components/education/EnergyBasics';
import { FAQ } from '../components/education/FAQ';
import { SavedSystems } from '../components/dashboard/SavedSystems';
import { SavedAppliances } from '../components/dashboard/SavedAppliances';
import { Footer } from '../components/layout/Footer';
import { useAppContext } from '../context/AppContext';

const outcomes = [
  ['Система', 'Препоръчан kWp диапазон според дома и региона.', SunMedium],
  ['Батерия', 'Оценка дали backup има смисъл и какъв капацитет.', BatteryCharging],
  ['Профил', 'Дневно/нощно потребление, уреди и сценарии.', BarChart3],
  ['Рискове', 'Засенчване, слаб confidence и честни предупреждения.', CheckCircle2]
] as const;

export function HomePage() {
  const { savedRefreshKey } = useAppContext();

  return (
    <>
      <Hero />

      <Section id="value">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-solar">Как работи</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">
              Соларна препоръка без сложни термини.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              SolarPick превежда потреблението, уредите и backup нуждите в разбираема система: мощност, батерия,
              тип инвертор, сценарии и предупреждения.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {outcomes.map(([title, text, Icon]) => (
              <div key={title} className="rounded-xl border border-white/80 bg-white/82 p-4 shadow-card backdrop-blur">
                <Icon size={20} className="text-energy" />
                <h3 className="mt-3 text-base font-black text-heading">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9">
          <EnergyBasics />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link to="/byrza-otsenka" className="btn-primary justify-center rounded-xl py-4 text-base">
            <Gauge size={20} />
            <span>Бърза оценка</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/detaylna-otsenka" className="btn-secondary justify-center rounded-xl py-4 text-base">
            <SlidersHorizontal size={20} />
            <span>Детайлна оценка</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </Section>

      <Section id="dashboard" className="bg-white/45">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky">Profile dashboard</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Запазени системи</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Регистрацията не е бариера. Тя пази сценарии, история и собствени уреди, когато искаш да сравняваш варианти.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
            <Home size={18} />
            Home energy workspace
          </div>
        </div>
        <div className="grid min-w-0 gap-5 lg:grid-cols-[1fr_360px]">
          <SavedSystems refreshKey={savedRefreshKey} />
          <SavedAppliances />
        </div>
      </Section>

      <Section id="faq">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-solar">FAQ</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Кратко и ясно за соларите</h2>
        </div>
        <FAQ />
      </Section>

      <Footer />
    </>
  );
}
