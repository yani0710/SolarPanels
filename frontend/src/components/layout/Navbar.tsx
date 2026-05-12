import { Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserMenu } from '../auth/UserMenu';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../../assets/SolarPick.png';

const routeItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/byrza-otsenka', label: 'Quick Estimate', end: false },
  { to: '/detaylna-otsenka', label: 'Detailed Design', end: false }
] as const;

const homeAnchors = [
  { href: '#features', label: 'Features' },
  { href: '#calculator', label: 'Calculator' },
  { href: '#faq', label: 'FAQ' }
] as const;

export function Navbar({ onAuth, onProfile }: { onAuth: (mode: 'login' | 'register') => void; onProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const close = () => setOpen(false);

  const linkClass = (active: boolean) =>
    `relative rounded-lg px-3.5 py-2 text-sm font-bold transition ` +
    (active
      ? 'bg-white/[0.08] text-[#F5F7FA] shadow-[0_0_28px_rgba(79,209,255,0.12)] ring-1 ring-white/10'
      : 'text-[#AAB3C2] hover:bg-white/[0.06] hover:text-[#F5F7FA]');

  const mobileLinkClass = (active = false) =>
    `block rounded-lg px-4 py-3 text-base font-bold transition ` +
    (active
      ? 'bg-white/[0.08] text-[#F5F7FA] ring-1 ring-white/10'
      : 'text-[#AAB3C2] hover:bg-white/[0.06] hover:text-[#F5F7FA]');

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-xl border px-3 py-2.5 transition-all duration-300 sm:px-4 ` +
          (scrolled
            ? 'border-white/10 bg-[#111315]/78 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl'
            : 'border-white/[0.07] bg-[#181B1F]/38 shadow-none backdrop-blur-xl')}
      >
        <Link to="/" onClick={close} className="group flex min-w-0 items-center gap-3 font-black">
          <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,159,67,0.18),rgba(79,209,255,0.14))] shadow-[0_0_30px_rgba(255,159,67,0.16)]">
            <img src={Logo} alt="SolarPick Logo" className="h-9 w-9 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm uppercase tracking-[0.22em] sm:text-[15px] text-[#F5F7FA]">SolarPick</span>
            <span className="hidden text-[11px] font-extrabold uppercase tracking-wide sm:block text-[#AAB3C2]">{t('Navbar', 'Energy intelligence')}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {routeItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => linkClass(isActive && (item.to !== '/' || isHome))}
            >
              {t('Navbar', item.label)}
            </NavLink>
          ))}
          {isHome && homeAnchors.map((item) => (
            <a key={item.href} href={item.href} className={linkClass(false)}>
              {t('Navbar', item.label)}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-lg border transition border-white/10 bg-white/[0.05] text-[#AAB3C2] hover:border-[#FFD166]/30 hover:bg-[#FFD166]/10 hover:text-[#FFD166]"
            title={theme === 'light' ? t('Navbar', 'Dark theme') : t('Navbar', 'Light theme')}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button
            onClick={toggleLanguage}
            className="flex h-10 items-center gap-1.5 rounded-lg border px-2.5 font-bold text-xs transition border-white/10 bg-white/[0.05] text-[#AAB3C2] hover:border-[#FFD166]/30 hover:bg-[#FFD166]/10 hover:text-[#FFD166]"
            title={language === 'bg' ? 'English' : 'Български'}
            aria-label={language === 'bg' ? 'Switch to English' : 'Превключи на български'}
          >
            <Languages size={15} />
            <span>{language === 'bg' ? 'BG' : 'EN'}</span>
          </button>
          <UserMenu onAuth={onAuth} onProfile={onProfile} />
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-xl border md:hidden border-white/10 bg-white/[0.06] text-[#F5F7FA]"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-2 max-w-7xl rounded-xl border border-white/10 bg-[#111315]/92 p-3 shadow-[0_22px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl md:hidden"
          >
            <div className="grid gap-1">
              {routeItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={close}
                  className={({ isActive }) => mobileLinkClass(isActive && (item.to !== '/' || isHome))}
                >
                  {t('Navbar', item.label)}
                </NavLink>
              ))}
              {isHome && homeAnchors.map((item) => (
                <a key={item.href} href={item.href} onClick={close} className={mobileLinkClass()}>
                  {t('Navbar', item.label)}
                </a>
              ))}
            </div>

            <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
              <button
                onClick={() => { toggleTheme(); close(); }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-bold text-[#AAB3C2] transition hover:bg-white/[0.06] hover:text-[#F5F7FA]"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {theme === 'light' ? t('Navbar', 'Dark theme') : t('Navbar', 'Light theme')}
              </button>
              <button
                onClick={() => { toggleLanguage(); close(); }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-bold text-[#AAB3C2] transition hover:bg-white/[0.06] hover:text-[#F5F7FA]"
              >
                <Languages size={18} />
                {t('Navbar', 'Български')}
              </button>
              <UserMenu onAuth={onAuth} onProfile={onProfile} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}