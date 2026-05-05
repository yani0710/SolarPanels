import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BatteryCharging, ChevronDown, ChevronUp, Gauge, ShieldCheck, Sparkles, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HOUSEHOLD_PROFILES } from '../../data/householdProfiles';
import { REGION_SOLAR_DATA } from '../../data/regionSolarData';
import type { ApplianceInput, DetailedAssessmentInput, RecommendationResult } from '../../types';
import { analyzeDetailed } from '../../logic/recommendationEngine';
import { listCustomAppliances } from '../../api/appliances';
import { useAuth } from '../../context/AuthContext';
import { QuickAppliancePicker } from './QuickAppliancePicker';
import { CustomApplianceModal } from '../appliances/CustomApplianceModal';
import { Stepper } from './Stepper';
import { calculateDayNightSplit, calculateTotalConsumption } from '../../logic/calculations';

export function DetailedAssessment({ onResult, onRequireRegister }: { onResult: (input: DetailedAssessmentInput, result: RecommendationResult) => void; onRequireRegister: () => void }) {
  const { user } = useAuth();
  const quickPickerRef = useRef<{ getAppliances: () => ApplianceInput[] }>(null);
  const [step, setStep] = useState(0);
  const [profileId, setProfileId] = useState('medium-home');
  const [appliances, setAppliances] = useState<ApplianceInput[]>(HOUSEHOLD_PROFILES.find((p) => p.id === 'medium-home')!.appliances);
  const [customAppliances, setCustomAppliances] = useState<ApplianceInput[]>([]);
  const [quickSelections, setQuickSelections] = useState<Record<string, string[]>>({});
  const [selectedQuickCustom, setSelectedQuickCustom] = useState<string[]>([]);
  const [customOpen, setCustomOpen] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const profile = useMemo(() => HOUSEHOLD_PROFILES.find((p) => p.id === profileId)!, [profileId]);
  const steps = ['Основи', 'Профил', 'Уреди', 'Backup', 'Условия'];

  useEffect(() => {
    if (!user) { setCustomAppliances([]); return; }
    listCustomAppliances().then((data) => setCustomAppliances(data.appliances)).catch(() => setCustomAppliances([]));
  }, [user]);

  const submit = (formData: FormData) => {
    const input: DetailedAssessmentInput = {
      mode: 'detailed',
      objectType: String(formData.get('objectType')) as DetailedAssessmentInput['objectType'],
      region: String(formData.get('region')),
      monthlyBillBgn: Number(formData.get('monthlyBillBgn') || 220),
      monthlyKwh: Number(formData.get('monthlyKwh') || 0) || undefined,
      pricePerKwh: Number(formData.get('pricePerKwh') || 0.3),
      goal: String(formData.get('goal')) as DetailedAssessmentInput['goal'],
      cityOrArea: String(formData.get('cityOrArea') || ''),
      dayNightTariff: String(formData.get('dayNightTariff') || 'unknown') as DetailedAssessmentInput['dayNightTariff'],
      gridPhase: String(formData.get('gridPhase') || 'unknown') as DetailedAssessmentInput['gridPhase'],
      profileId,
      appliances,
      backupHours: Number(formData.get('backupHours') || 0),
      backupScope: String(formData.get('backupScope')) as DetailedAssessmentInput['backupScope'],
      sunCondition: String(formData.get('sunCondition')) as DetailedAssessmentInput['sunCondition'],
      obstacles: formData.getAll('obstacles').map(String),
      mountPossible: String(formData.get('mountPossible')) as DetailedAssessmentInput['mountPossible'],
      budget: Number(formData.get('budget') || 0) || undefined,
      priority: String(formData.get('priority') || 'unknown') as DetailedAssessmentInput['priority'],
      batteryPreference: String(formData.get('batteryPreference') || 'unknown') as DetailedAssessmentInput['batteryPreference'],
      futurePlans: formData.getAll('futurePlans').map(String)
    };
    onResult(input, analyzeDetailed(input));
  };

  const addQuickAppliancesToDetailed = () => {
    const configured = quickPickerRef.current?.getAppliances?.() ?? [];
    const selectedCustom = customAppliances.filter((item) => selectedQuickCustom.includes(item.id));
    if (!configured.length && !selectedCustom.length) return;
    setAppliances((prev) => [...prev, ...configured, ...selectedCustom]);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(new FormData(e.currentTarget)); }} className="card overflow-hidden p-4 sm:p-5 md:p-7">
      <Stepper steps={steps} current={step} onNavigate={setStep} />
      <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}>
              {step === 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Тип обект" name="objectType" as="select" options={[['house', 'Къща'], ['apartment', 'Апартамент'], ['villa', 'Вила'], ['business', 'Малък бизнес'], ['farm', 'Ферма']]} />
                  <Input label="Регион" name="region" as="select" options={Object.entries(REGION_SOLAR_DATA).map(([id, r]) => [id, r.label])} />
                  <Input label="Град или област" name="cityOrArea" placeholder="Не е задължително" />
                  <Input label="Месечна сметка в лв" name="monthlyBillBgn" defaultValue="220" />
                  <Input label="Месечно kWh, ако го знаеш" name="monthlyKwh" placeholder="Не е задължително" />
                  <Input label="Цена на kWh" name="pricePerKwh" defaultValue="0.30" />
                  <Input label="Дневна/нощна тарифа" name="dayNightTariff" as="select" options={[['unknown', 'Не знам'], ['yes', 'Да'], ['no', 'Не']]} />
                  <Input label="Захранване" name="gridPhase" as="select" options={[['unknown', 'Не знам'], ['single', 'Монофазно'], ['three', 'Трифазно']]} />
                  <Input label="Цел" name="goal" as="select" options={[['save', 'Намаляване на сметка'], ['backup', 'Backup'], ['independence', 'Независимост'], ['check', 'Проверка дали има смисъл'], ['offgrid', 'Off-grid']]} />
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {HOUSEHOLD_PROFILES.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => { setProfileId(p.id); setAppliances(p.appliances); }}
                      className={`min-h-32 rounded-2xl border p-4 text-left transition active:scale-[.99] cursor-pointer ${profileId === p.id ? 'border-energy bg-green-50 shadow-green' : 'card hover:border-energy/50'}`}
                    >
                      <div className="font-black text-heading">{p.label}</div>
                      <p className="mt-2 text-sm leading-5 text-muted">{p.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-6">
                  <div className="card p-4">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-heading">Бърз избор по категории</h3>
                        <p className="mt-1 text-sm leading-6 text-muted">Същата секция като в бързия план — удобна за бързо добавяне.</p>
                      </div>
                      <button type="button" onClick={addQuickAppliancesToDetailed} className="btn-secondary">
                        Добави към списъка
                      </button>
                    </div>
                    <QuickAppliancePicker
                      ref={quickPickerRef}
                      selections={quickSelections}
                      onChange={setQuickSelections}
                      customAppliances={customAppliances}
                      selectedCustom={selectedQuickCustom}
                      onCustomChange={setSelectedQuickCustom}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Backup часове" name="backupHours" defaultValue="4" />
                  <Input label="Backup обхват" name="backupScope" as="select" options={[['unknown', 'Не знам'], ['critical', 'Само критични уреди'], ['whole', 'Цял обект']]} />
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Слънце и засенчване" name="sunCondition" as="select" options={[['open', 'Открито място'], ['urban', 'Нормални градски условия'], ['partialShade', 'Частично засенчване'], ['heavyShade', 'Много дървета / гора'], ['unknown', 'Не знам']]} />
                  <Input label="Има ли реална възможност за монтаж?" name="mountPossible" as="select" options={[['yes', 'Да'], ['probably', 'Вероятно'], ['unknown', 'Не знам'], ['no', 'По-скоро не']]} />
                  <Input label="Ориентировъчен бюджет" name="budget" placeholder="По желание" />
                  <Input label="Приоритет" name="priority" as="select" options={[['unknown', 'Не знам'], ['lowest-price', 'Най-ниска цена'], ['balance', 'Баланс'], ['independence', 'По-голяма независимост'], ['backup', 'Backup'], ['future-ready', 'Бъдещо разширение']]} />
                  <Input label="Батерия" name="batteryPreference" as="select" options={[['unknown', 'Не знам'], ['now', 'Искам сега'], ['later', 'Може би по-късно'], ['no', 'Не искам']]} />
                  <CheckBlock title="Сериозни пречки" name="obstacles" options={[['trees', 'Дървета'], ['chimneys', 'Комини'], ['buildings', 'Високи сгради'], ['mountain', 'Планински район'], ['unknown', 'Не знам']]} />
                  <CheckBlock title="Бъдещи планове" name="futurePlans" options={[['ev', 'Електромобил'], ['heat-pump', 'Термопомпа'], ['pool', 'Басейн'], ['more-ac', 'Още климатици'], ['business', 'Бизнес разширение'], ['none', 'Няма'], ['unknown', 'Не знам']]} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="min-w-0 xl:sticky xl:top-28 xl:self-start">
          {summaryVisible ? (
            <LiveSummary appliances={appliances} onHide={() => setSummaryVisible(false)} />
          ) : (
            <div className="hidden xl:block" />
          )}
        </div>
      </div>

      {!summaryVisible && (
        <button
          type="button"
          onClick={() => setSummaryVisible(true)}
          className="fixed bottom-5 right-5 z-50 card rounded-full px-4 py-2 text-sm font-black text-heading shadow-card-md transition hover:shadow-card"
        >
          Покажи Live summary
        </button>
      )}

      <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="btn-secondary disabled:opacity-40" disabled={step === 0}>
          <ArrowLeft size={18} /> Назад
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-secondary">
            Напред <ArrowRight size={18} />
          </button>
        ) : (
          <button className="btn-primary col-span-2 sm:col-span-1">
            <Sparkles size={18} /> Покажи детайлен резултат
          </button>
        )}
      </div>

      <CustomApplianceModal open={customOpen} onClose={() => setCustomOpen(false)} onCreate={(item) => { setCustomAppliances((items) => [item, ...items]); setAppliances((items) => [...items, item]); }} onRequireRegister={onRequireRegister} />
      <p className="mt-5 text-sm leading-6 text-muted">Активен профил: {profile.label}. Можеш да продължиш дори без точни данни.</p>
    </form>
  );
}

function CheckBlock({ title, name, options }: { title: string; name: string; options: Array<[string, string]> }) {
  return (
    <div className="rounded-2xl border border-border bg-slate-50 p-4 md:col-span-2">
      <div className="mb-3 text-sm font-black text-heading">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(([value, text]) => (
          <label key={value} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-700 hover:border-energy hover:bg-green-50 transition">
            <input type="checkbox" name={name} value={value} className="accent-green-600" />
            {text}
          </label>
        ))}
      </div>
    </div>
  );
}

function LiveSummary({ appliances, onHide }: { appliances: ApplianceInput[]; onHide: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const total = calculateTotalConsumption(appliances);
  const split = calculateDayNightSplit(appliances);
  const eveningShare = total.daily > 0 ? Math.round((split.evening / total.daily) * 100) : 0;
  const criticalCount = appliances.filter((item) => item.isCritical).length;
  const unknownCount = appliances.filter((item) => item.usageTime === 'unknown' || item.certainty === 'average').length;
  const battery = eveningShare > 48 || criticalCount > 0 ? 'вероятна' : 'ниска';
  const confidence = unknownCount > 3 ? 'средна/ниска' : appliances.length > 3 ? 'добра' : 'средна';

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-sky">Live summary</div>
          <div className="mt-1 text-xs text-muted">Обновява се според уредите</div>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="text-energy" />
          <button type="button" onClick={onHide} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-slate-100 text-muted transition hover:text-heading cursor-pointer" aria-label="Скрий summary">
            <X size={16} />
          </button>
          <button type="button" onClick={() => setCollapsed((v) => !v)} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-slate-100 text-muted transition hover:text-heading cursor-pointer" aria-label={collapsed ? 'Разгъни' : 'Минимизирай'}>
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>
      {collapsed ? (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Metric icon={<Sparkles size={15} />} label="Общо" value={`${Math.round(total.monthly)} kWh/мес.`} />
          <Metric icon={<BatteryCharging size={15} />} label="Вечер" value={`${eveningShare}%`} />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Metric icon={<Sparkles size={15} />} label="Общо" value={`${Math.round(total.monthly)} kWh/мес.`} />
            <Metric icon={<BatteryCharging size={15} />} label="Вечер" value={`${eveningShare}%`} />
            <Metric icon={<ShieldCheck size={15} />} label="Критични" value={`${criticalCount}`} />
            <Metric icon={<BatteryCharging size={15} />} label="Батерия" value={battery} />
          </div>
          <div className="mt-3 rounded-xl border border-border bg-slate-50 px-3 py-2 text-sm font-semibold text-heading">Увереност: {confidence}</div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-border p-3">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted">{icon}{label}</div>
      <div className="font-black text-heading">{value}</div>
    </div>
  );
}

function Input({ label, as, options, ...props }: { label: string; name: string; defaultValue?: string; placeholder?: string; as?: 'select'; options?: string[][] }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-bold text-heading sm:text-base">{label}</span>
      {as === 'select'
        ? <select {...props} className="input-field px-4 py-3 text-base">{options?.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select>
        : <input {...props} className="input-field px-4 py-3 text-base" />}
    </label>
  );
}
