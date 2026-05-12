import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, HelpCircle, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ApplianceInput, QuickAssessmentInput, RecommendationResult } from '../../types';
import { analyzeQuick } from '../../logic/recommendationEngine';
import { REGION_SOLAR_DATA } from '../../data/regionSolarData';
import { quickSelectionsToAppliances } from '../../data/quickApplianceGroups';
import { listCustomAppliances } from '../../api/appliances';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { QuickAppliancePicker } from './QuickAppliancePicker';
import { Stepper } from './Stepper';

const defaultBills: Record<string, number> = { apartment: 61, house: 107, villa: 46, business: 164, farm: 130 };

const objectLabelsMap: Record<string, string> = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa',
  business: 'Small business',
  farm: 'Farm / rural property'
};

const goalLabelsMap: Record<string, string> = {
  save: 'Reduce my bill',
  backup: 'Have backup power',
  independence: 'More independence',
  check: 'Check if it is worth it'
};

export function QuickAssessment({ onResult }: { onResult: (input: QuickAssessmentInput, result: RecommendationResult) => void }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const pickerRef = useRef<{ getAppliances: () => ApplianceInput[] }>(null);
  const [step, setStep] = useState(0);
  const [objectType, setObjectType] = useState<QuickAssessmentInput['objectType']>('house');
  const [region, setRegion] = useState('unknown');
  const [monthlyBillEur, setMonthlyBillEur] = useState(92);
  const [billKnown, setBillKnown] = useState(true);
  const [applianceSelections, setApplianceSelections] = useState<Record<string, string[]>>({ kitchen: ['basic'] });
  const [customAppliances, setCustomAppliances] = useState<ApplianceInput[]>([]);
  const [selectedCustom, setSelectedCustom] = useState<string[]>([]);
  const [usageTime, setUsageTime] = useState<QuickAssessmentInput['usageTime']>('balanced');
  const [wantsBackup, setWantsBackup] = useState<QuickAssessmentInput['wantsBackup']>('unknown');
  const [sunCondition, setSunCondition] = useState<QuickAssessmentInput['sunCondition']>('urban');
  const [goal, setGoal] = useState<QuickAssessmentInput['goal']>('save');

  const steps = [t('QuickAssessment', 'Object'), t('QuickAssessment', 'Bill'), t('QuickAssessment', 'Appliances'), t('QuickAssessment', 'Profile'), t('QuickAssessment', 'Backup Step'), t('QuickAssessment', 'Conditions'), t('QuickAssessment', 'Goal')];

  const objectLabels: Record<string, string> = {};
  for (const [key, labelKey] of Object.entries(objectLabelsMap)) {
    objectLabels[key] = t('QuickAssessment', labelKey);
  }

  const goalLabels: Record<string, string> = {};
  for (const [key, labelKey] of Object.entries(goalLabelsMap)) {
    goalLabels[key] = t('QuickAssessment', labelKey);
  }

  useEffect(() => {
    if (!user) {
      setCustomAppliances([]);
      setSelectedCustom([]);
      return;
    }
    listCustomAppliances().then((data) => setCustomAppliances(data.appliances)).catch(() => setCustomAppliances([]));
  }, [user]);

  const submit = () => {
    const custom = customAppliances.filter((item) => selectedCustom.includes(item.id));
    const configuredAppliances = pickerRef.current?.getAppliances?.() ?? quickSelectionsToAppliances(applianceSelections);
    const input: QuickAssessmentInput = {
      mode: 'quick',
      objectType,
      region,
      monthlyBillEur: billKnown ? monthlyBillEur : defaultBills[objectType],
      billKnown,
      appliances: [...configuredAppliances, ...custom],
      usageTime,
      wantsBackup,
      sunCondition,
      goal
    };
    onResult(input, analyzeQuick(input));
  };

  return (
    <div className="card p-4 sm:p-5 md:p-7">
      <Stepper steps={steps} current={step} onNavigate={setStep} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}>
          {step === 0 && (
            <Panel title={t('QuickAssessment', 'What is the property type?')} hint={t('QuickAssessment', 'Choose the closest option. If unsure, house is a good starting point.')}>
              <ChipGrid value={objectType} onChange={(value) => setObjectType(value as QuickAssessmentInput['objectType'])} options={Object.entries(objectLabels)} />
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-bold text-heading">{t('QuickAssessment', 'Region')}</span>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field px-4 py-3">
                  {Object.entries(REGION_SOLAR_DATA).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
                </select>
              </label>
            </Panel>
          )}

          {step === 1 && (
            <Panel title={t('QuickAssessment', 'What is the average monthly bill?')} hint={t('QuickAssessment', 'If you do not know, we will use a reasonable average.')}>
              <div className="rounded-xl border border-border bg-slate-50 p-4">
                <input
                  type="range"
                  min="25"
                  max="360"
                  value={monthlyBillEur}
                  onChange={(e) => { setMonthlyBillEur(Number(e.target.value)); setBillKnown(true); }}
                  className="w-full accent-amber-500"
                />
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="text-4xl font-black text-heading">{billKnown ? monthlyBillEur : defaultBills[objectType]} <span className="text-xl text-muted">€</span></div>
                  <div className="text-sm font-semibold text-muted">{t('QuickAssessment', 'per month')}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBillKnown(false)}
                className={`mt-3 rounded-xl border px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                  !billKnown
                    ? 'border-energy bg-amber-50 text-energy'
                    : 'border-border bg-white text-muted hover:border-energy hover:text-energy'
                }`}
              >
                {t('QuickAssessment', 'I do not know, use average')}
              </button>
            </Panel>
          )}

          {step === 2 && (
            <Panel title={t('QuickAssessment', 'Which main appliances do you use?')} hint={t('QuickAssessment', 'Helps assess evening load and whether battery makes sense.')}>
              <QuickAppliancePicker
                ref={pickerRef}
                selections={applianceSelections}
                onChange={setApplianceSelections}
                customAppliances={customAppliances}
                selectedCustom={selectedCustom}
                onCustomChange={setSelectedCustom}
              />
            </Panel>
          )}

          {step === 3 && <Panel title={t('QuickAssessment', 'When do you use the most electricity?')} hint={t('QuickAssessment', 'Evening consumption is the most important battery signal.')}><ChipGrid value={usageTime} onChange={(value) => setUsageTime(value as QuickAssessmentInput['usageTime'])} options={[['day', t('QuickAssessment', 'Mainly during the day')], ['evening', t('QuickAssessment', 'Mainly in the evening')], ['balanced', t('QuickAssessment', 'Balanced')], ['unknown', t('QuickAssessment', 'I do not know')]]} /></Panel>}
          {step === 4 && <Panel title={t('QuickAssessment', 'Do you want backup power?')} hint={t('QuickAssessment', 'Backup needs often change the system from on-grid to hybrid.')}><ChipGrid value={wantsBackup} onChange={(value) => setWantsBackup(value as QuickAssessmentInput['wantsBackup'])} options={[['yes', t('QuickAssessment', 'Yes, I want backup')], ['no', t('QuickAssessment', 'No, just lower bill')], ['unknown', t('QuickAssessment', 'I do not know')]]} /></Panel>}
          {step === 5 && <Panel title={t('QuickAssessment', 'What are the conditions around the property?')} hint={t('QuickAssessment', 'Heavy shading can make the recommendation uncertain.')}><ChipGrid value={sunCondition} onChange={(value) => setSunCondition(value as QuickAssessmentInput['sunCondition'])} options={[['open', t('QuickAssessment', 'Open area')], ['urban', t('QuickAssessment', 'Normal urban conditions')], ['partialShade', t('QuickAssessment', 'Partial shading')], ['heavyShade', t('QuickAssessment', 'Heavy trees / forest')], ['unknown', t('QuickAssessment', 'I do not know')]]} /></Panel>}
          {step === 6 && <Panel title={t('QuickAssessment', 'What is the main goal?')} hint={t('QuickAssessment', 'You will get an honest result, including if solar is not a good idea.')}><ChipGrid value={goal} onChange={(value) => setGoal(value as QuickAssessmentInput['goal'])} options={Object.entries(goalLabels)} /></Panel>}
        </motion.div>
      </AnimatePresence>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="btn-secondary disabled:opacity-40"
          disabled={step === 0}
        >
          <ArrowLeft size={18} /> {t('QuickAssessment', 'Back')}
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-secondary">
            {t('QuickAssessment', 'Next')} <ArrowRight size={18} />
          </button>
        ) : (
          <button type="button" onClick={submit} className="btn-primary col-span-2 sm:col-span-1">
            <Sparkles size={18} /> {t('QuickAssessment', 'Show recommendation')}
          </button>
        )}
      </div>
    </div>
  );
}

function Panel({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-2xl font-black text-heading">{title}</h3>
        <p className="mt-2 flex gap-2 text-sm leading-6 text-muted">
          <HelpCircle size={17} className="mt-0.5 shrink-0 text-sky" />
          {hint}
        </p>
      </div>
      {children}
    </div>
  );
}

function ChipGrid({ value, options, onChange }: { value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map(([id, label]) => {
        const active = value === id;
        return (
          <button
            type="button"
            key={id}
            onClick={() => onChange(id)}
            className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'border-energy bg-amber-50 text-energy shadow-green'
                : 'border-border bg-white text-slate-700 hover:border-energy hover:bg-amber-50 hover:text-energy'
            }`}
          >
            {label}
            {active && <Check size={17} className="shrink-0 text-energy" />}
          </button>
        );
      })}
    </div>
  );
}