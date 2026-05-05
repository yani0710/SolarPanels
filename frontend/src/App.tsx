import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Section } from './components/layout/Section';
import { EnergyBackground } from './components/layout/EnergyBackground';
import { Hero } from './components/hero/Hero';
import { ModeSelector } from './components/assessment/ModeSelector';
import { QuickAssessment } from './components/assessment/QuickAssessment';
import { DetailedAssessment } from './components/assessment/DetailedAssessment';
import { ResultCards } from './components/results/ResultCards';
import { HonestAdvice } from './components/results/HonestAdvice';
import { WarningsList } from './components/results/WarningsList';
import { TopConsumers } from './components/results/TopConsumers';
import { ConsumptionChart } from './components/charts/ConsumptionChart';
import { DayNightChart } from './components/charts/DayNightChart';
import { ScenarioChart } from './components/charts/ScenarioChart';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { SolarAssistant } from './components/assistant/SolarAssistant';
import { UserProfile } from './components/dashboard/UserProfile';
import { SavedSystems } from './components/dashboard/SavedSystems';
import { SavedAppliances } from './components/dashboard/SavedAppliances';
import { FAQ } from './components/education/FAQ';
import { EnergyBasics } from './components/education/EnergyBasics';
import { saveSystem } from './api/savedSystems';
import type { DetailedAssessmentInput, QuickAssessmentInput, RecommendationResult } from './types';

function AppInner() {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [savedRefreshKey, setSavedRefreshKey] = useState(0);
  const [pendingSaveAfterAuth, setPendingSaveAfterAuth] = useState(false);
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');
  const [input, setInput] = useState<QuickAssessmentInput | DetailedAssessmentInput | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(() => {
    const saved = localStorage.getItem('solarwise_last_result');
    return saved ? JSON.parse(saved) as RecommendationResult : null;
  });

  useEffect(() => {
    if (result) localStorage.setItem('solarwise_last_result', JSON.stringify(result));
  }, [result]);

  const onResult = (nextInput: QuickAssessmentInput | DetailedAssessmentInput, nextResult: RecommendationResult) => {
    setInput(nextInput);
    setResult(nextResult);
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const persistCurrentResult = async () => {
    if (!result || !input) return;
    await saveSystem({ title: `${result.recommendedPowerRange} kWp · ${result.systemType}`, inputSnapshot: input, resultSnapshot: result });
    setSavedRefreshKey((value) => value + 1);
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!pendingSaveAfterAuth || !user) return;
    setPendingSaveAfterAuth(false);
    persistCurrentResult();
  }, [pendingSaveAfterAuth, user]);

  const onSave = async () => {
    if (!result || !input) return;
    if (!user) {
      setPendingSaveAfterAuth(true);
      setAuthMode('register');
      return;
    }
    await persistCurrentResult();
  };

  return (
    <div className="min-h-screen text-heading">
      <EnergyBackground />
      <Navbar onAuth={setAuthMode} onProfile={() => setProfileOpen(true)} />
      <Hero />

      <Section id="value">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-solar">Как работи</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Соларна препоръка без сложни термини.</h2>
          <p className="mt-4 text-base leading-7 text-muted">Бърза оценка, ориентировъчна мощност, батерия, тип система, предупреждения и честен съвет. Профилът отключва сценарии, история и собствени уреди.</p>
        </div>
        <EnergyBasics />
      </Section>

      <Section id="assessment" className="bg-slate-50/60">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-energy">Assessment</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Избери режим</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Отговори на няколко лесни въпроса. Ако не знаеш нещо, ще използваме разумна средна стойност.</p>
        </div>
        <ModeSelector mode={mode} onChange={setMode} />
        <div className="mt-6">{mode === 'quick' ? <QuickAssessment onResult={onResult} /> : <DetailedAssessment onResult={onResult} onRequireRegister={() => setAuthMode('register')} />}</div>
      </Section>

      <Section id="results">
        {result ? (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-energy">Energy dashboard</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Твоята ориентировъчна препоръка</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Това е ориентировъчна препоръка, не окончателна оферта.</p>
            </div>
            <ResultCards result={result} onSave={onSave} />
            <div className="grid min-w-0 gap-5 lg:grid-cols-2">
              <ConsumptionChart result={result} />
              <DayNightChart result={result} />
            </div>
            <ScenarioChart result={result} />
            <TopConsumers result={result} />
            <HonestAdvice result={result} />
            <WarningsList warnings={result.warnings} />
          </div>
        ) : (
          <div className="card p-6 text-center sm:p-8">
            <h2 className="text-2xl font-black text-heading">Резултатът ще се появи тук</h2>
            <p className="mt-2 text-base leading-7 text-muted">Направи бърза или детайлна оценка. Няма нужда да знаеш всичко предварително.</p>
          </div>
        )}
      </Section>

      <Section id="dashboard" className="bg-slate-50/60">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky">Profile dashboard</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Запазени системи</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Регистрацията не е бариера. Тя пази сценарии, история и собствени уреди.</p>
        </div>
        <div className="grid min-w-0 gap-5 lg:grid-cols-[1fr_360px]">
          <SavedSystems refreshKey={savedRefreshKey} />
          <SavedAppliances />
        </div>
      </Section>

      <Section id="faq">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-solar">FAQ</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-heading sm:text-4xl">Кратко и ясно за соларите</h2>
        </div>
        <FAQ />
      </Section>

      <Footer />
      <UserProfile isOpen={profileOpen} onClose={() => setProfileOpen(false)} onNewAppliance={() => setSavedRefreshKey(k => k + 1)} />
      <SolarAssistant onAuth={setAuthMode} onNewAppliance={() => setSavedRefreshKey(k => k + 1)} />
      <LoginModal open={authMode === 'login'} onClose={() => setAuthMode(null)} onSwitch={() => setAuthMode('register')} />
      <RegisterModal open={authMode === 'register'} onClose={() => setAuthMode(null)} onSwitch={() => setAuthMode('login')} />
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
