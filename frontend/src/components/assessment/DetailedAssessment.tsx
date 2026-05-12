import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BatteryCharging, ChevronDown, ChevronUp, Gauge, ShieldCheck, Sparkles, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HOUSEHOLD_PROFILES } from '../../data/householdProfiles';
import { REGION_SOLAR_DATA, getRegionLabel } from '../../data/regionSolarData';
import type { ApplianceInput, DetailedAssessmentInput, RecommendationResult } from '../../types';
import { analyzeDetailed } from '../../logic/recommendationEngine';
import { listCustomAppliances } from '../../api/appliances';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translateProfile } from '../../data/householdProfiles';
import { QuickAppliancePicker } from './QuickAppliancePicker';
import { CustomApplianceModal } from '../appliances/CustomApplianceModal';
import { Stepper } from './Stepper';
import { calculateDayNightSplit, calculateTotalConsumption } from '../../logic/calculations';

const stepKeys = ['Basics', 'Profile', 'Appliances', 'Backup', 'Conditions'];

export function DetailedAssessment({ onResult, onRequireRegister }: { onResult: (input: DetailedAssessmentInput, result: RecommendationResult) => void; onRequireRegister: () => void }) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const quickPickerRef = useRef<{ getAppliances: () => ApplianceInput[] }>(null);
  const [step, setStep] = useState(0);
  const [profileId, setProfileId] = useState('medium-home');
  const [appliances, setAppliances] = useState<ApplianceInput[]>(HOUSEHOLD_PROFILES.find((p) => p.id === 'medium-home')!.appliances);
  const [customAppliances, setCustomAppliances] = useState<ApplianceInput[]>([]);
  const [quickSelections, setQuickSelections] = useState<Record<string, string[]>>({});
  const [selectedQuickCustom, setSelectedQuickCustom] = useState<string[]>([]);
  const [customOpen, setCustomOpen] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const profileData = useMemo(() => HOUSEHOLD_PROFILES.find((p) => p.id === profileId)!, [profileId]);
  const profile = useMemo(() => translateProfile(profileData.id, language), [profileData.id, language]);
  const steps = stepKeys.map((key) => t('DetailedAssessment', key));

  useEffect(() => {
    if (!user) { setCustomAppliances([]); return; }
    listCustomAppliances().then((data) => setCustomAppliances(data.appliances)).catch(() => setCustomAppliances([]));
  }, [user]);

  const submit = (formData: FormData) => {
    const input: DetailedAssessmentInput = {
      mode: 'detailed',
      objectType: String(formData.get('objectType')) as DetailedAssessmentInput['objectType'],
      region: String(formData.get('region')),
      monthlyBillEur: Number(formData.get('monthlyBillEur') || 112),
      monthlyKwh: Number(formData.get('monthlyKwh') || 0) || undefined,
      pricePerKwh: Number(formData.get('pricePerKwh') || 0.153),
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
                  <Input label={t('DetailedAssessment', 'Property type')} name="objectType" as="select" options={[['house', t('DetailedAssessment', 'House')], ['apartment', t('DetailedAssessment', 'Apartment')], ['villa', t('DetailedAssessment', 'Villa')], ['business', t('DetailedAssessment', 'Small business')], ['farm', t('DetailedAssessment', 'Farm')]]} />
  <Input label={t('DetailedAssessment', 'Region')} name="region" as="select" options={Object.keys(REGION_SOLAR_DATA).map((id) => [id, getRegionLabel(id, language)])} />
                  <Input label={t('DetailedAssessment', 'City or area')} name="cityOrArea" placeholder={t('DetailedAssessment', 'Optional')} />
                  <Input label={t('DetailedAssessment', 'Monthly bill (€)')} name="monthlyBillEur" defaultValue="112" />
                  <Input label={t('DetailedAssessment', 'Monthly kWh if known')} name="monthlyKwh" placeholder={t('DetailedAssessment', 'Optional')} />
                  <Input label={t('DetailedAssessment', 'Price per kWh (€)')} name="pricePerKwh" defaultValue="0.153" />
                  <Input label={t('DetailedAssessment', 'Day/night tariff')} name="dayNightTariff" as="select" options={[['unknown', t('QuickAssessment', 'I do not know')], ['yes', t('DetailedAssessment', 'Yes')], ['no', t('DetailedAssessment', 'Yes')]]} />
                  <Input label={t('DetailedAssessment', 'Power supply')} name="gridPhase" as="select" options={[['unknown', t('QuickAssessment', 'I do not know')], ['single', t('DetailedAssessment', 'Single phase')], ['three', t('DetailedAssessment', 'Three phase')]]} />
                  <Input label={t('DetailedAssessment', 'Goal')} name="goal" as="select" options={[['save', t('QuickAssessment', 'Reduce my bill')], ['backup', t('QuickAssessment', 'Have backup power')], ['independence', t('QuickAssessment', 'More independence')], ['check', t('QuickAssessment', 'Check if it makes sense')], ['offgrid', t('QuickAssessment', 'Off-grid')]]} />
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {HOUSEHOLD_PROFILES.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => { setProfileId(p.id); setAppliances(p.appliances); }}
                      className={`min-h-32 rounded-2xl border p-4 text-left transition active:scale-[.99] cursor-pointer ${profileId === p.id ? 'border-energy bg-amber-50 shadow-green' : 'card hover:border-energy/50'}`}
                    >
                      <div className="font-black text-heading">{translateProfile(p.id, language).label}</div>
                      <p className="mt-2 text-sm leading-5 text-muted">{translateProfile(p.id, language).description}</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-6">
                  <div className="card p-4">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-heading">{t('DetailedAssessment', 'Quick category selection')}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted">{t('DetailedAssessment', 'Same section as in quick plan — convenient for fast adding.')}</p>
                      </div>
                      <button type="button" onClick={addQuickAppliancesToDetailed} className="btn-secondary">
                        {t('DetailedAssessment', 'Add to list')}
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
                  <Input label={t('DetailedAssessment', 'Backup hours')} name="backupHours" defaultValue="4" />
                  <Input label={t('DetailedAssessment', 'Backup scope')} name="backupScope" as="select" options={[['unknown', t('QuickAssessment', 'I do not know')], ['critical', t('DetailedAssessment', 'Critical only')], ['whole', t('DetailedAssessment', 'Whole building')]]} />
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label={t('DetailedAssessment', 'Sun and shading')} name="sunCondition" as="select" options={[['open', t('QuickAssessment', 'Open area')], ['urban', t('QuickAssessment', 'Normal urban conditions')], ['partialShade', t('QuickAssessment', 'Partial shading')], ['heavyShade', t('QuickAssessment', 'Heavy trees / forest')], ['unknown', t('QuickAssessment', 'I do not know')]]} />
                  <Input label={t('DetailedAssessment', 'Is installation realistically possible?')} name="mountPossible" as="select" options={[['yes', t('DetailedAssessment', 'Yes')], ['probably', t('DetailedAssessment', 'Probably')], ['unknown', t('QuickAssessment', 'I do not know')], ['no', t('DetailedAssessment', 'Not really')]]} />
                  <Input label={t('DetailedAssessment', 'Estimated budget')} name="budget" placeholder={t('DetailedAssessment', 'Optional')} />
                  <Input label={t('DetailedAssessment', 'Priority')} name="priority" as="select" options={[['unknown', t('QuickAssessment', 'I do not know')], ['lowest-price', t('DetailedAssessment', 'Lowest price')], ['balance', t('DetailedAssessment', 'Balance')], ['independence', t('DetailedAssessment', 'More independence')], ['backup', t('QuickAssessment', 'Backup')], ['future-ready', t('DetailedAssessment', 'Future-ready')]]} />
                  <Input label={t('DetailedAssessment', 'Battery preference')} name="batteryPreference" as="select" options={[['unknown', t('QuickAssessment', 'I do not know')], ['now', t('DetailedAssessment', 'I want now')], ['later', t('DetailedAssessment', 'Maybe later')], ['no', t('DetailedAssessment', 'Do not want')]]} />
                  <CheckBlock title={t('DetailedAssessment', 'Serious obstacles')} name="obstacles" options={[['trees', t('DetailedAssessment', 'Trees')], ['chimneys', t('DetailedAssessment', 'Chimneys')], ['buildings', t('DetailedAssessment', 'Buildings')], ['mountain', t('DetailedAssessment', 'Mountain area')], ['unknown', t('QuickAssessment', 'I do not know')]]} />
                  <CheckBlock title={t('DetailedAssessment', 'Future plans')} name="futurePlans" options={[['ev', t('DetailedAssessment', 'Electric vehicle')], ['heat-pump', t('DetailedAssessment', 'Heat pump')], ['pool', t('DetailedAssessment', 'Pool')], ['more-ac', t('DetailedAssessment', 'More AC units')], ['business', t('DetailedAssessment', 'Business expansion')], ['none', t('DetailedAssessment', 'None')], ['unknown', t('QuickAssessment', 'I do not know')]]} />
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
          {t('DetailedAssessment', 'Show live summary')}
        </button>
      )}

      <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="btn-secondary disabled:opacity-40" disabled={step === 0}>
          <ArrowLeft size={18} /> {t('QuickAssessment', 'Back')}
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-secondary">
            {t('QuickAssessment', 'Next')} <ArrowRight size={18} />
          </button>
        ) : (
          <button className="btn-primary col-span-2 sm:col-span-1">
            <Sparkles size={18} /> {t('DetailedAssessment', 'Show detailed result')}
          </button>
        )}
      </div>

      <CustomApplianceModal open={customOpen} onClose={() => setCustomOpen(false)} onCreate={(item) => { setCustomAppliances((items) => [item, ...items]); setAppliances((items) => [...items, item]); }} onRequireRegister={onRequireRegister} />
      <p className="mt-5 text-sm leading-6 text-muted">{t('DetailedAssessment', 'Active profile')}: {profile.label}. {t('DetailedAssessment', 'You can continue even without exact data.')}</p>
    </form>
  );
}

function CheckBlock({ title, name, options }: { title: string; name: string; options: Array<[string, string]> }) {
  return (
    <div className="rounded-2xl border border-border bg-slate-50 p-4 md:col-span-2">
      <div className="mb-3 text-sm font-black text-heading">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(([value, text]) => (
          <label key={value} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-700 hover:border-energy hover:bg-amber-50 transition">
            <input type="checkbox" name={name} value={value} className="accent-amber-500" />
            {text}
          </label>
        ))}
      </div>
    </div>
  );
}

function LiveSummary({ appliances, onHide }: { appliances: ApplianceInput[]; onHide: () => void }) {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const total = calculateTotalConsumption(appliances);
  const split = calculateDayNightSplit(appliances);
  const eveningShare = total.daily > 0 ? Math.round((split.evening / total.daily) * 100) : 0;
  const criticalCount = appliances.filter((item) => item.isCritical).length;
  const unknownCount = appliances.filter((item) => item.usageTime === 'unknown' || item.certainty === 'average').length;
  const battery = eveningShare > 48 || criticalCount > 0 ? t('DetailedAssessment', 'Likely') : t('DetailedAssessment', 'Low');
  const confidence = unknownCount > 3 ? t('DetailedAssessment', 'Medium/Low') : appliances.length > 3 ? t('DetailedAssessment', 'Good') : t('DetailedAssessment', 'Medium');

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-sky">{t('DetailedAssessment', 'Live summary')}</div>
          <div className="mt-1 text-xs text-muted">{t('DetailedAssessment', 'Updates based on appliances')}</div>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="text-energy" />
          <button type="button" onClick={onHide} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-slate-100 text-muted transition hover:text-heading cursor-pointer" aria-label={t('DetailedAssessment', 'Hide summary')}>
            <X size={16} />
          </button>
          <button type="button" onClick={() => setCollapsed((v) => !v)} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-slate-100 text-muted transition hover:text-heading cursor-pointer" aria-label={collapsed ? t('DetailedAssessment', 'Expand') : t('DetailedAssessment', 'Collapse')}>
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>
      {collapsed ? (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Metric icon={<Sparkles size={15} />} label={t('Results', 'Total')} value={`${Math.round(total.monthly)} ${t('ResultsText', 'kWh/month')}`} />
          <Metric icon={<BatteryCharging size={15} />} label={t('Results', 'Evening')} value={`${eveningShare}%`} />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Metric icon={<Sparkles size={15} />} label={t('Results', 'Total')} value={`${Math.round(total.monthly)} ${t('ResultsText', 'kWh/month')}`} />
            <Metric icon={<BatteryCharging size={15} />} label={t('Results', 'Evening')} value={`${eveningShare}%`} />
            <Metric icon={<ShieldCheck size={15} />} label={t('Results', 'Critical')} value={`${criticalCount}`} />
            <Metric icon={<BatteryCharging size={15} />} label={t('DetailedAssessment', 'Battery')} value={battery} />
          </div>
          <div className="mt-3 rounded-xl border border-border bg-slate-50 px-3 py-2 text-sm font-semibold text-heading">{t('DetailedAssessment', 'Confidence')}: {confidence}</div>
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