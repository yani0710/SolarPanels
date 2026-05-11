import { motion } from 'framer-motion';
import { BatteryCharging, Save, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createCustomAppliance } from '../../api/appliances';
import type { ApplianceCategory, ApplianceInput, UsageTime } from '../../types';

export function CustomApplianceModal({ open, onClose, onCreate, onRequireRegister }: { open: boolean; onClose: () => void; onCreate: (item: ApplianceInput) => void; onRequireRegister: () => void }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  if (!user) {
    return (
      <Modal onClose={onClose}>
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-energy/30 bg-amber-50 p-5">
            <BatteryCharging className="text-energy" />
            <h3 className="mt-4 text-2xl font-black text-heading">Запази собствени уреди</h3>
            <p className="mt-2 leading-7 text-muted">Създай безплатен профил, за да пазиш свои уреди и да ги използваш в различни соларни сценарии.</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-heading">Нужен е профил</h3>
            <p className="mt-2 leading-7 text-muted">Собствените уреди се пазят към акаунта ти, за да не изчезват след refresh.</p>
            <button onClick={() => { onClose(); onRequireRegister(); }} className="btn-primary mt-5">Създай безплатен профил</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-2xl font-black text-heading">Нов собствен уред</h3>
      <p className="mt-2 text-sm leading-6 text-muted">Попълни това, което знаеш. Ако не си сигурен за мощността, въведи приблизителна стойност.</p>
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
              name: String(data.get('name') || 'Собствен уред').trim() || 'Собствен уред',
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
              throw new Error('Провери броя, мощността, часовете и дните. Стойностите трябва да са положителни.');
            }
            const { appliance } = await createCustomAppliance(payload);
            onCreate(appliance);
            onClose();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Уредът не беше запазен.');
          } finally {
            setSaving(false);
          }
        }}
      >
        <Input name="name" label="Име на уреда" defaultValue="Собствен уред" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select name="category" label="Категория" options={[
            ['kitchen', 'Кухня'], ['hotWater', 'Топла вода'], ['heatingCooling', 'Отопление/охлаждане'], ['laundry', 'Пране'],
            ['electronics', 'Електроника'], ['lighting', 'Осветление'], ['outdoor', 'Двор'], ['transport', 'Транспорт'], ['business', 'Бизнес'], ['custom', 'Собствен']
          ] satisfies Array<[ApplianceCategory, string]>} />
          <Input name="count" label="Брой" type="number" defaultValue="1" min="1" step="1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input name="wattage" label="Мощност W" type="number" defaultValue="500" min="1" step="1" />
          <Input name="hoursPerDay" label="Часове/ден" type="number" defaultValue="2" min="0" max="24" step="0.5" />
          <Input name="daysPerMonth" label="Дни/месец" type="number" defaultValue="20" min="1" max="31" step="1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select name="usageTime" label="Кога работи" options={[
            ['morning', 'Сутрин'], ['day', 'През деня'], ['evening', 'Вечер'], ['night', 'Нощем'], ['constant', 'Постоянно'], ['varies', 'Различно'], ['unknown', 'Не знам']
          ] satisfies Array<[UsageTime, string]>} />
          <Select name="seasonality" label="Сезонност" options={[
            ['year-round', 'Целогодишно'], ['summer', 'Лято'], ['winter', 'Зима'], ['weekends', 'Само уикенд'], ['unknown', 'Не знам']
          ]} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select name="certainty" label="Сигурност на данните" options={[
            ['average', 'Средна стойност'], ['approximate', 'Приблизително'], ['accurate', 'Доста точно'], ['spec', 'От етикет/спецификация']
          ]} />
          <Select name="workPattern" label="Работа" options={[
            ['daily', 'Всеки ден'], ['weekdays', 'Делнични дни'], ['weekends', 'Уикенд'], ['seasonal', 'Сезонно'], ['varies', 'Различно'], ['unknown', 'Не знам']
          ]} />
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-slate-50 px-3 text-sm font-semibold text-slate-700 hover:border-energy hover:bg-amber-50 transition">
          <input type="checkbox" name="isCritical" className="accent-amber-500" /> Критичен при спиране на тока
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-slate-50 px-3 text-sm font-semibold text-slate-700 hover:border-energy hover:bg-amber-50 transition">
          <input type="checkbox" name="highStartLoad" className="accent-amber-500" /> Висок стартов ток
        </label>
        <label>
          <span className="mb-1 block text-sm font-bold text-heading">Бележка</span>
          <textarea name="note" rows={3} className="input-field px-3 py-2" placeholder="Напр. работи само през зимата" />
        </label>
        <button disabled={saving} className="btn-primary disabled:opacity-60">
          <Save size={17} />{saving ? 'Запазване...' : 'Запази уред'}
        </button>
      </form>
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="card w-full max-w-3xl p-5 shadow-2xl sm:p-6">
        <button className="float-right grid h-10 w-10 place-items-center rounded-xl border border-border bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer" onClick={onClose} aria-label="Затвори"><X /></button>
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
