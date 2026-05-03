import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthShell } from './LoginModal';

export function RegisterModal({ open, onClose, onSwitch }: { open: boolean; onClose: () => void; onSwitch: () => void }) {
  const { register } = useAuth();
  const [error, setError] = useState('');
  if (!open) return null;
  return <AuthShell title="Безплатен профил" onClose={onClose}>{error && <p className="mt-4 rounded-lg border border-danger/30 bg-danger/12 p-3 text-sm text-red-100">{error}</p>}<form className="mt-4 grid gap-3" onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); try { await register(String(fd.get('name')), String(fd.get('email')), String(fd.get('password'))); onClose(); } catch (err) { setError(err instanceof Error ? err.message : 'Опитай отново.'); } }}><input name="name" placeholder="Име" className="premium-input px-3 py-3" /><input name="email" type="email" placeholder="Email" className="premium-input px-3 py-3" /><input name="password" type="password" placeholder="Парола" className="premium-input px-3 py-3" /><button className="premium-button bg-gradient-to-r from-mint to-cyan text-navy">Създай профил</button></form><button onClick={onSwitch} className="mt-3 text-sm font-bold text-mint">Вече имаш профил? Вход</button></AuthShell>;
}
