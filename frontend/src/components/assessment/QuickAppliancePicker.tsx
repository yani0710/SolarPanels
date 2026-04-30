import { Check, Plus } from 'lucide-react';
import { QUICK_APPLIANCE_GROUPS } from '../../data/quickApplianceGroups';
import type { ApplianceInput } from '../../types';

export function QuickAppliancePicker({ selections, onChange, customAppliances = [], selectedCustom = [], onCustomChange }: { selections: Record<string, string[]>; onChange: (next: Record<string, string[]>) => void; customAppliances?: ApplianceInput[]; selectedCustom?: string[]; onCustomChange?: (ids: string[]) => void }) {
  const toggle = (groupId: string, optionId: string) => {
    const current = selections[groupId] ?? [];
    const nextValues = current.includes(optionId) ? current.filter((item) => item !== optionId) : [...current, optionId];
    onChange({ ...selections, [groupId]: nextValues });
  };
  const toggleCustom = (id: string) => {
    if (!onCustomChange) return;
    onCustomChange(selectedCustom.includes(id) ? selectedCustom.filter((item) => item !== id) : [...selectedCustom, id]);
  };

  return (
    <div className="grid gap-4">
      {QUICK_APPLIANCE_GROUPS.map((group) => (
        <div key={group.id} className="rounded-[1.4rem] border border-white/12 bg-white/[0.055] p-4">
          <div className="mb-3 font-black text-white">{group.title}</div>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const selected = (selections[group.id] ?? []).includes(option.id);
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => toggle(group.id, option.id)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold transition ${selected ? 'border-mint bg-mint/15 text-white shadow-glow' : 'border-white/12 bg-white/[0.055] text-slate-300 hover:border-cyan/50 hover:text-white'}`}
                >
                  {selected ? <Check size={15} className="text-mint" /> : <Plus size={15} className="text-cyan" />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {customAppliances.length > 0 && (
        <div className="rounded-[1.4rem] border border-mint/30 bg-mint/10 p-4">
          <div className="mb-3 font-black text-white">Моите запазени уреди</div>
          <div className="flex flex-wrap gap-2">
            {customAppliances.map((item) => {
              const selected = selectedCustom.includes(item.id);
              return (
                <button key={item.id} type="button" onClick={() => toggleCustom(item.id)} className={`min-h-10 rounded-full border px-3 py-2 text-sm font-bold ${selected ? 'border-mint bg-white text-navy shadow-sm' : 'border-white/12 bg-white/8 text-slate-300'}`}>
                  {item.name} · {item.wattage ?? 0} W
                </button>
              );
            })}
          </div>
        </div>
      )}
      <p className="rounded-2xl border border-cyan/18 bg-cyan/8 p-3 text-sm leading-6 text-slate-300">Тук няма ватове и часове. Използваме средни стойности, за да не превръщаме бързата оценка в техническа анкета.</p>
    </div>
  );
}
