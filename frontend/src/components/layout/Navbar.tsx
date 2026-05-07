import { Menu, Sparkles, SunMedium, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserMenu } from '../auth/UserMenu';
import Logo from '../../assets/SolarPick.png';

const navItems = [
  { to: '/', label: 'Начало', end: true },
  { to: '/byrza-otsenka', label: 'Бърза оценка', end: false },
  { to: '/detaylna-otsenka', label: 'Детайлна оценка', end: false }
] as const;

export function Navbar({ onAuth, onProfile }: { onAuth: (mode: 'login' | 'register') => void; onProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const close = () => setOpen(false);

  const linkClass = (active: boolean) =>
    `relative rounded-lg px-3.5 py-2 text-sm font-bold transition ${
      active ? 'bg-emerald-50 text-energy shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-heading'
    }`;

  const mobileLinkClass = (active: boolean) =>
    `block rounded-lg px-4 py-3 text-base font-bold transition ${active ? 'bg-emerald-50 text-energy' : 'text-heading hover:bg-slate-50 active:bg-slate-100'}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/75 bg-white/86 px-3 py-2.5 shadow-[0_12px_44px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:px-4">
        <Link to="/" onClick={close} className="group flex min-w-0 items-center gap-3 font-black text-heading">
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-200 via-white to-emerald-100 shadow-green">
            <img src={Logo} alt="SolarPick Logo" className="h-9 w-9 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm uppercase tracking-[0.22em] sm:text-[15px]">SolarPick</span>
            <span className="hidden text-[11px] font-extrabold uppercase tracking-wide text-muted sm:block">Solar sizing studio</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => linkClass(isActive && (item.to !== '/' || location.pathname === '/'))}>
              {item.label}
            </NavLink>
          ))}
          {location.pathname === '/' && (
            <a href="#faq" className={linkClass(false)}>
              FAQ
            </a>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="hidden items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-amber-800 lg:inline-flex">
            <SunMedium size={14} />
            BG solar
          </div>
          <UserMenu onAuth={onAuth} onProfile={onProfile} />
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-slate-100 text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Меню"
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
            className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/80 bg-white/96 p-3 shadow-card-md backdrop-blur-xl md:hidden"
          >
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-sky">
              <Sparkles size={14} />
              Smart energy advisor
            </div>
            <div className="grid gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} onClick={close} className={({ isActive }) => mobileLinkClass(isActive && (item.to !== '/' || location.pathname === '/'))}>
                  {item.label}
                </NavLink>
              ))}
              {location.pathname === '/' && (
                <a href="#faq" onClick={close} className={mobileLinkClass(false)}>
                  FAQ
                </a>
              )}
            </div>
            <div className="mt-3 border-t border-border pt-3">
              <UserMenu onAuth={onAuth} onProfile={onProfile} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
