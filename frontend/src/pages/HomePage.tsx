import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, SlidersHorizontal } from 'lucide-react';
import { Hero } from '../components/hero/Hero';
import { Section } from '../components/layout/Section';
import { EnergyBasics } from '../components/education/EnergyBasics';
import { FAQ } from '../components/education/FAQ';
import { SavedSystems } from '../components/dashboard/SavedSystems';
import { SavedAppliances } from '../components/dashboard/SavedAppliances';
import { Footer } from '../components/layout/Footer';
import { useAppContext } from '../context/AppContext';

export function HomePage() {
  const { savedRefreshKey } = useAppContext();

  return (
    <>
      <Hero />

      <Section id="value">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-solar">Как работи</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Соларна препоръка без сложни термини.</h2>
          <p className="mt-4 text-base leading-7 text-muted">Бърза оценка, ориентировъчна мощност, батерия, тип система, предупреждения и честен съвет. Профилът отключва сценарии, история и собствени уреди.</p>
        </div>
        <EnergyBasics />

        {/* CTA to assessment pages */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            to="/byrza-otsenka"
            className="btn-primary flex items-center justify-center gap-3 rounded-2xl py-4 text-base"
          >
            <Gauge size={20} />
            <span>Бърза оценка</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/detaylna-otsenka"
            className="btn-secondary flex items-center justify-center gap-3 rounded-2xl py-4 text-base"
          >
            <SlidersHorizontal size={20} />
            <span>Детайлна оценка</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </Section>

      <Section id="dashboard" className="bg-slate-50/60">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky">Profile dashboard</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Запазени системи</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Регистрацията не е бариера. Тя пази сценарии, история и собствени уреди.</p>
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
