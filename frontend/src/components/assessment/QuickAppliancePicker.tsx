import { Car, Check, ChevronDown, ChevronUp, Droplets, Lightbulb, Plus, Shirt, Snowflake, Tv, Utensils, X, Zap, type LucideIcon, LayoutGrid } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState, type ReactNode } from 'react';
import { QUICK_APPLIANCE_GROUPS, type QuickApplianceOption } from '../../data/quickApplianceGroups';
import type { ApplianceInput } from '../../types';

const groupIcons: Record<string, LucideIcon> = {
  all: LayoutGrid,
  boiler: Droplets,
  heatingCooling: Snowflake,
  kitchen: Utensils,
  laundry: Shirt,
  electronics: Tv,
  lighting: Lightbulb,
  transport: Car,
  outdoor: Zap
};

const intensityOptions = [
  { id: 'low', label: 'Рядко' },
  { id: 'medium', label: 'Средно' },
  { id: 'high', label: 'Често' },
  { id: 'unknown', label: 'Не знам' }
];

const durationPerDayOptions = [
  { id: 'unknown', label: 'Не знам' },
  { id: 'minimal', label: '< 1 час' },
  { id: 'short', label: '1-3 часа' },
  { id: 'medium', label: '3-6 часа' },
  { id: 'long', label: '6-12 часа' },
  { id: 'constant', label: 'Целия ден' }
];

interface SelectedAppliance {
  groupId: string;
  optionId: string;
  count: number;
  detail?: string;
  boilerMode?: 'small' | 'standard' | 'large' | 'custom' | 'unknown';
  sizeMode?: 'small' | 'standard' | 'large' | 'custom' | 'unknown';
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
  const [activeGroupId, setActiveGroupId] = useState<string>('all');
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [selectedAppliances, setSelectedAppliances] = useState<SelectedAppliance[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const activeGroup = QUICK_APPLIANCE_GROUPS.find((group) => group.id === activeGroupId) ?? QUICK_APPLIANCE_GROUPS[0];

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
      const isFixedBoilerPreset = appliance.groupId === 'boiler' && boilerMode !== 'custom';
      const isCustomOption = appliance.groupId === 'boiler' && boilerMode === 'custom';

      const isCustomBoiler = appliance.groupId === 'boiler' && boilerMode === 'custom';
      const isFreezer = appliance.optionId === 'freezer';
      const freezerLiters = Number(appliance.detail ?? option.detailDefault ?? 220);
      const freezerKwh = Math.max(0.25, (freezerLiters / 220) * option.kwhPerDay);
      const boilerPresetKwh = boilerMode === 'small' ? 2.2 : boilerMode === 'standard' ? 3.2 : boilerMode === 'large' ? 5 : 3.2;
      const bonusKwh = isCustomBoiler
        ? litersToKwh(Number(appliance.detail ?? option.detailDefault ?? 80))
        : appliance.groupId === 'boiler'
          ? boilerPresetKwh
        : isFreezer
          ? freezerKwh
          : option.kwhPerDay;
      const hours = durationToHours(appliance.durationPerDay);
      const presetKwhPerDay = ((bonusKwh * intensityMultiplier(appliance.intensity)) * hours) / 24;
      const perUnitKwh = Array.from({ length: appliance.count }).reduce((sum, _, unitIdx) => {
        const unitMode = appliance.unitPowerModes[unitIdx] ?? 'unknown';
        const unitKw = Number(appliance.unitKwValues[unitIdx] ?? 0);
        if (isFixedBoilerPreset) return sum + presetKwhPerDay;
        if (isCustomOption) return sum + (Number.isFinite(unitKw) && unitKw > 0 ? unitKw * hours : 0);
        if (sizeMode === 'custom') return sum + (Number.isFinite(unitKw) && unitKw > 0 ? unitKw * hours : 0);
        if (sizeMode === 'small' || sizeMode === 'standard' || sizeMode === 'large' || sizeMode === 'unknown') {
          const sizedKwh = option.sizeKwhPerDay?.[sizeMode] ?? option.kwhPerDay;
          return sum + sizedKwh;
        }
        if (unitMode === 'custom') return sum + (Number.isFinite(unitKw) && unitKw > 0 ? unitKw * hours : 0);
        return sum + option.kwhPerDay;
      }, 0);
      const estimatedKwhPerDay = perUnitKwh;

      return {
        id: `configured-${appliance.groupId}-${appliance.optionId}-${index}`,
        name: group.title,
        category: group.category,
        label: appliance.groupId === 'boiler'
          ? `${group.title}: ${boilerMode === 'small' ? 'Малък' : boilerMode === 'standard' ? 'Среден' : boilerMode === 'large' ? 'Голям' : boilerMode === 'custom' ? 'Custom' : 'Не знам'}`
          : `${group.title}: ${option.label} (${sizeMode === 'small' ? 'Малък' : sizeMode === 'standard' ? 'Среден' : sizeMode === 'large' ? 'Голям' : sizeMode === 'custom' ? 'Custom' : 'Не знам'})`,
        estimatedKwhPerDay,
        usageTime: option.usageTime,
        confidence: option.confidence,
        explanation: `Количество: ${appliance.count}, Режим: ${isFixedBoilerPreset ? 'Фиксиран preset' : isCustomOption ? 'Custom kW' : sizeMode === 'custom' ? 'Custom kW' : sizeMode === 'small' || sizeMode === 'standard' || sizeMode === 'large' ? 'Фиксиран preset' : 'По бройки (Не знам/Custom)'}, Интензивност: ${intensityOptions.find((i) => i.id === appliance.intensity)?.label}, Часове: ${durationPerDayOptions.find((d) => d.id === appliance.durationPerDay)?.label}`
      } as ApplianceInput;
    });
  };

  useImperativeHandle(ref, () => ({
    getAppliances: generateAppliances
  }));

  const addAppliance = (groupId: string, optionId: string) => {
    const group = QUICK_APPLIANCE_GROUPS.find((g) => g.id === groupId);
    const option = group?.options.find((item) => item.id === optionId);
    const detailValue = option?.detailDefault?.toString();

    const newAppliance: SelectedAppliance = {
      groupId,
      optionId,
      count: 1,
      detail: detailValue,
      boilerMode: groupId === 'boiler' ? 'unknown' : undefined,
      sizeMode: groupId === 'boiler' ? undefined : 'unknown',
      unitPowerModes: ['unknown'],
      unitKwValues: ['1'],
      intensity: 'unknown',
      durationPerDay: 'unknown'
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

  const updateAppliance = (index: number, updates: Partial<SelectedAppliance>) => {
    setSelectedAppliances((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const removeAppliance = (index: number) => {
    const appliance = selectedAppliances[index];
    if (!appliance) return;

    setSelectedAppliances((prev) => prev.filter((_, i) => i !== index));
    setEditingIndex(null);

    const currentGroup = QUICK_APPLIANCE_GROUPS.find((g) => g.id === appliance.groupId);
    if (!currentGroup) return;
    const current = selections[appliance.groupId] ?? [];
    onChange({ ...selections, [appliance.groupId]: current.filter((item) => item !== appliance.optionId) });
  };

  const isSelected = (groupId: string, optionId: string) => selectedAppliances.some((item) => item.groupId === groupId && item.optionId === optionId);

  return (
    <div className="grid gap-4">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-black text-white uppercase tracking-wide">Категории</div>
          <button
            type="button"
            onClick={() => setCategoriesOpen((value) => !value)}
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:border-white/25 hover:bg-white/8"
          >
            {categoriesOpen ? 'Скрий категории' : 'Покажи категории'}
            {categoriesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {categoriesOpen && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[{ id: 'all', title: 'Всички', subtitle: 'Всички категории' } as any, ...QUICK_APPLIANCE_GROUPS].map((group) => (
              (() => {
                const isActive = activeGroupId === group.id;
                const Icon = groupIcons[group.id];
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroupId(group.id)}
                    className={`group shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${isActive ? 'border-emerald-400/70 bg-emerald-500/18 text-white shadow-[0_0_0_1px_rgba(16,185,129,0.25)]' : 'border-white/18 bg-[#0b1320]/90 text-slate-200 hover:border-white/35 hover:bg-[#111b2b]'}`}
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <Icon size={16} className={isActive ? 'text-emerald-300' : 'text-slate-400 transition group-hover:text-slate-200'} />
                      <span>{group.title}</span>
                    </span>
                  </button>
                );
              })()
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-white/12 bg-white/[0.055] p-4">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-cyan">
            {(() => {
              const Icon = groupIcons[activeGroupId === 'all' ? 'all' : activeGroup.id];
              return <Icon size={18} className="text-cyan" />;
            })()}
          </span>
          <div>
            <div className="text-lg font-black text-white">{activeGroupId === 'all' ? 'Всички уреди' : activeGroup.title}</div>
            {(activeGroupId === 'all' ? 'Всички категории' : activeGroup.subtitle) && (
              <div className="text-xs font-semibold uppercase tracking-wide text-cyan">{activeGroupId === 'all' ? 'Всички категории' : activeGroup.subtitle}</div>
            )}
            <p className="text-sm text-muted">Избери уред, след това въведи количество, размер и използване.</p>
          </div>
        </div>

        {activeGroupId !== 'all' && (selections[activeGroup.id] ?? []).length > 0 && (
          <div className="mb-4 rounded-2xl border border-mint/30 bg-mint/10 px-3 py-2 text-xs font-semibold text-mint">
            Избрани в категорията: {(selections[activeGroup.id] ?? [])
              .map((selectedId) => {
                const option = activeGroup.options.find((item) => item.id === selectedId);
                return option ? `${activeGroup.title}: ${option.label}` : null;
              })
              .filter(Boolean)
              .join(', ')}
          </div>
        )}

        {activeGroupId === 'all' ? (
          <div className="grid gap-5">
            {QUICK_APPLIANCE_GROUPS.map((group) => {
              const Icon = groupIcons[group.id];
              return (
                <div key={group.id}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-white uppercase tracking-wide">
                    <Icon size={16} className="text-cyan" />
                    <span>{group.title}</span>
                    {group.subtitle && <span className="text-xs font-semibold normal-case text-slate-400">· {group.subtitle}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => (
                      <button
                        key={`${group.id}-${option.id}`}
                        type="button"
                        onClick={() => (isSelected(group.id, option.id) ? focusAppliance(group.id, option.id) : addAppliance(group.id, option.id))}
                        className={`min-w-[150px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${isSelected(group.id, option.id) ? 'border-mint bg-mint/15 text-white' : 'border-white/12 bg-white/[0.055] text-slate-300 hover:border-cyan/40 hover:bg-white/[0.075]'}`}
                      >
                        {option.subgroup && (
                          <div className="mb-2 inline-flex rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-300">
                            {option.subgroup}
                          </div>
                        )}
                        <div className="mb-2 flex items-center gap-2">{isSelected(group.id, option.id) ? <Check size={16} className="text-mint" /> : <Plus size={16} className="text-cyan" />}<span>{option.label}</span></div>
                        {option.description && <div className="mb-1 text-[11px] text-slate-400">{option.description}</div>}
                        <div className="text-xs text-muted">≈ {option.kwhPerDay.toFixed(1)} kWh/ден</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeGroup.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => (isSelected(activeGroup.id, option.id) ? focusAppliance(activeGroup.id, option.id) : addAppliance(activeGroup.id, option.id))}
                className={`min-w-[150px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${isSelected(activeGroup.id, option.id) ? 'border-mint bg-mint/15 text-white' : 'border-white/12 bg-white/[0.055] text-slate-300 hover:border-cyan/40 hover:bg-white/[0.075]'}`}
              >
                {option.subgroup && (
                  <div className="mb-2 inline-flex rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-300">
                    {option.subgroup}
                  </div>
                )}
                <div className="mb-2 flex items-center gap-2">{isSelected(activeGroup.id, option.id) ? <Check size={16} className="text-mint" /> : <Plus size={16} className="text-cyan" />}<span>{option.label}</span></div>
                {option.description && <div className="mb-1 text-[11px] text-slate-400">{option.description}</div>}
                <div className="text-xs text-muted">≈ {option.kwhPerDay.toFixed(1)} kWh/ден</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedAppliances.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-black text-white uppercase tracking-wide">Избрани уреди</div>
          <div className="grid gap-3">
            {selectedAppliances.map((appliance, idx) => {
              const group = QUICK_APPLIANCE_GROUPS.find((g) => g.id === appliance.groupId)!;
              const option = group.options.find((o) => o.id === appliance.optionId)!;
              const isEditing = editingIndex === idx;
              const optionMeta = option as QuickApplianceOption;
              const isFixedBoilerPreset = appliance.groupId === 'boiler' && appliance.boilerMode !== 'custom';
              const isCustomOption = appliance.groupId === 'boiler' && appliance.boilerMode === 'custom';
      const isFixedSizePreset = appliance.groupId !== 'boiler' && appliance.sizeMode !== 'custom';
              const isCustomSize = appliance.groupId !== 'boiler' && appliance.sizeMode === 'custom';

              return (
                <div key={`${appliance.groupId}-${appliance.optionId}-${idx}`} className={`rounded-3xl border p-4 transition ${isEditing ? 'border-cyan/50 bg-cyan/10' : 'border-white/12 bg-white/[0.055]'}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <button type="button" onClick={() => setEditingIndex(isEditing ? null : idx)} className="flex flex-1 items-center gap-3 text-left text-white">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-cyan">
                        {(() => {
                          const Icon = groupIcons[group.id];
                          return <Icon size={18} className="text-cyan" />;
                        })()}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 font-black">
                          <span>
                            {group.title}: {appliance.groupId === 'boiler'
                              ? appliance.boilerMode === 'small'
                                ? 'Малък'
                                : appliance.boilerMode === 'standard'
                                  ? 'Среден'
                                  : appliance.boilerMode === 'large'
                                    ? 'Голям'
                                    : appliance.boilerMode === 'custom'
                                      ? 'Custom'
                                      : 'Не знам'
                              : `${option.label} · ${appliance.sizeMode === 'small' ? 'Малък' : appliance.sizeMode === 'standard' ? 'Среден' : appliance.sizeMode === 'large' ? 'Голям' : appliance.sizeMode === 'custom' ? 'Custom' : 'Не знам'}`}
                          </span>
                          <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-300">
                            {appliance.count} бр.
                          </span>
                        </div>
                        {optionMeta.subgroup && <div className="text-[10px] font-semibold uppercase tracking-wide text-cyan">{optionMeta.subgroup}</div>}
                        <div className="text-xs text-muted">Категория: {group.title}</div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setEditingIndex(isEditing ? null : idx)} className="rounded-full border border-white/12 bg-white/5 p-2 text-muted transition hover:text-white">
                        {isEditing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <button type="button" onClick={() => removeAppliance(idx)} className="rounded-full border border-white/12 bg-white/5 p-2 text-muted transition hover:text-white">
                      <X size={18} />
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <>
                      <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <div className="mb-2 text-xs font-bold text-white">Количество</div>
                        <div className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/6 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              const nextCount = Math.max(1, appliance.count - 1);
                              updateAppliance(idx, {
                                count: nextCount,
                                unitKwValues: resizeArray(appliance.unitKwValues, nextCount, '1'),
                                unitPowerModes: resizeArray(appliance.unitPowerModes, nextCount, 'unknown')
                              });
                            }}
                            className="rounded-full border border-white/12 bg-white/8 px-2 py-1 text-xs text-white"
                          >
                            -
                          </button>
                          <span className="min-w-[30px] text-center text-sm font-semibold text-white">{appliance.count}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextCount = appliance.count + 1;
                              updateAppliance(idx, {
                                count: nextCount,
                                unitKwValues: resizeArray(appliance.unitKwValues, nextCount, '1'),
                                unitPowerModes: resizeArray(appliance.unitPowerModes, nextCount, 'unknown')
                              });
                            }}
                            className="rounded-full border border-white/12 bg-white/8 px-2 py-1 text-xs text-white"
                          >
                            +
                          </button>
                        </div>
                      </label>

                      {appliance.groupId === 'boiler' && (
                        <div className="block">
                          <div className="mb-2 text-xs font-bold text-white">Размер на бойлера</div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'small', label: 'Малък', kwh: 2.2 },
                              { id: 'standard', label: 'Среден', kwh: 3.2 },
                              { id: 'large', label: 'Голям', kwh: 5.0 },
                              { id: 'unknown', label: 'Не знам', kwh: 3.2 },
                              { id: 'custom', label: 'Custom', kwh: null as null }
                            ].map((mode) => (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => updateAppliance(idx, { boilerMode: mode.id as SelectedAppliance['boilerMode'] })}
                                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${appliance.boilerMode === mode.id ? 'border-mint bg-mint/15 text-white' : 'border-white/12 bg-white/[0.045] text-slate-300 hover:border-cyan/40'}`}
                              >
                                <span className="flex flex-col items-start gap-0.5">
                                  <span>{mode.label}</span>
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    {mode.kwh == null ? 'по kW / литри' : `≈ ${mode.kwh.toFixed(1)} kWh/ден`}
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {appliance.groupId !== 'boiler' && (
                        <div className="block">
                          <div className="mb-2 text-xs font-bold text-white">Размер</div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'small', label: 'Малък' },
                              { id: 'standard', label: 'Среден' },
                              { id: 'large', label: 'Голям' },
                              { id: 'unknown', label: 'Не знам' },
                              { id: 'custom', label: 'Custom' }
                            ].map((mode) => {
                              const kwh = mode.id === 'custom' ? null : (option.sizeKwhPerDay?.[mode.id as 'small' | 'standard' | 'large' | 'unknown'] ?? option.kwhPerDay);
                              return (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => updateAppliance(idx, { sizeMode: mode.id as SelectedAppliance['sizeMode'] })}
                                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${appliance.sizeMode === mode.id ? 'border-mint bg-mint/15 text-white' : 'border-white/12 bg-white/[0.045] text-slate-300 hover:border-cyan/40'}`}
                              >
                                <span className="flex flex-col items-start gap-0.5">
                                  <span>{mode.label}</span>
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    {kwh == null ? 'по въведените kW' : `≈ ${kwh.toFixed(2)} kWh/ден`}
                                  </span>
                                </span>
                              </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {option.detailLabel && (
                        <label className="block">
                          <div className="mb-2 text-xs font-bold text-white">{option.detailLabel}</div>
                          <input
                            type={option.detailType ?? 'text'}
                            min={option.detailMin}
                            max={option.detailMax}
                            step={option.detailStep}
                            value={appliance.detail ?? option.detailDefault ?? ''}
                            onChange={(e) => updateAppliance(idx, { detail: e.target.value })}
                            placeholder={`Пр. ${option.detailDefault ?? ''}${option.detailSuffix ?? ''}`}
                            className="premium-input w-full px-3 py-2"
                          />
                        </label>
                      )}

                      {appliance.groupId === 'boiler' && appliance.boilerMode === 'custom' && (
                        <label className="block">
                          <div className="mb-2 text-xs font-bold text-white">Литри</div>
                          <input
                            type="number"
                            min={20}
                            max={300}
                            step={5}
                            value={appliance.detail ?? '100'}
                            onChange={(e) => updateAppliance(idx, { detail: e.target.value })}
                            placeholder="Пр. 100L"
                            className="premium-input w-full px-3 py-2"
                          />
                        </label>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-xs font-bold text-white">Мощност</div>
                      {isFixedBoilerPreset ? (
                        <div className="rounded-xl border border-mint/30 bg-mint/10 px-3 py-2 text-xs font-semibold text-mint">
                          За този preset мощността е фиксирана.
                        </div>
                      ) : isCustomOption ? (
                        <div className="rounded-xl border border-cyan/25 bg-cyan/10 px-3 py-2 text-xs font-semibold text-cyan">
                          Custom режим: въведи директно kW за всяка бройка.
                        </div>
                      ) : isFixedSizePreset ? (
                        <div className="rounded-xl border border-mint/30 bg-mint/10 px-3 py-2 text-xs font-semibold text-mint">
                          За този preset мощността е фиксирана.
                        </div>
                      ) : isCustomSize ? (
                        <div className="rounded-xl border border-cyan/25 bg-cyan/10 px-3 py-2 text-xs font-semibold text-cyan">
                          Custom режим: въведи директно kW за всяка бройка.
                        </div>
                      ) : (
                        <div className="rounded-xl border border-white/12 bg-white/5 p-3">
                          <div className="mb-2 text-[11px] font-semibold text-slate-300">За всяка бройка избери режим:</div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {Array.from({ length: appliance.count }).map((_, unitIdx) => {
                              const mode = appliance.unitPowerModes[unitIdx] ?? 'unknown';
                              return (
                                <div key={unitIdx} className="rounded-lg border border-white/12 bg-white/5 p-2">
                                  <div className="mb-2 text-[11px] font-semibold text-slate-300">Уред {unitIdx + 1}</div>
                                  <div className="flex flex-wrap gap-2">
                                    {[
                                      { id: 'unknown', label: 'Не знам' },
                                      { id: 'custom', label: 'Custom' }
                                    ].map((item) => (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                          const nextModes = [...appliance.unitPowerModes];
                                          nextModes[unitIdx] = item.id as 'unknown' | 'custom';
                                          updateAppliance(idx, { unitPowerModes: nextModes });
                                        }}
                                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${mode === item.id ? 'border-mint bg-mint/15 text-white' : 'border-white/12 bg-white/[0.045] text-slate-300 hover:border-cyan/40'}`}
                                      >
                                        {item.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {!isFixedBoilerPreset && (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {Array.from({ length: appliance.count }).map((_, unitIdx) => {
                            const showCustomInput = isCustomOption || isCustomSize || (appliance.unitPowerModes[unitIdx] ?? 'unknown') === 'custom';
                            if (!showCustomInput) return null;
                            return (
                              <label key={unitIdx} className="block">
                                <div className="mb-1 text-[11px] font-semibold text-slate-300">Уред {unitIdx + 1} (kW)</div>
                                <input
                                  type="number"
                                  min={0.01}
                                  step={0.01}
                                  value={appliance.unitKwValues[unitIdx] ?? '1'}
                                  onChange={(e) => {
                                    const next = [...appliance.unitKwValues];
                                    next[unitIdx] = e.target.value;
                                    updateAppliance(idx, { unitKwValues: next });
                                  }}
                                  placeholder="Пр. 1.20"
                                  className="premium-input w-full px-3 py-2"
                                />
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-xs font-bold text-white">Колко често го използваш?</div>
                      <div className="flex flex-wrap gap-2">
                        {intensityOptions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => updateAppliance(idx, { intensity: (appliance.intensity === item.id ? 'unknown' : item.id) as any })}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${appliance.intensity === item.id ? 'border-mint bg-mint/15 text-white' : 'border-white/12 bg-white/[0.045] text-slate-300 hover:border-cyan/40'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-xs font-bold text-white">Колко часа на ден?</div>
                      <div className="flex flex-wrap gap-2">
                        {durationPerDayOptions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => updateAppliance(idx, { durationPerDay: (appliance.durationPerDay === item.id ? 'unknown' : item.id) as any })}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${appliance.durationPerDay === item.id ? 'border-mint bg-mint/15 text-white' : 'border-white/12 bg-white/[0.045] text-slate-300 hover:border-cyan/40'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {customAppliances.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-black text-white uppercase tracking-wide">Моите запазени уреди</div>
          <div className="flex flex-wrap gap-2 rounded-lg border border-mint/30 bg-mint/10 p-4">
            {customAppliances.map((item) => {
              const selected = selectedCustom.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCustom(item.id)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${selected ? 'border-mint bg-white text-navy shadow-sm' : 'border-white/12 bg-white/8 text-slate-300 hover:border-cyan/50 hover:bg-white/[0.075]'}`}
                >
                  {item.name} · {item.wattage ?? 0} W
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="rounded-lg border border-cyan/18 bg-cyan/8 p-3 text-xs leading-5 text-slate-300">
        Последователност: 1) категория 2) уред 3) настрой само избрания уред. За всеки уред можеш по бройки да комбинираш "Не знам" и "Custom" мощност.
      </p>
    </div>
  );
});
