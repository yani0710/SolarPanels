import { Menu, SunMedium, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserMenu } from '../auth/UserMenu';

export function Navbar({ onAuth, onProfile }: { onAuth: (mode: 'login' | 'register') => void; onProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const close = () => setOpen(false);

  const linkClass = (active: boolean) =>
    `rounded-xl px-4 py-2 text-sm font-semibold transition ${active ? 'bg-green-50 text-energy' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`;

  const mobileLinkClass = (active: boolean) =>
    `block rounded-xl px-4 py-3 text-base font-semibold transition ${active ? 'bg-green-50 text-energy' : 'text-heading hover:bg-slate-50 active:bg-slate-100'}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border bg-white/90 px-3 py-2.5 shadow-card backdrop-blur-xl sm:px-4">
        {/* Logo */}
        <Link to="/" onClick={close} className="flex min-w-0 items-center gap-3 font-black text-heading">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-solar to-energy text-white shadow-green">
            <SunMedium size={20} />
          </span>
          <span className="truncate text-sm tracking-wide sm:text-base">SolarWise BG</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={({ isActive }) => linkClass(isActive && location.pathname === '/')}>
            Начало
          </NavLink>
          <NavLink to="/byrza-otsenka" className={({ isActive }) => linkClass(isActive)}>
            Бърза оценка
          </NavLink>
          <NavLink to="/detaylna-otsenka" className={({ isActive }) => linkClass(isActive)}>
            Детайлна оценка
          </NavLink>
          {location.pathname === '/' && (
            <a href="#faq" className={linkClass(false)}>FAQ</a>
          )}
        </div>

        <div className="hidden md:block">
          <UserMenu onAuth={onAuth} onProfile={onProfile} />
        </div>

        {/* Mobile hamburger */}
        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-slate-100 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-2 max-w-7xl rounded-2xl border border-border bg-white p-3 shadow-card-md md:hidden"
          >
            <div className="grid gap-1">
              <NavLink to="/" end onClick={close} className={({ isActive }) => mobileLinkClass(isActive && location.pathname === '/')}>
                Начало
              </NavLink>
              <NavLink to="/byrza-otsenka" onClick={close} className={({ isActive }) => mobileLinkClass(isActive)}>
                Бърза оценка
              </NavLink>
              <NavLink to="/detaylna-otsenka" onClick={close} className={({ isActive }) => mobileLinkClass(isActive)}>
                Детайлна оценка
              </NavLink>
              {location.pathname === '/' && (
                <a href="#faq" onClick={close} className={mobileLinkClass(false)}>FAQ</a>
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
