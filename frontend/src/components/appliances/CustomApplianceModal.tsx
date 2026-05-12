import { motion } from 'framer-motion';
import { BatteryCharging, Save, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { createCustomAppliance } from '../../api/appliances';
import type { ApplianceCategory, ApplianceInput, UsageTime } from '../../types';

export function CustomApplianceModal({ open, onClose, onCreate, onRequireRegister }: { open: boolean; onClose: () => void; onCreate: (item: ApplianceInput) => void; onRequireRegister: () => void }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  if (!user) {
    return (
      <Modal onClose={onClose} closeLabel={t('Common', 'Close')}>
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-energy/30 bg-amber-50 p-5">
            <BatteryCharging className="text-energy" />
            <h3 className="mt-4 text-2xl font-black text-heading">{t('Appliance', 'Save own appliances')}</h3>
            <p className="mt-2 leading-7 text-muted">{t('Appliance', 'Create a free profile to save your appliances and use them in different solar scenarios.')}</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-heading">{t('Appliance', 'Profile required')}</h3>
            <p className="mt-2 leading-7 text-muted">{t('Appliance', 'Own appliances are saved to your account so they do not disappear after refresh.')}</p>
            <button onClick={() => { onClose(); onRequireRegister(); }} className="btn-primary mt-5">{t('Appliance', 'Create free profile')}</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} closeLabel={t('Common', 'Close')}>
      <h3 className="text-2xl font-black text-heading">{t('Appliance', 'New custom appliance')}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{t('CustomApplianceModal', 'Fill what you know. If unsure about power, enter an approximate value.')}</p>
      {error && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form
        className="mt-4 grid max-h-[72vh] gap-3 overflow-auto pr-1"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setSaving(true);
          setError('');
          try {
            const payload = {
              name: String(data.get('name') || t('Appliance', 'Custom appliance')).trim() || t('Appliance', 'Custom appliance'),
              category: String(data.get('category') || 'custom'),
              count: Number(data.get('count') || 1),
              wattage: Number(data.get('wattage') || 500),
              hoursPerDay: Number(data.get('hoursPerDay') || 2),
              daysPerMonth: Number(data.get('daysPerMonth') || 20),
              usageTime: String(data.get('usageTime') || 'unknown'),
              seasonality: String(data.get('seasonality') || 'year-round'),
              isCritical: data.get('isCritical') === 'on',
              highStartLoad: data.get('highStartLoad') === 'on',
              certainty: String(data.get('certainty') || 'approximate'),
              workPattern: String(data.get('workPattern') || 'daily'),
              note: String(data.get('note') || '')
            };
            if (payload.count <= 0 || payload.wattage <= 0 || payload.hoursPerDay < 0 || payload.daysPerMonth <= 0) {
              throw new Error(t('Appliance', 'Check the count, power, hours and days — values must be positive.'));
            }
            const { appliance } = await createCustomAppliance(payload);
            onCreate(appliance);
            onClose();
          } catch (err) {
            setError(err instanceof Error ? err.message : t('Appliance', 'Appliance was not saved.'));
          } finally {
            setSaving(false);
          }
        }}
      >
        <Input name="name" label={t('Appliance', 'Appliance name')} defaultValue={t('Appliance', 'Custom appliance')} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select name="category" label={t('Appliance', 'Category')} options={[
            ['kitchen', t('Appliance', 'Kitchen')], ['hotWater', t('Appliance', 'Hot water')], ['heatingCooling', t('Appliance', 'Heating/Cooling')], ['laundry', t('Appliance', 'Laundry')],
            ['electronics', 'Electronics'], ['lighting', 'Lighting'], ['outdoor', t('Appliance', 'Yard')], ['transport', 'Transport'], ['business', t('Appliance', 'Business')], ['custom', t('Appliance', 'Custom category')]
          ] satisfies Array<[ApplianceCategory, string]>} />
          <Input name="count" label={t('Appliance', 'Count')} type="number" defaultValue="1" min="1" step="1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input name="wattage" label={t('Appliance', 'Power (W)')} type="number" defaultValue="500" min="1" step="1" />
          <Input name="hoursPerDay" label={t('Appliance', 'Hours/day')} type="number" defaultValue="2" min="0" max="24" step="0.5" />
          <Input name="daysPerMonth" label={t('Appliance', 'Days/month')} type="number" defaultValue="20" min="1" max="31" step="1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select name="usageTime" label={t('Appliance', 'When does it run')} options={[
            ['morning', t('Appliance', 'Morning')], ['day', t('Appliance', 'Day')], ['evening', t('Appliance', 'Evening')], ['night', t('Appliance', 'Night')], ['constant', t('Appliance', 'Constant')], ['varies', t('Appliance', 'Varies')], ['unknown', t('QuickAssessment', 'I do not know')]
          ] satisfies Array<[UsageTime, string]>} />
          <Select name="seasonality" label={t('Appliance', 'Seasonality')} options={[
            ['year-round', t('Appliance', 'Year-round')], ['summer', t('Appliance', 'Summer')], ['winter', t('Appliance', 'Winter')], ['weekends', t('Appliance', 'Weekends')], ['unknown', t('QuickAssessment', 'I do not know')]
          ]} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select name="certainty" label={t('Appliance', 'Data certainty')} options={[
            ['average', t('Appliance', 'Average value')], ['approximate', t('Appliance', 'Approximate')], ['accurate', t('Appliance', 'Quite accurate')], ['spec', t('Appliance', 'From label/spec')]
          ]} />
          <Select name="workPattern" label={t('Appliance', 'Work pattern')} options={[
            ['daily', t('Appliance', 'Daily')], ['weekdays', t('Appliance', 'Weekdays')], ['weekends', t('Appliance', 'Weekends')], ['seasonal', t('Appliance', 'Seasonal')], ['varies', t('Appliance', 'Varies')], ['unknown', t('QuickAssessment', 'I do not know')]
          ]} />
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-slate-50 px-3 text-sm font-semibold text-slate-700 hover:border-energy hover:bg-amber-50 transition">
          <input type="checkbox" name="isCritical" className="accent-amber-500" /> {t('Appliance', 'Critical during outage')}
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-slate-50 px-3 text-sm font-semibold text-slate-700 hover:border-energy hover:bg-amber-50 transition">
          <input type="checkbox" name="highStartLoad" className="accent-amber-500" /> {t('Appliance', 'High startup current')}
        </label>
        <label>
          <span className="mb-1 block text-sm font-bold text-heading">{t('Appliance', 'Note')}</span>
          <textarea name="note" rows={3} className="input-field px-3 py-2" placeholder={t('Appliance', 'E.g. runs only in winter')} />
        </label>
        <button disabled={saving} className="btn-primary disabled:opacity-60">
          <Save size={17} />{saving ? t('Appliance', 'Saving...') : t('Appliance', 'Save appliance')}
        </button>
      </form>
    </Modal>
  );
}

function Modal({ children, onClose, closeLabel }: { children: React.ReactNode; onClose: () => void; closeLabel: string }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="card w-full max-w-3xl p-5 shadow-2xl sm:p-6">
        <button className="float-right grid h-10 w-10 place-items-center rounded-xl border border-border bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer" onClick={onClose} aria-label={closeLabel}><X /></button>
        {children}
      </motion.div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label>
      <span className="mb-1 block text-sm font-bold text-heading">{label}</span>
      <input {...inputProps} className="input-field px-3 py-2" />
    </label>
  );
}

function Select({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: Array<[string, string]> }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-bold text-heading">{label}</span>
      <select {...props} className="input-field px-3 py-2">
        {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
      </select>
    </label>
  );
}
