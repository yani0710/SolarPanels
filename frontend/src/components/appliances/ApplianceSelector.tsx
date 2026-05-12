import { BriefcaseBusiness, Car, Droplets, Flame, Home, Laptop, Lightbulb, Plus, Search, Shirt, Snowflake, Utensils, Zap } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { APPLIANCE_PRESETS } from '../../data/appliancePresets';
import type { ApplianceCategory, ApplianceInput } from '../../types';
import { AppliancePresetCard } from './AppliancePresetCard';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedText } from '../../utils/applianceTranslations';

const categoryMeta: Record<ApplianceCategory | 'all', { label: { bg: string; en: string }; icon: React.ReactNode }> = {
  all: { label: { bg: 'Всички', en: 'All' }, icon: <Zap size={18} /> },
  kitchen: { label: { bg: 'Кухня', en: 'Kitchen' }, icon: <Utensils size={18} /> },
  hotWater: { label: { bg: 'Топла вода', en: 'Hot Water' }, icon: <Droplets size={18} /> },
  heatingCooling: { label: { bg: 'Отопление и охлаждане', en: 'Heating & Cooling' }, icon: <Snowflake size={18} /> },
  laundry: { label: { bg: 'Пране', en: 'Laundry' }, icon: <Shirt size={18} /> },
  electronics: { label: { bg: 'Електроника', en: 'Electronics' }, icon: <Laptop size={18} /> },
  lighting: { label: { bg: 'Осветление', en: 'Lighting' }, icon: <Lightbulb size={18} /> },
  outdoor: { label: { bg: 'Двор и помпи', en: 'Yard & Pumps' }, icon: <Home size={18} /> },
  transport: { label: { bg: 'Транспорт', en: 'Transport' }, icon: <Car size={18} /> },
  business: { label: { bg: 'Бизнес', en: 'Business' }, icon: <BriefcaseBusiness size={18} /> },
  custom: { label: { bg: 'Собствени', en: 'Custom' }, icon: <Flame size={18} /> }
};

export function ApplianceSelector({ selected, customAppliances, onChange, onCustom }: { selected: ApplianceInput[]; customAppliances: ApplianceInput[]; onChange: (items: ApplianceInput[]) => void; onCustom: () => void }) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ApplianceCategory | 'all'>('all');

  const toggle = (appliance: ApplianceInput) => {
    const exists = selected.some((item) => item.id === appliance.id);
    onChange(exists ? selected.filter((item) => item.id !== appliance.id) : [...selected, appliance]);
  };

  const allAppliances = useMemo(() => [...customAppliances, ...APPLIANCE_PRESETS], [customAppliances]);
  const filtered = allAppliances.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const text = `${item.name} ${item.label} ${item.explanation}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  });

  return (
    <div className="min-w-0">
      <div className="mb-4 grid gap-3 sm:flex sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-xl font-black text-white">Appliance configurator</h3>
          <p className="mt-1 text-sm leading-6 text-muted">Добави уреди чрез търсене, категории или quick chips. Сложните настройки са само когато ти трябват.</p>
        </div>
        <button type="button" onClick={onCustom} className="premium-button border border-mint/40 bg-mint/12 text-mint hover:-translate-y-0.5">
          <Plus size={17} /> Добави собствен уред
        </button>
      </div>

      <label className="mb-3 flex min-h-12 items-center gap-2 rounded-lg border border-white/12 bg-white/[0.055] px-4 shadow-sm">
        <Search size={18} className="text-cyan" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Потърси уред..." className="min-h-0 flex-1 border-0 bg-transparent p-0 text-white outline-none placeholder:text-muted/70" />
      </label>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(categoryMeta) as Array<ApplianceCategory | 'all'>).map((id) => (
          <button key={id} type="button" onClick={() => setCategory(id)} className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold ${category === id ? 'border-mint bg-mint/15 text-white shadow-glow' : 'border-white/12 bg-white/[0.055] text-slate-300 hover:border-cyan/40 hover:bg-white/[0.075]'}`}>
            {categoryMeta[id].icon}{categoryMeta[id].label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {quickChips.map((chip) => <button key={chip} type="button" onClick={() => setQuery(chip)} className="rounded-md bg-white/8 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/12 hover:text-white">{chip}</button>)}
      </div>

      {customAppliances.length > 0 && (
        <div className="mb-5 rounded-lg border border-mint/25 bg-mint/8 p-3">
          <h4 className="mb-3 px-1 text-sm font-black text-white">Моите уреди</h4>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {customAppliances.filter((item) => `${item.name} ${item.label}`.toLowerCase().includes(query.toLowerCase())).map((preset) => <AppliancePresetCard key={preset.id} preset={preset} selected={selected.some((item) => item.id === preset.id)} onToggle={toggle} />)}
          </div>
        </div>
      )}

      <div className="grid max-h-[560px] gap-3 overflow-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((preset) => <AppliancePresetCard key={preset.id} preset={preset} selected={selected.some((item) => item.id === preset.id)} onToggle={toggle} />)}
      </div>
    </div>
  );
}
