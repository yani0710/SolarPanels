import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, HelpCircle, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ApplianceInput, QuickAssessmentInput, RecommendationResult } from '../../types';
import { analyzeQuick } from '../../logic/recommendationEngine';
import { REGION_SOLAR_DATA } from '../../data/regionSolarData';
import { quickSelectionsToAppliances } from '../../data/quickApplianceGroups';
import { listCustomAppliances } from '../../api/appliances';
import { useAuth } from '../../context/AuthContext';
import { QuickAppliancePicker } from './QuickAppliancePicker';
import { Stepper } from './Stepper';

const steps = ['Обект', 'Сметка', 'Уреди', 'Профил', 'Backup', 'Условия', 'Цел'];
const defaultBills: Record<string, number> = { apartment: 61, house: 107, villa: 46, business: 164, farm: 130 };
const objectLabels = { apartment: 'Апартамент', house: 'Къща', villa: 'Вила', business: 'Малък бизнес', farm: 'Ферма / селски имот' };
const goalLabels = {
  save: 'Да намаля сметката',
  backup: 'Да имам резервно захранване',
  independence: 'По-голяма независимост',
  check: 'Да проверя дали има смисъл'
};

export function QuickAssessment({ onResult }: { onResult: (input: QuickAssessmentInput, result: RecommendationResult) => void }) {
  const { user } = useAuth();
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
            <Panel title="Какъв е обектът?" hint="Избери най-близкия вариант. Ако не си сигурен, къща е добра начална база.">
              <ChipGrid value={objectType} onChange={(value) => setObjectType(value as QuickAssessmentInput['objectType'])} options={Object.entries(objectLabels)} />
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-bold text-heading">Регион</span>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field px-4 py-3">
                  {Object.entries(REGION_SOLAR_DATA).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
                </select>
              </label>
            </Panel>
          )}

          {step === 1 && (
            <Panel title="Колко е средната месечна сметка?" hint="Ако не знаеш, ще използваме разумна средна стойност според типа обект.">
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
                  <div className="text-sm font-semibold text-muted">на месец</div>
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
                Не знам, използвай средна стойност
              </button>
            </Panel>
          )}

          {step === 2 && (
            <Panel title="Кои основни уреди използваш?" hint="Изборът помага да преценим вечерния товар и дали батерията има смисъл.">
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

          {step === 3 && <Panel title="Кога използваш най-много ток?" hint="Вечерното потребление е най-важният сигнал за батерия."><ChipGrid value={usageTime} onChange={(value) => setUsageTime(value as QuickAssessmentInput['usageTime'])} options={[['day', 'Основно през деня'], ['evening', 'Основно вечер'], ['balanced', 'Равномерно'], ['unknown', 'Не знам']]} /></Panel>}
          {step === 4 && <Panel title="Искаш ли ток при спиране?" hint="Backup нуждите често променят системата от on-grid към hybrid."><ChipGrid value={wantsBackup} onChange={(value) => setWantsBackup(value as QuickAssessmentInput['wantsBackup'])} options={[['yes', 'Да, искам backup'], ['no', 'Не, само по-ниска сметка'], ['unknown', 'Не знам']]} /></Panel>}
          {step === 5 && <Panel title="Какви са условията около имота?" hint="Силното засенчване може да направи препоръката несигурна."><ChipGrid value={sunCondition} onChange={(value) => setSunCondition(value as QuickAssessmentInput['sunCondition'])} options={[['open', 'Открито място'], ['urban', 'Нормални градски условия'], ['partialShade', 'Частично засенчване'], ['heavyShade', 'Много дървета / гора'], ['unknown', 'Не знам']]} /></Panel>}
          {step === 6 && <Panel title="Каква е основната цел?" hint="Ще получиш честен резултат, включително ако соларна система не е добра идея."><ChipGrid value={goal} onChange={(value) => setGoal(value as QuickAssessmentInput['goal'])} options={Object.entries(goalLabels)} /></Panel>}
        </motion.div>
      </AnimatePresence>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="btn-secondary disabled:opacity-40"
          disabled={step === 0}
        >
          <ArrowLeft size={18} /> Назад
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-secondary">
            Напред <ArrowRight size={18} />
          </button>
        ) : (
          <button type="button" onClick={submit} className="btn-primary col-span-2 sm:col-span-1">
            <Sparkles size={18} /> Покажи препоръка
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