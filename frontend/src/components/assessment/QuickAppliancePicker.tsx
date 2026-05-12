import { Car, Check, ChevronDown, ChevronUp, Droplets, Lightbulb, Plus, Shirt, Snowflake, Tv, Utensils, X, Zap, type LucideIcon } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { QUICK_APPLIANCE_GROUPS } from '../../data/quickApplianceGroups';
import type { ApplianceInput } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedText } from '../../utils/applianceTranslations';

const groupIcons: Record<string, LucideIcon> = {
  boiler: Droplets,
  heatingCooling: Snowflake,
  kitchen: Utensils,
  laundry: Shirt,
  electronics: Tv,
  lighting: Lightbulb,
  transport: Car,
  outdoor: Zap
};

interface SelectedAppliance {
  groupId: string;
  optionId: string;
  count: number;
  detail?: string;
  boilerMode?: 'small' | 'standard' | 'large' | 'custom' | 'unknown';
  sizeMode?: 'small' | 'standard' | 'large' | 'custom' | 'unknown';
  unitBoilerModes?: Array<'small' | 'standard' | 'large' | 'custom' | 'unknown'>;
  unitSizeModes?: Array<'small' | 'standard' | 'large' | 'custom' | 'unknown'>;
  unitPowerModes: Array<'unknown' | 'custom'>;
  unitKwValues: string[];
  intensity: 'low' | 'medium' | 'high' | 'unknown';
  durationPerDay: 'minimal' | 'short' | 'medium' | 'long' | 'constant' | 'unknown';
}

export const QuickAppliancePicker = forwardRef<
  { getAppliances: () => ApplianceInput[] },
  {
    selections: Record<string, string[]>;
    onChange: (next: Record<string, string[]>) => void;
    customAppliances?: ApplianceInput[];
    selectedCustom?: string[];
    onCustomChange?: (ids: string[]) => void;
  }
>(function QuickAppliancePickerComponent(
  { selections, onChange, customAppliances = [], selectedCustom = [], onCustomChange },
  ref
) {
  const { t, language } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set([QUICK_APPLIANCE_GROUPS[0]?.id ?? ''])
  );
  const [selectedAppliances, setSelectedAppliances] = useState<SelectedAppliance[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const intensityOptions = [
    { id: 'low', label: t('QuickAppliancePicker', 'Rarely') },
    { id: 'medium', label: t('QuickAppliancePicker', 'Medium frequency') },
    { id: 'high', label: t('QuickAppliancePicker', 'Often') },
    { id: 'unknown', label: t('QuickAssessment', 'I do not know') }
  ];

  const durationPerDayOptions = [
    { id: 'unknown', label: t('QuickAssessment', 'I do not know') },
    { id: 'minimal', label: t('QuickAppliancePicker', '< 1 hr') },
    { id: 'short', label: t('QuickAppliancePicker', '1-3 hrs') },
    { id: 'medium', label: t('QuickAppliancePicker', '3-6 hrs') },
    { id: 'long', label: t('QuickAppliancePicker', '6-12 hrs') },
    { id: 'constant', label: t('QuickAppliancePicker', 'All day') }
  ];

  const sizeModes = [
    { id: 'small', label: t('QuickAppliancePicker', 'Small') },
    { id: 'standard', label: t('QuickAppliancePicker', 'Standard') },
    { id: 'large', label: t('QuickAppliancePicker', 'Large') },
    { id: 'unknown', label: t('QuickAppliancePicker', 'Unknown') },
    { id: 'custom', label: 'Custom' }
  ];

  const sizeAbbrev = (mode: string): string => {
    const map: Record<string, { bg: string; en: string }> = {
      small: { bg: 'М', en: 'S' }, standard: { bg: 'С', en: 'M' }, large: { bg: 'Г', en: 'L' }, custom: { bg: 'C', en: 'C' }
    };
    return map[mode]?.[language] ?? '?';
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const toggleCustom = (id: string) => {
    if (!onCustomChange) return;
    onCustomChange(selectedCustom.includes(id) ? selectedCustom.filter((item) => item !== id) : [...selectedCustom, id]);
  };

  const generateAppliances = (): ApplianceInput[] => {
    const intensityMultiplier = (intensity: 'low' | 'medium' | 'high' | 'unknown' = 'unknown') => {
      if (intensity === 'low') return 0.75;
      if (intensity === 'high') return 1.35;
      return 1;
    };
    const litersToKwh = (liters: number) => Math.max(0.5, liters * 0.04);
    const durationToHours = (duration: 'minimal' | 'short' | 'medium' | 'long' | 'constant' | 'unknown') => {
      if (duration === 'minimal') return 0.5;
      if (duration === 'short') return 2;
      if (duration === 'medium') return 4.5;
      if (duration === 'long') return 9;
      if (duration === 'constant') return 24;
      return 2;
    };
    return selectedAppliances.map((appliance, index) => {
      const group = QUICK_APPLIANCE_GROUPS.find((g) => g.id === appliance.groupId)!;
      const option = group.options.find((o) => o.id === appliance.optionId)!;
      const boilerMode = appliance.boilerMode ?? 'unknown';
      const sizeMode = appliance.groupId === 'boiler' ? 'unknown' : (appliance.sizeMode ?? 'unknown');
      const isCustomBoiler = appliance.groupId === 'boiler' && boilerMode === 'custom';
      const isFreezer = appliance.optionId === 'freezer';
      const freezerLiters = Number(appliance.detail ?? option.detailDefault ?? 220);
      const freezerKwh = Math.max(0.25, (freezerLiters / 220) * option.kwhPerDay);
      const boilerPresetKwh = boilerMode === 'small' ? 2.2 : boilerMode === 'standard' ? 3.2 : boilerMode === 'large' ? 5 : 3.2;
      const bonusKwh = isCustomBoiler
        ? litersToKwh(Number(appliance.detail ?? option.detailDefault ?? 80))
        : appliance.groupId === 'boiler' ? boilerPresetKwh
        : isFreezer ? freezerKwh
        : option.kwhPerDay;
      const hours = durationToHours(appliance.durationPerDay);
      const presetKwhPerDay = ((bonusKwh * intensityMultiplier(appliance.intensity)) * hours) / 24;
      const perUnitKwh = Array.from({ length: appliance.count }).reduce<number>((sum, _, unitIdx) => {
        const unitBoilerMode = appliance.unitBoilerModes?.[unitIdx] || appliance.boilerMode;
        const unitSizeMode = appliance.unitSizeModes?.[unitIdx] || appliance.sizeMode;
        const unitMode = appliance.unitPowerModes[unitIdx] ?? 'unknown';
        const unitKw = Number(appliance.unitKwValues[unitIdx] ?? 0);
        if (appliance.groupId === 'boiler') {
          const isFixedUnitBoilerPreset = unitBoilerMode !== 'custom';
          const isCustomUnitOption = unitBoilerMode === 'custom';
          if (isFixedUnitBoilerPreset) {
            const unitBoilerKwh = unitBoilerMode === 'small' ? 2.2 : unitBoilerMode === 'standard' ? 3.2 : unitBoilerMode === 'large' ? 5 : 3.2;
            return sum + ((unitBoilerKwh * intensityMultiplier(appliance.intensity)) * hours) / 24;
          }
          if (isCustomUnitOption) return sum + (Number.isFinite(unitKw) && unitKw > 0 ? unitKw * hours : 0);
          return sum + presetKwhPerDay;
        } else {
          const isFixedUnitSizePreset = unitSizeMode !== 'custom';
          const isCustomUnitSize = unitSizeMode === 'custom';
          if (isFixedUnitSizePreset) {
            const unitKwh = option.sizeKwhPerDay?.[unitSizeMode as 'small' | 'standard' | 'large' | 'unknown'] ?? option.kwhPerDay;
            return sum + ((unitKwh * intensityMultiplier(appliance.intensity)) * hours) / 24;
          }
          if (isCustomUnitSize) return sum + (Number.isFinite(unitKw) && unitKw > 0 ? unitKw * hours : 0);
          if (unitMode === 'custom') return sum + (Number.isFinite(unitKw) && unitKw > 0 ? unitKw * hours : 0);
          return sum + ((option.sizeKwhPerDay?.[unitSizeMode as 'small' | 'standard' | 'large' | 'unknown'] ?? option.kwhPerDay) * intensityMultiplier(appliance.intensity) * hours) / 24;
        }
      }, 0);

      const groupTitleBg = getLocalizedText(group.title, 'bg');
      const groupTitleEn = getLocalizedText(group.title, 'en');
      const optionLabelBg = getLocalizedText(option.label, 'bg');
      const optionLabelEn = getLocalizedText(option.label, 'en');
      const sizeLabelBg = (mode: string) => mode === 'small' ? 'Малък' : mode === 'standard' ? 'Среден' : mode === 'large' ? 'Голям' : mode === 'custom' ? 'Custom' : 'Не знам';
      const sizeLabelEn = (mode: string) => mode === 'small' ? 'Small' : mode === 'standard' ? 'Standard' : mode === 'large' ? 'Large' : mode === 'custom' ? 'Custom' : 'Unknown';

      const labelBg = appliance.groupId === 'boiler'
        ? appliance.count === 1
          ? `${groupTitleBg}: ${sizeLabelBg(boilerMode)}`
          : `${groupTitleBg}: ${appliance.count} бр. (${appliance.unitBoilerModes?.map(m => sizeAbbrev(m)).join(', ') ?? sizeAbbrev(boilerMode)})`
        : appliance.count === 1
          ? `${groupTitleBg}: ${optionLabelBg} (${sizeLabelBg(sizeMode)})`
          : `${groupTitleBg}: ${optionLabelBg} (${appliance.unitSizeModes?.map(m => sizeAbbrev(m)).join(', ') ?? sizeAbbrev(sizeMode)})`;

      const labelEn = appliance.groupId === 'boiler'
        ? appliance.count === 1
          ? `${groupTitleEn}: ${sizeLabelEn(boilerMode)}`
          : `${groupTitleEn}: ${appliance.count} pcs. (${appliance.unitBoilerModes?.map(m => sizeAbbrev(m)).join(', ') ?? sizeAbbrev(boilerMode)})`
        : appliance.count === 1
          ? `${groupTitleEn}: ${optionLabelEn} (${sizeLabelEn(sizeMode)})`
          : `${groupTitleEn}: ${optionLabelEn} (${appliance.unitSizeModes?.map(m => sizeAbbrev(m)).join(', ') ?? sizeAbbrev(sizeMode)})`;

      return {
        id: `configured-${appliance.groupId}-${appliance.optionId}-${index}`,
        name: group.title,
        category: group.category,
        label: { bg: labelBg, en: labelEn },
        estimatedKwhPerDay: perUnitKwh,
        usageTime: option.usageTime,
        confidence: option.confidence,
        explanation: { bg: `Количество: ${appliance.count}`, en: `Quantity: ${appliance.count}` }
      } as ApplianceInput;
    });
  };

  useImperativeHandle(ref, () => ({ getAppliances: generateAppliances }));

  const addAppliance = (groupId: string, optionId: string) => {
    const group = QUICK_APPLIANCE_GROUPS.find((g) => g.id === groupId);
    const option = group?.options.find((item) => item.id === optionId);
    const newAppliance: SelectedAppliance = {
      groupId, optionId, count: 1, detail: option?.detailDefault?.toString(),
      boilerMode: groupId === 'boiler' ? 'unknown' : undefined,
      sizeMode: groupId === 'boiler' ? undefined : 'unknown',
      unitBoilerModes: groupId === 'boiler' ? ['unknown'] : undefined,
      unitSizeModes: groupId === 'boiler' ? undefined : ['unknown'],
      unitPowerModes: ['unknown'], unitKwValues: ['1'],
      intensity: 'unknown', durationPerDay: 'unknown'
    };
    setSelectedAppliances((prev) => {
      const next = [...prev, newAppliance];
      setEditingIndex(next.length - 1);
      return next;
    });
    if (!group) return;
    const current = selections[groupId] ?? [];
    onChange({ ...selections, [groupId]: Array.from(new Set([...current, optionId])) });
  };

  const focusAppliance = (groupId: string, optionId: string) => {
    const index = selectedAppliances.findIndex((item) => item.groupId === groupId && item.optionId === optionId);
    if (index >= 0) setEditingIndex(index);
  };

  const resizeArray = <T,>(values: T[], count: number, fallback: T) => {
    const next = values.slice(0, count);
    while (next.length < count) next.push(values[values.length - 1] ?? fallback);
    return next;
  };

  const updateAppliance = (index: number, updates: Partial<SelectedAppliance>) =>
    setSelectedAppliances((prev) => { const u = [...prev]; u[index] = { ...u[index], ...updates }; return u; });

  const removeAppliance = (index: number) => {
    const appliance = selectedAppliances[index];
    if (!appliance) return;
    setSelectedAppliances((prev) => prev.filter((_, i) => i !== index));
    setEditingIndex(null);
    const current = selections[appliance.groupId] ?? [];
    onChange({ ...selections, [appliance.groupId]: current.filter((item) => item !== appliance.optionId) });
  };

  const isSelected = (groupId: string, optionId: string) =>
    selectedAppliances.some((item) => item.groupId === groupId && item.optionId === optionId);

  const selectedCountForGroup = (groupId: string) =>
    selectedAppliances.filter((item) => item.groupId === groupId).length;

  const chipActive = 'border-energy bg-amber-50 text-energy';
  const chipInactive = 'border-border bg-white text-slate-700 hover:border-energy hover:bg-amber-50 hover:text-energy';
  const smallBtnActive = 'border-energy bg-amber-50 text-energy';
  const smallBtnInactive = 'border-border bg-white text-slate-700 hover:border-energy hover:bg-amber-50';

  return (
    <div className="space-y-3">
      {/* Accordion categories */}
      {QUICK_APPLIANCE_GROUPS.map((group) => {
        const Icon = groupIcons[group.id];
        const isOpen = expandedGroups.has(group.id);
        const selectedCount = selectedCountForGroup(group.id);
        const groupTitle = getLocalizedText(group.title, language);
        const groupSubtitle = group.subtitle ? getLocalizedText(group.subtitle, language) : undefined;

        return (
          <div key={group.id} className={`rounded-2xl border transition-all ${selectedCount > 0 ? 'border-energy/30' : 'border-border'} bg-white`}>
            {/* Category header */}
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left"
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${selectedCount > 0 ? 'bg-amber-100 text-energy' : 'bg-slate-100 text-slate-500'}`}>
                <Icon size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${selectedCount > 0 ? 'text-heading' : 'text-slate-700'}`}>{groupTitle}</span>
                  {selectedCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-energy px-1.5 text-[10px] font-black text-white">
                      {selectedCount}
                    </span>
                  )}
                </div>
                {groupSubtitle && (
                  <div className="text-[11px] text-muted truncate">{groupSubtitle}</div>
                )}
              </div>
              <span className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={18} className="text-slate-400" />
              </span>
            </button>

            {/* Category body */}
            {isOpen && (
              <div className="border-t border-border/60 px-4 pb-4 pt-3">
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const selected = isSelected(group.id, option.id);
                    const optionLabel = getLocalizedText(option.label, language);
                    const optionSubgroup = option.subgroup ? getLocalizedText(option.subgroup, language) : undefined;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => selected ? focusAppliance(group.id, option.id) : addAppliance(group.id, option.id)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition cursor-pointer ${selected ? chipActive : chipInactive}`}
                      >
                        {optionSubgroup && (
                          <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-muted">{optionSubgroup}</div>
                        )}
                        <div className="flex items-center gap-1.5">
                          {selected
                            ? <Check size={14} className="shrink-0 text-energy" />
                            : <Plus size={14} className="shrink-0 text-slate-400" />}
                          <span>{optionLabel}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-muted">≈ {option.kwhPerDay.toFixed(1)} {t('QuickAppliancePicker', 'kWh/day')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Custom saved appliances */}
      {customAppliances.length > 0 && (
        <div className="rounded-2xl border border-energy/30 bg-amber-50 p-4">
          <div className="mb-3 text-xs font-black uppercase tracking-wide text-energy">{t('Appliance', 'My saved appliances')}</div>
          <div className="flex flex-wrap gap-2">
            {customAppliances.map((item) => {
              const selected = selectedCustom.includes(item.id);
              const name = typeof item.name === 'string' ? item.name : item.name[language];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCustom(item.id)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${selected ? 'border-energy bg-energy text-white' : chipInactive}`}
                >
                  {name} · {item.wattage ?? 0} W
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected appliances detail panel */}
      {selectedAppliances.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-heading">
            {t('QuickAppliancePicker', 'Selected appliances')} ({selectedAppliances.length})
          </div>
          <div className="space-y-2">
            {selectedAppliances.map((appliance, idx) => {
              const group = QUICK_APPLIANCE_GROUPS.find((g) => g.id === appliance.groupId)!;
              const option = group.options.find((o) => o.id === appliance.optionId)!;
              const isEditing = editingIndex === idx;
              const Icon = groupIcons[group.id];
              const isFixedBoilerPreset = appliance.groupId === 'boiler' && appliance.boilerMode !== 'custom' && !appliance.unitBoilerModes?.some(m => m === 'custom');
              const isCustomOption = appliance.groupId === 'boiler' && (appliance.boilerMode === 'custom' || appliance.unitBoilerModes?.some(m => m === 'custom'));
              const isFixedSizePreset = appliance.groupId !== 'boiler' && appliance.sizeMode !== 'custom' && !appliance.unitSizeModes?.some(m => m === 'custom');
              const isCustomSize = appliance.groupId !== 'boiler' && (appliance.sizeMode === 'custom' || appliance.unitSizeModes?.some(m => m === 'custom'));
              const groupTitle = getLocalizedText(group.title, language);
              const optionLabel = getLocalizedText(option.label, language);

              const sizeLabel = (mode: string) => {
                const found = sizeModes.find(s => s.id === mode);
                return found?.label ?? mode;
              };

              return (
                <div key={`${appliance.groupId}-${appliance.optionId}-${idx}`} className={`rounded-2xl border transition-all ${isEditing ? 'border-energy/50 bg-amber-50' : 'card'}`}>
                  {/* Appliance row header */}
                  <div className="flex items-center gap-3 p-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-energy">
                      <Icon size={16} />
                    </span>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditingIndex(isEditing ? null : idx)}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-heading truncate">
                          {groupTitle}: {optionLabel}
                        </span>
                        <span className="rounded-full border border-border bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {appliance.count} {t('QuickAppliancePicker', 'pcs.')}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted">
                        {appliance.groupId === 'boiler'
                          ? (appliance.count === 1
                            ? sizeLabel(appliance.boilerMode ?? 'unknown')
                            : `${t('QuickAppliancePicker', 'Various')} (${appliance.unitBoilerModes?.map(m => sizeAbbrev(m)).join(', ') ?? sizeAbbrev(appliance.boilerMode ?? 'unknown')})`)
                          : (appliance.count === 1
                            ? sizeLabel(appliance.sizeMode ?? 'unknown')
                            : `${t('QuickAppliancePicker', 'Various')} (${appliance.unitSizeModes?.map(m => sizeAbbrev(m)).join(', ') ?? sizeAbbrev(appliance.sizeMode ?? 'unknown')})`)}
                        {' · '}
                        {intensityOptions.find(i => i.id === appliance.intensity)?.label}
                        {' · '}
                        {durationPerDayOptions.find(d => d.id === appliance.durationPerDay)?.label}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" onClick={() => setEditingIndex(isEditing ? null : idx)} className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-slate-100 text-muted hover:text-heading cursor-pointer transition">
                        {isEditing ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <button type="button" onClick={() => removeAppliance(idx)} className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-slate-100 text-muted hover:text-danger cursor-pointer transition">
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Editing panel */}
                  {isEditing && (
                    <div className="border-t border-border/60 px-3 pb-3 pt-3 space-y-4">
                      {/* Count */}
                      <div>
                        <div className="mb-2 text-[11px] font-bold text-heading">{t('QuickAppliancePicker', 'Quantity')}</div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => { const n = Math.max(1, appliance.count - 1); updateAppliance(idx, { count: n, unitKwValues: resizeArray(appliance.unitKwValues, n, '1'), unitPowerModes: resizeArray(appliance.unitPowerModes, n, 'unknown'), unitBoilerModes: appliance.unitBoilerModes ? resizeArray(appliance.unitBoilerModes, n, 'unknown') : undefined, unitSizeModes: appliance.unitSizeModes ? resizeArray(appliance.unitSizeModes, n, 'unknown') : undefined }); }} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white text-sm font-bold text-heading hover:border-energy cursor-pointer transition">-</button>
                          <span className="min-w-[28px] text-center text-sm font-bold text-heading">{appliance.count}</span>
                          <button type="button" onClick={() => { const n = appliance.count + 1; updateAppliance(idx, { count: n, unitKwValues: resizeArray(appliance.unitKwValues, n, '1'), unitPowerModes: resizeArray(appliance.unitPowerModes, n, 'unknown'), unitBoilerModes: appliance.unitBoilerModes ? resizeArray(appliance.unitBoilerModes, n, 'unknown') : undefined, unitSizeModes: appliance.unitSizeModes ? resizeArray(appliance.unitSizeModes, n, 'unknown') : undefined }); }} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white text-sm font-bold text-heading hover:border-energy cursor-pointer transition">+</button>
                        </div>
                      </div>

                      {/* Size / Boiler mode */}
                      {appliance.groupId === 'boiler' ? (
                        <div>
                          <div className="mb-2 text-[11px] font-bold text-heading">{t('QuickAppliancePicker', 'Boiler size')}</div>
                          {appliance.count === 1 ? (
                            <div className="flex flex-wrap gap-2">
                              {[{ id: 'small', kwh: 2.2 }, { id: 'standard', kwh: 3.2 }, { id: 'large', kwh: 5.0 }, { id: 'unknown', kwh: 3.2 }, { id: 'custom', kwh: null as null }].map((mode) => (
                                <button key={mode.id} type="button" onClick={() => {
                                  const updates: Partial<SelectedAppliance> = { boilerMode: mode.id as SelectedAppliance['boilerMode'] };
                                  if (mode.id === 'custom') {
                                    const nextKwValues = [...appliance.unitKwValues];
                                    if (nextKwValues[0] === undefined) nextKwValues[0] = '1';
                                    updates.unitKwValues = nextKwValues;
                                  }
                                  updateAppliance(idx, updates);
                                }} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${appliance.boilerMode === mode.id ? smallBtnActive : smallBtnInactive}`}>
                                  <div>{sizeLabel(mode.id)}</div>
                                  <div className="text-[10px] text-muted">{mode.kwh == null ? t('QuickAppliancePicker', 'by kW/L') : `≈ ${mode.kwh.toFixed(1)} kWh`}</div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {Array.from({ length: appliance.count }).map((_, unitIdx) => (
                                <div key={unitIdx}>
                                  <div className="mb-2 text-[11px] font-bold text-heading">{t('QuickAppliancePicker', 'Boiler')} {unitIdx + 1}</div>
                                  <div className="flex flex-wrap gap-2">
                                    {[{ id: 'small', kwh: 2.2 }, { id: 'standard', kwh: 3.2 }, { id: 'large', kwh: 5.0 }, { id: 'unknown', kwh: 3.2 }, { id: 'custom', kwh: null as null }].map((mode) => (
                                      <button key={mode.id} type="button" onClick={() => {
                                        const nextModes = [...(appliance.unitBoilerModes || [])];
                                        nextModes[unitIdx] = mode.id as 'small' | 'standard' | 'large' | 'custom' | 'unknown';
                                        const nextKwValues = [...appliance.unitKwValues];
                                        if (nextKwValues[unitIdx] === undefined) nextKwValues[unitIdx] = '1';
                                        updateAppliance(idx, { unitBoilerModes: nextModes, unitKwValues: nextKwValues });
                                      }} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${(appliance.unitBoilerModes?.[unitIdx] || appliance.boilerMode) === mode.id ? smallBtnActive : smallBtnInactive}`}>
                                        <div>{sizeLabel(mode.id)}</div>
                                        <div className="text-[10px] text-muted">{mode.kwh == null ? t('QuickAppliancePicker', 'by kW/L') : `≈ ${mode.kwh.toFixed(1)} kWh`}</div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="mb-2 text-[11px] font-bold text-heading">{t('QuickAppliancePicker', 'Size')}</div>
                          {appliance.count === 1 ? (
                            <div className="flex flex-wrap gap-2">
                              {[{ id: 'small' }, { id: 'standard' }, { id: 'large' }, { id: 'unknown' }, { id: 'custom' }].map((mode) => {
                                const kwh = mode.id === 'custom' ? null : (option.sizeKwhPerDay?.[mode.id as 'small' | 'standard' | 'large' | 'unknown'] ?? option.kwhPerDay);
                                return (
                                  <button key={mode.id} type="button" onClick={() => {
                                    const updates: Partial<SelectedAppliance> = { sizeMode: mode.id as SelectedAppliance['sizeMode'] };
                                    if (mode.id === 'custom') {
                                      const nextKwValues = [...appliance.unitKwValues];
                                      if (nextKwValues[0] === undefined) nextKwValues[0] = '1';
                                      updates.unitKwValues = nextKwValues;
                                    }
                                    updateAppliance(idx, updates);
                                  }} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${appliance.sizeMode === mode.id ? smallBtnActive : smallBtnInactive}`}>
                                    <div>{sizeLabel(mode.id)}</div>
                                    <div className="text-[10px] text-muted">{kwh == null ? t('QuickAppliancePicker', 'by kW') : `≈ ${kwh.toFixed(1)} kWh`}</div>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {Array.from({ length: appliance.count }).map((_, unitIdx) => (
                                <div key={unitIdx}>
                                  <div className="mb-2 text-[11px] font-bold text-heading">{t('QuickAppliancePicker', 'Appliance')} {unitIdx + 1}</div>
                                  <div className="flex flex-wrap gap-2">
                                    {[{ id: 'small' }, { id: 'standard' }, { id: 'large' }, { id: 'unknown' }, { id: 'custom' }].map((mode) => {
                                      const kwh = mode.id === 'custom' ? null : (option.sizeKwhPerDay?.[mode.id as 'small' | 'standard' | 'large' | 'unknown'] ?? option.kwhPerDay);
                                      return (
                                        <button key={mode.id} type="button" onClick={() => {
                                          const nextModes = [...(appliance.unitSizeModes || [])];
                                          nextModes[unitIdx] = mode.id as 'small' | 'standard' | 'large' | 'custom' | 'unknown';
                                          const nextKwValues = [...appliance.unitKwValues];
                                          if (nextKwValues[unitIdx] === undefined) nextKwValues[unitIdx] = '1';
                                          updateAppliance(idx, { unitSizeModes: nextModes, unitKwValues: nextKwValues });
                                        }} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${(appliance.unitSizeModes?.[unitIdx] || appliance.sizeMode) === mode.id ? smallBtnActive : smallBtnInactive}`}>
                                          <div>{sizeLabel(mode.id)}</div>
                                          <div className="text-[10px] text-muted">{kwh == null ? t('QuickAppliancePicker', 'by kW') : `≈ ${kwh.toFixed(1)} kWh`}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Power info */}
                      {isFixedBoilerPreset || isFixedSizePreset ? (
                        <div className="rounded-xl border border-energy/30 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-energy">{t('QuickAppliancePicker', 'For this preset the power is fixed.')}</div>
                      ) : (isCustomOption || isCustomSize) ? (
                        <div className="space-y-2">
                          <div className="rounded-xl border border-sky/25 bg-sky-50 px-3 py-2 text-[11px] font-semibold text-sky">{t('QuickAppliancePicker', 'Custom: enter kW for appliances in custom mode.')}</div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {Array.from({ length: appliance.count }).map((_, unitIdx) => {
                              const unitBoilerMode = appliance.unitBoilerModes?.[unitIdx] || appliance.boilerMode;
                              const unitSizeMode = appliance.unitSizeModes?.[unitIdx] || appliance.sizeMode;
                              const isUnitCustom = (appliance.groupId === 'boiler' && unitBoilerMode === 'custom') || (appliance.groupId !== 'boiler' && unitSizeMode === 'custom');
                              if (!isUnitCustom) return null;
                              return (
                                <label key={unitIdx}>
                                  <div className="mb-1 text-[11px] font-semibold text-muted">{t('QuickAppliancePicker', 'Appliance')} {unitIdx + 1} (kW)</div>
                                  <input type="number" min={0.01} step={0.01} value={appliance.unitKwValues[unitIdx] ?? '1'} onChange={(e) => { const next = [...appliance.unitKwValues]; next[unitIdx] = e.target.value; updateAppliance(idx, { unitKwValues: next }); }} className="input-field h-9 px-3 text-sm" />
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      {/* Detail field */}
                      {option.detailLabel && (
                        <label>
                          <div className="mb-1 text-[11px] font-bold text-heading">{getLocalizedText(option.detailLabel, language)}</div>
                          <input type={option.detailType ?? 'text'} min={option.detailMin} max={option.detailMax} step={option.detailStep} value={appliance.detail ?? option.detailDefault ?? ''} onChange={(e) => updateAppliance(idx, { detail: e.target.value })} placeholder={`${t('QuickAppliancePicker', 'Ex.')} ${option.detailDefault ?? ''}${option.detailSuffix ?? ''}`} className="input-field h-9 px-3 text-sm" />
                        </label>
                      )}

                      {/* Intensity */}
                      <div>
                        <div className="mb-2 text-[11px] font-bold text-heading">{t('QuickAppliancePicker', 'Intensity')}</div>
                        <div className="flex flex-wrap gap-2">
                          {intensityOptions.map((item) => (
                            <button key={item.id} type="button" onClick={() => updateAppliance(idx, { intensity: item.id as SelectedAppliance['intensity'] })} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${appliance.intensity === item.id ? smallBtnActive : smallBtnInactive}`}>{item.label}</button>
                          ))}
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <div className="mb-2 text-[11px] font-bold text-heading">{t('QuickAppliancePicker', 'Hours per day')}</div>
                        <div className="flex flex-wrap gap-2">
                          {durationPerDayOptions.map((item) => (
                            <button key={item.id} type="button" onClick={() => updateAppliance(idx, { durationPerDay: item.id as SelectedAppliance['durationPerDay'] })} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${appliance.durationPerDay === item.id ? smallBtnActive : smallBtnInactive}`}>{item.label}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hint */}
      <p className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-slate-700">
        {t('QuickAppliancePicker', 'Click category → select appliance → configure details. You can choose from multiple categories.')}
      </p>
    </div>
  );
});
