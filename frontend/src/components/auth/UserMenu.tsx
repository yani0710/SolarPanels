import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserMenu({ onAuth, onProfile }: { onAuth: (mode: 'login' | 'register') => void; onProfile: () => void }) {
  const { user, logout } = useAuth();
  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <button onClick={onProfile} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 font-bold text-heading hover:bg-slate-200 transition cursor-pointer">
          <User size={16} /> {user.name}
        </button>
        <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer" aria-label="Изход">
          <LogOut size={16} />
        </button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <button onClick={() => onAuth('login')} className="btn-secondary min-h-[40px] px-4 py-2 text-sm">Вход</button>
      <button onClick={() => onAuth('register')} className="btn-primary min-h-[40px] px-4 py-2 text-sm">Регистрация</button>
    </div>
  );
}
