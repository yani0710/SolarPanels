import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserMenu({ onAuth }: { onAuth: (mode: 'login' | 'register') => void }) {
  const { user, logout } = useAuth();
  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm text-white">
        <span className="inline-flex items-center gap-2 font-bold"><User size={16} /> {user.name}</span>
        <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/8" aria-label="Изход"><LogOut size={16} /></button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <button onClick={() => onAuth('login')} className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold text-white">Вход</button>
      <button onClick={() => onAuth('register')} className="rounded-full bg-gradient-to-r from-mint to-cyan px-4 py-2 text-sm font-black text-navy">Регистрация</button>
    </div>
  );
}
