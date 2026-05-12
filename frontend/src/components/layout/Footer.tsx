import { BatteryCharging, Gauge, Mail, MapPin, ShieldCheck, SunMedium } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../../assets/SolarPick.png';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-[#111315]/92 px-4 py-12 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_1.45fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,159,67,0.18),rgba(79,209,255,0.14))] shadow-[0_0_30px_rgba(255,159,67,0.16)]">
              <img src={Logo} alt="SolarPick Logo" className="h-9 w-9 rounded-lg object-cover" />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.22em] text-[#F5F7FA]">SolarPick</span>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#AAB3C2]">{t('Footer', 'Energy intelligence')}</span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#AAB3C2]">
            {t('Footer', 'A premium renewable-energy planning platform for sizing solar arrays, batteries, and practical home energy scenarios before installation.')}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {([
              [SunMedium, 'Solar-first planning'],
              [BatteryCharging, 'Battery-ready scenarios'],
              [Gauge, 'Decision-grade estimates'],
              [ShieldCheck, 'Clear confidence signals']
            ] as const).map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-sm font-semibold text-[#D7DEE9]">
                <Icon size={16} className="text-[#FFD166]" />
                {t('Footer', label)}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Real pages */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#F5F7FA]">{t('Footer', 'Platform')}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-sm font-semibold text-[#AAB3C2] transition hover:text-[#FFD166]">
                  {t('Navbar', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/byrza-otsenka" className="text-sm font-semibold text-[#AAB3C2] transition hover:text-[#FFD166]">
                  {t('HomePage', 'Quick estimate')}
                </Link>
              </li>
              <li>
                <Link to="/detaylna-otsenka" className="text-sm font-semibold text-[#AAB3C2] transition hover:text-[#FFD166]">
                  {t('HomePage', 'Detailed design')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Home page anchors */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#F5F7FA]">{t('Navbar', 'Energy intelligence')}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="/#features" className="text-sm font-semibold text-[#AAB3C2] transition hover:text-[#FFD166]">
                  {t('Navbar', 'Features')}
                </a>
              </li>
              <li>
                <a href="/#calculator" className="text-sm font-semibold text-[#AAB3C2] transition hover:text-[#FFD166]">
                  {t('Navbar', 'Calculator')}
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-sm font-semibold text-[#AAB3C2] transition hover:text-[#FFD166]">
                  {t('Navbar', 'FAQ')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-sm font-semibold text-[#AAB3C2] sm:flex-row sm:items-center sm:justify-between">
        <div>{t('Footer', 'Energy-tech MVP 2026. Estimates require professional validation before installation.')}</div>
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-[#4FD1FF]" /> {t('Footer', 'Bulgaria and EU-ready')}</span>
          <span className="inline-flex items-center gap-2"><Mail size={15} className="text-[#4FD1FF]" /> hello@solarpick.energy</span>
        </div>
      </div>
    </footer>
  );
}
