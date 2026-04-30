import type React from 'react';
import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function LoginModal({ open, onClose, onSwitch }: { open: boolean; onClose: () => void; onSwitch: () => void }) {
  const { login } = useAuth();
  const [error, setError] = useState('');
  if (!open) return null;
  return <AuthShell title="Вход" onClose={onClose}>{error && <p className="rounded-xl border border-danger/30 bg-danger/12 p-3 text-sm text-red-100">{error}</p>}<form className="mt-4 grid gap-3" onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); try { await login(String(fd.get('email')), String(fd.get('password'))); onClose(); } catch (err) { setError(err instanceof Error ? err.message : 'Опитай отново.'); } }}><input name="email" type="email" placeholder="Email" className="premium-input px-3 py-3" /><input name="password" type="password" placeholder="Парола" className="premium-input px-3 py-3" /><button className="premium-button bg-gradient-to-r from-mint to-cyan text-navy">Вход</button></form><button onClick={onSwitch} className="mt-3 text-sm font-bold text-mint">Нямаш профил? Регистрация</button></AuthShell>;
}

export function AuthShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-navy/75 p-4 backdrop-blur-xl">
      <div className="grid w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#071a2f] shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden border-r border-white/10 bg-mint/10 p-6 md:block">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-mint">SolarWise profile</div>
          <h2 className="mt-4 text-3xl font-black text-white">Запазвай системи и сравнявай сценарии.</h2>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-200">
            {['Запазвай системи', 'Добавяй собствени уреди', 'Сравнявай сценарии'].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 size={17} className="text-mint" />{item}</span>)}
          </div>
        </div>
        <div className="p-6">
          <button className="float-right text-white" onClick={onClose} aria-label="Затвори"><X /></button>
          <h2 className="text-2xl font-black text-white">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
