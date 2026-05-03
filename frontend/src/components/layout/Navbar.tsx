import { Menu, SunMedium, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { UserMenu } from '../auth/UserMenu';

const links = [
  ['Начало', 'top'],
  ['Оценка', 'assessment'],
  ['Как работи', 'value'],
  ['FAQ', 'faq']
];

export function Navbar({ onAuth, onProfile }: { onAuth: (mode: 'login' | 'register') => void; onProfile: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-white/12 bg-[#02050a]/74 px-3 py-2.5 shadow-card backdrop-blur-2xl sm:px-4">
        <a href="#top" onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3 font-black text-white">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gradient-to-br from-solar to-mint text-navy shadow-glow">
            <SunMedium size={20} />
          </span>
          <span className="truncate text-sm tracking-wide sm:text-base">SolarWise BG</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="rounded-md px-4 py-2 text-sm font-bold text-muted transition hover:bg-white/8 hover:text-white">
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:block"><UserMenu onAuth={onAuth} onProfile={onProfile} /></div>

        <button
          className="grid h-11 w-11 place-items-center rounded-md border border-white/12 bg-white/8 text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Меню"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="mx-auto mt-2 max-w-7xl rounded-lg border border-white/12 bg-[#02050a]/94 p-3 shadow-card backdrop-blur-2xl md:hidden"
          >
            <div className="grid gap-1">
              {links.map(([label, id]) => (
                <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="rounded-md px-4 py-3 text-base font-bold text-white active:bg-white/8">
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-3 border-t border-white/10 pt-3"><UserMenu onAuth={onAuth} onProfile={onProfile} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
