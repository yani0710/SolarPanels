import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DetailedAssessment } from '../components/assessment/DetailedAssessment';
import { ResultsDashboard } from '../components/results/ResultsDashboard';
import { Section } from '../components/layout/Section';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { saveSystem } from '../api/savedSystems';
import type { DetailedAssessmentInput, RecommendationResult } from '../types';

export function DetailedAssessPage() {
  const { user } = useAuth();
  const { setAuthMode, bumpRefreshKey, showToast } = useAppContext();
  const { t } = useLanguage();
  const [pendingSave, setPendingSave] = useState(false);
  const [input, setInput] = useState<DetailedAssessmentInput | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(() => {
    try {
      const saved = localStorage.getItem('solarwise_detailed_result');
      return saved ? JSON.parse(saved) as RecommendationResult : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (result) localStorage.setItem('solarwise_detailed_result', JSON.stringify(result));
  }, [result]);

  const onResult = (nextInput: DetailedAssessmentInput, nextResult: RecommendationResult) => {
    setInput(nextInput);
    setResult(nextResult);
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const persistResult = async () => {
    if (!result || !input) return;
    await saveSystem({ title: `${result.recommendedPowerRange} kWp · ${result.systemType}`, inputSnapshot: input, resultSnapshot: result });
    bumpRefreshKey();
    showToast(t('Pages', 'System saved successfully!'));
  };

  useEffect(() => {
    if (!pendingSave || !user) return;
    setPendingSave(false);
    persistResult();
  }, [pendingSave, user]);

  const onSave = async () => {
    if (!result || !input) return;
    if (!user) { setPendingSave(true); setAuthMode('register'); return; }
    await persistResult();
  };

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-white px-4 pt-20 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-heading transition mb-4">
            <ArrowLeft size={16} /> {t('Navbar', 'Home')}
          </Link>
          <h1 className="text-2xl font-black text-heading sm:text-3xl">{t('Navbar', 'Detailed Design')}</h1>
          <p className="mt-2 text-sm text-muted">{t('Pages', 'Specific appliances · backup analysis · live summary · more accurate recommendation')}</p>
        </div>
      </div>

      {/* Assessment form */}
      <Section id="assessment" className="bg-slate-50/60">
        <DetailedAssessment onResult={onResult} onRequireRegister={() => setAuthMode('register')} />
      </Section>

      {/* Results */}
      {result && (
        <Section id="results">
          <ResultsDashboard result={result} onSave={onSave} />
          <button
            onClick={() => { setResult(null); setInput(null); localStorage.removeItem('solarwise_detailed_result'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="btn-secondary mt-6 w-full sm:w-auto"
          >
            <RotateCcw size={16} /> {t('Pages', 'New assessment')}
          </button>
        </Section>
      )}

      <Footer />
    </>
  );
}
