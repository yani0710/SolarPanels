import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export function UserMenu({ onAuth, onProfile }: { onAuth: (mode: 'login' | 'register') => void; onProfile: () => void }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={onProfile}
          className={"inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-bold transition " + (isLight ? "border-slate-200 bg-slate-100 text-navy hover:border-sky-300 hover:bg-sky-50" : "border border-white/10 bg-white/[0.06] text-[#F5F7FA] hover:border-[#4FD1FF]/30 hover:bg-white/[0.09]")}
        >
          <User size={16} /> {user.name}
        </button>
        <button
          onClick={logout}
          className={"grid h-10 w-10 place-items-center rounded-lg border transition " + (isLight ? "border-slate-200 bg-slate-100 text-slate-500 hover:border-amber-300 hover:bg-amber-50 hover:text-energy" : "border border-white/10 bg-white/[0.06] text-[#AAB3C2] hover:border-[#FFD166]/30 hover:bg-[#FFD166]/10 hover:text-[#FFD166]")}
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => onAuth('login')} className="btn-secondary min-h-[40px] px-4 py-2 text-sm">{t('UserMenu', 'Sign in')}</button>
      <button onClick={() => onAuth('register')} className="btn-primary min-h-[40px] px-4 py-2 text-sm">{t('UserMenu', 'Create account')}</button>
    </div>
  );
}