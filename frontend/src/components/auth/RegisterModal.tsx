import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuthShell } from './LoginModal';

export function RegisterModal({ open, onClose, onSwitch }: { open: boolean; onClose: () => void; onSwitch: () => void }) {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState('');
  if (!open) return null;
  return (
    <AuthShell title={t('RegisterModal', 'Free account')} onClose={onClose}>
      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <form className="mt-4 grid gap-3" onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        try {
          await register(String(fd.get('name')), String(fd.get('email')), String(fd.get('password')));
          onClose();
        } catch (err) {
          setError(err instanceof Error ? err.message : t('RegisterModal', 'Try again.'));
        }
      }}>
        <input name="name" placeholder={t('RegisterModal', 'Name')} className="input-field px-3 py-3" />
        <input name="email" type="email" placeholder="Email" className="input-field px-3 py-3" />
        <input name="password" type="password" placeholder={t('LoginModal', 'Password')} className="input-field px-3 py-3" />
        <button className="btn-primary w-full">{t('RegisterModal', 'Create profile')}</button>
      </form>
      <button onClick={onSwitch} className="mt-3 text-sm font-bold text-energy hover:underline cursor-pointer">
        {t('RegisterModal', 'Already have an account? Sign in')}
      </button>
    </AuthShell>
  );
}