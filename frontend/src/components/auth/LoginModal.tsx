import type React from 'react';
import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../../assets/SolarPick.png';

export function LoginModal({ open, onClose, onSwitch }: { open: boolean; onClose: () => void; onSwitch: () => void }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState('');
  if (!open) return null;
  return (
    <AuthShell title={t('LoginModal', 'Sign in')} onClose={onClose}>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <form className="mt-4 grid gap-3" onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        try {
          await login(String(fd.get('email')), String(fd.get('password')));
          onClose();
        } catch (err) {
          setError(err instanceof Error ? err.message : t('LoginModal', 'Try again.'));
        }
      }}>
        <input name="email" type="email" placeholder="Email" className="input-field px-3 py-3" />
        <input name="password" type="password" placeholder={t('LoginModal', 'Password')} className="input-field px-3 py-3" />
        <button className="btn-primary w-full">{t('LoginModal', 'Sign in')}</button>
      </form>
      <button onClick={onSwitch} className="mt-3 text-sm font-bold text-energy hover:underline cursor-pointer">
        {t('LoginModal', 'No account? Register')}
      </button>
    </AuthShell>
  );
}

export function AuthShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative z-10 grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        {/* Left panel */}
        <div className="hidden border-r border-border bg-gradient-to-br from-amber-50 via-amber-50/70 to-white p-6 md:block">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-energy flex items-center gap-2">
            <img src={Logo} alt="SolarPick Logo" className="h-7 w-7 rounded object-cover" />
            SolarPick profile
          </div>
          <h2 className="mt-4 text-3xl font-black text-heading">{t('LoginModal', 'Save systems and compare scenarios.')}</h2>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700">
            {[t('LoginModal', 'Save systems'), t('LoginModal', 'Add custom appliances'), t('LoginModal', 'Compare scenarios')].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-energy" />{item}
              </span>
            ))}
          </div>
        </div>
        {/* Right panel */}
        <div className="p-6">
          <button
            className="float-right grid h-9 w-9 place-items-center rounded-xl border border-border bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            onClick={onClose}
            aria-label={t('Common', 'Close')}
          >
            <X size={18} />
          </button>
          <h2 className="text-2xl font-black text-heading">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}