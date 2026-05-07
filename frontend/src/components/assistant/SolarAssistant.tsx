import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronLeft, Globe, Lock, MessageCircle, Sparkles, UserPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

interface QA {
  id: string;
  qBG: string;
  qEN: string;
  aBG: string;
  aEN: string;
  related: string[];
}

const QA_DATA: QA[] = [
  {
    id: 'q1',
    qBG: 'Какво мога да правя на сайта?',
    qEN: 'What can I do on this site?',
    aBG: 'На сайта можеш да анализираш домакинското си потребление, да видиш колко соларни панели ти трябват, да изчислиш приблизителна цена, да добавяш свои устройства и да получиш персонализирани AI препоръки.',
    aEN: 'On this site you can analyze your household consumption, see how many solar panels you need, estimate costs, add your own appliances, and get personalized AI recommendations.',
    related: ['q6', 'q4', 'q12'],
  },
  {
    id: 'q2',
    qBG: 'Трябва ли ми батерия?',
    qEN: 'Do I need a battery?',
    aBG: 'Батерията е полезна ако искаш да съхраняваш излишна соларна енергия за вечерта или при прекъсвания на тока. На мрежа без чести удари може да се справиш без нея. При off-grid система – задължителна.',
    aEN: 'A battery is useful to store excess solar energy for the evening or during outages. If you are grid-connected with few outages, you can manage without one. For an off-grid system — it is mandatory.',
    related: ['q7', 'q11', 'q8'],
  },
  {
    id: 'q3',
    qBG: 'Какво е kWp срещу kWh?',
    qEN: 'What is kWp vs kWh?',
    aBG: 'kWp (киловат-пик) е пиковата мощност на панелите при идеални условия. kWh е единица за изразходвана или произведена енергия за 1 час. Пример: 5 kWp система произвежда ~6 000 kWh годишно в България.',
    aEN: 'kWp (kilowatt-peak) is the peak power of panels under ideal conditions. kWh measures energy consumed or produced over 1 hour. Example: a 5 kWp system produces ~6,000 kWh/year in Bulgaria.',
    related: ['q4', 'q10', 'q5'],
  },
  {
    id: 'q4',
    qBG: 'Колко панели ми трябват?',
    qEN: 'How many panels do I need?',
    aBG: 'Зависи от дневното ти потребление. Типично домакинство изразходва 10–15 kWh/ден. За ~80% покритие обикновено са достатъчни 8–12 панела (400W) — около 3.2–4.8 kWp обща мощност.',
    aEN: 'It depends on your daily usage. A typical household uses 10–15 kWh/day. To cover ~80% of needs, 8–12 panels (400W) are usually enough — around 3.2–4.8 kWp total.',
    related: ['q3', 'q5', 'q10'],
  },
  {
    id: 'q5',
    qBG: 'Колко струва соларна система?',
    qEN: 'How much does a solar system cost?',
    aBG: 'За домакинство с 5–10 kWp цената е между 8 000 и 18 000 лв. с монтаж. Средното изплащане е 6–9 години. Цените са паднали значително — сега е добро време за инвестиция.',
    aEN: 'For a 5–10 kWp home system, expect €4,000–€9,000 including installation. Average payback is 6–9 years. Prices have dropped significantly — now is a great time to invest.',
    related: ['q10', 'q4', 'q2'],
  },
  {
    id: 'q6',
    qBG: 'Как работи анализът на потреблението?',
    qEN: 'How does the consumption analysis work?',
    aBG: 'Добавяш устройствата си (перална, хладилник, климатик...) с мощности и часове на работа. Системата изчислява твоето дневно и месечно потребление в kWh и препоръчва подходяща соларна система.',
    aEN: 'Add your appliances (washing machine, fridge, AC...) with power ratings and daily hours of use. The system calculates your kWh consumption and recommends a suitable solar system.',
    related: ['q1', 'q4', 'q3'],
  },
  {
    id: 'q7',
    qBG: 'Мога ли да работя без мрежата?',
    qEN: 'Can I go completely off-grid?',
    aBG: 'Да — с off-grid система: соларни панели + голям батериен пакет + инвертор. Изисква по-голяма инвестиция и добро планиране. Подходящо за места без достъп до електрическата мрежа.',
    aEN: 'Yes — with an off-grid system: solar panels + large battery bank + inverter. Requires bigger investment and careful planning. Ideal for locations without grid access.',
    related: ['q11', 'q2', 'q8'],
  },
  {
    id: 'q8',
    qBG: 'Какъв инвертор ми трябва?',
    qEN: 'What inverter do I need?',
    aBG: 'За мрежови (grid-tied) системи — стринг или микроинвертори. За хибридни или off-grid — хибриден инвертор с вграден контролер за батерии. Мощността трябва да съответства на инсталираните kWp.',
    aEN: 'For grid-tied systems — string or micro-inverters. For hybrid or off-grid — a hybrid inverter with a built-in battery controller. Its power rating must match your installed kWp.',
    related: ['q7', 'q9', 'q2'],
  },
  {
    id: 'q9',
    qBG: 'Влияе ли сянката върху производството?',
    qEN: 'Does shade affect solar output?',
    aBG: 'Да — дори частична сянка върху един панел може да намали производството на целия стринг с 20–50%. Решения: микроинвертори, оптимизатори на мощност или монтаж само на незасенчени зони.',
    aEN: 'Yes — even partial shade on one panel can cut the entire string\'s output by 20–50%. Solutions: micro-inverters, power optimizers, or placing panels only in shade-free areas.',
    related: ['q8', 'q4', 'q10'],
  },
  {
    id: 'q10',
    qBG: 'Колко бързо се изплаща системата?',
    qEN: 'How fast does the system pay back?',
    aBG: 'В България при ~0.22 лв./kWh и добра ориентация, 5 kWp система се изплаща за 6–8 години. С покачване на цените на тока — по-бързо. Средният живот на панелите е 25–30 години.',
    aEN: 'In Bulgaria at ~0.11 €/kWh and good orientation, a 5 kWp system pays back in 6–8 years. As electricity prices rise — faster. Average panel lifespan is 25–30 years.',
    related: ['q5', 'q4', 'q3'],
  },
  {
    id: 'q11',
    qBG: 'On-grid или off-grid — каква е разликата?',
    qEN: 'On-grid vs off-grid — what\'s the difference?',
    aBG: 'On-grid е свързана с мрежата и може да продава излишък. Off-grid е самостоятелна с батерии. Хибридните системи комбинират и двете — препоръчани за повечето домакинства.',
    aEN: 'On-grid connects to the utility grid and can sell surplus energy. Off-grid is fully self-contained with batteries. Hybrid systems combine both — recommended for most homes.',
    related: ['q7', 'q2', 'q8'],
  },
  {
    id: 'q12',
    qBG: 'Как да регистрирам профил?',
    qEN: 'How do I create an account?',
    aBG: 'Кликни на „Вход" или „Регистрация" горе в сайта. С профил получаваш запазен анализ на потреблението, персонализирани AI препоръки и по-висок лимит на въпроси.',
    aEN: 'Click "Login" or "Register" at the top of the site. With an account you get a saved consumption analysis, personalized AI recommendations, and a higher question limit.',
    related: ['q1', 'q6', 'q4'],
  },
];

const WELCOME: Record<'bg' | 'en', string> = {
  bg: 'Здравей! Избери въпрос по-долу — ще ти отговоря за соларни панели, батерии, цени и как работи сайтът.',
  en: 'Hello! Pick a question below — I\'ll answer about solar panels, batteries, costs, and how the site works.',
};

const GUEST_LIMIT = 3;
const USER_LIMIT = 8;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readCount(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { count: number; date: string };
    return parsed.date === todayKey() ? (parsed.count ?? 0) : 0;
  } catch {
    return 0;
  }
}

function writeCount(key: string, count: number) {
  localStorage.setItem(key, JSON.stringify({ count, date: todayKey() }));
}

export function SolarAssistant({ onAuth, onNewAppliance }: { onAuth: (mode: 'login' | 'register') => void; onNewAppliance: () => void }) {
  void onNewAppliance;
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<'bg' | 'en'>('bg');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<'menu' | 'answered'>('menu');
  const [relatedIds, setRelatedIds] = useState<string[]>([]);
  const [asked, setAsked] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lang = language;
  const storageKey = user ? `swa_user_${user.id}` : 'swa_guest';
  const limit = user ? USER_LIMIT : GUEST_LIMIT;
  const remaining = Math.max(0, limit - asked);
  const isAtLimit = asked >= limit;

  useEffect(() => {
    setAsked(readCount(storageKey));
  }, [storageKey]);

  const welcome: ChatMessage = { role: 'assistant', content: WELCOME[lang] };
  const displayMessages = messages.length === 0 ? [welcome] : messages;

  const scrollToBottom = () =>
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 40);

  const handleSelect = (qa: QA) => {
    if (isAtLimit) return;
    const q = lang === 'bg' ? qa.qBG : qa.qEN;
    const a = lang === 'bg' ? qa.aBG : qa.aEN;
    const newCount = asked + 1;
    setMessages((prev) => {
      const base = prev.length === 0 ? [welcome] : prev;
      return [...base, { role: 'user', content: q }, { role: 'assistant', content: a }];
    });
    setRelatedIds(qa.related);
    setPhase('answered');
    setAsked(newCount);
    writeCount(storageKey, newCount);
    scrollToBottom();
  };

  const handleBack = () => {
    setPhase('menu');
    setRelatedIds([]);
  };

  const menuItems = phase === 'menu' ? QA_DATA : QA_DATA.filter((q) => relatedIds.includes(q.id));

  const segmentColor = (i: number) => {
    if (i >= asked) return 'bg-slate-200 dark:bg-slate-700';
    if (isAtLimit) return 'bg-red-400';
    if (remaining === 1) return 'bg-amber-400';
    return 'bg-energy';
  };

  const usageLabel = () => {
    if (isAtLimit) return lang === 'bg' ? 'Лимитът е достигнат' : 'Limit reached';
    if (remaining === 1) return lang === 'bg' ? '1 въпрос остава' : '1 question left';
    return lang === 'bg' ? `${remaining} въпроса остават` : `${remaining} questions left`;
  };

  const usageLabelColor = isAtLimit
    ? 'text-red-500'
    : remaining === 1
    ? 'text-amber-500'
    : 'text-energy';

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="mb-3 flex w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-900 text-heading shadow-2xl dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="border-b border-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-energy to-sky text-white">
                    <Bot size={20} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-black text-heading">
                      {lang === 'bg' ? 'AI Асистент' : 'Solar AI'}
                      <Sparkles size={14} className="text-solar" />
                    </div>
                    <div className="text-xs font-semibold text-muted">
                      {user
                        ? (lang === 'bg' ? 'Персонализирано' : 'Personalized')
                        : (lang === 'bg' ? 'Гостен режим' : 'Guest mode')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage(lang === 'bg' ? 'en' : 'bg')}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-border dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer"
                    title={lang === 'bg' ? 'English' : 'Български'}
                  >
                    <Globe size={16} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-border dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer"
                    aria-label="Затвори"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>
            </div>

            {/* Usage indicator */}
            <div className="border-b border-border dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-xs font-bold ${usageLabelColor}`}>{usageLabel()}</span>
                <span className="text-xs text-muted">
                  {asked}/{limit} {lang === 'bg' ? 'въпроса' : 'questions'}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: limit }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${segmentColor(i)}`}
                  />
                ))}
              </div>
              {!user && (
                <p className="mt-1.5 text-[11px] text-muted">
                  {lang === 'bg' ? 'Регистрирай се за 8 въпроса на ден' : 'Sign up for 8 questions per day'}
                </p>
              )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="max-h-[240px] space-y-3 overflow-auto p-4">
              {displayMessages.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 text-sm leading-6 ${
                    item.role === 'user'
                      ? 'ml-8 border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/30 text-slate-800 dark:text-sky-100'
                      : 'mr-8 border-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.content}
                </div>
              ))}
            </div>

            {/* Questions panel */}
            <div className="border-t border-border dark:border-slate-700">
              {isAtLimit && !user ? (
                /* Guest limit CTA */
                <div className="flex flex-col items-center gap-3 px-5 py-5 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-2xl">
                    🔒
                  </span>
                  <div>
                    <p className="font-black text-heading">
                      {lang === 'bg' ? 'Използвал си всичките 3 безплатни въпроса' : "You've used all 3 free questions"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {lang === 'bg' ? 'Регистрирай се безплатно и получи 8 въпроса на ден' : 'Sign up for free and get 8 questions per day'}
                    </p>
                  </div>
                  <div className="flex w-full gap-2">
                    <button
                      onClick={() => { setOpen(false); onAuth('register'); }}
                      className="btn-primary flex flex-1 items-center justify-center gap-2 py-2.5 text-sm"
                    >
                      <UserPlus size={15} />
                      {lang === 'bg' ? 'Регистрация' : 'Sign up'}
                    </button>
                    <button
                      onClick={() => { setOpen(false); onAuth('login'); }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border dark:border-slate-600 bg-slate-100 dark:bg-slate-800 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      <Lock size={14} />
                      {lang === 'bg' ? 'Вход' : 'Log in'}
                    </button>
                  </div>
                </div>
              ) : isAtLimit && user ? (
                /* User daily limit */
                <div className="flex flex-col items-center gap-2 px-5 py-5 text-center">
                  <span className="text-2xl">✅</span>
                  <p className="font-black text-heading">
                    {lang === 'bg' ? 'Достигнат дневен лимит от 8 въпроса' : 'Daily limit of 8 questions reached'}
                  </p>
                  <p className="text-xs text-muted">
                    {lang === 'bg' ? 'Лимитът се нулира всеки ден в полунощ' : 'The limit resets every day at midnight'}
                  </p>
                </div>
              ) : (
                /* Normal question list */
                <>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                      {phase === 'menu'
                        ? (lang === 'bg' ? 'Избери въпрос:' : 'Choose a question:')
                        : (lang === 'bg' ? 'Свързани въпроси:' : 'Related questions:')}
                    </span>
                    {!user && (
                      <button
                        onClick={() => onAuth('register')}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-sky hover:underline cursor-pointer"
                      >
                        <Lock size={11} />
                        {lang === 'bg' ? 'Регистрирай се' : 'Sign up'}
                      </button>
                    )}
                  </div>
                  <div className="max-h-[200px] space-y-1.5 overflow-auto px-3 pb-3">
                    {phase === 'answered' && (
                      <button
                        onClick={handleBack}
                        className="flex w-full items-center gap-1.5 rounded-xl border border-border dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                        {lang === 'bg' ? 'Всички въпроси' : 'All questions'}
                      </button>
                    )}
                    {menuItems.map((qa) => (
                      <button
                        key={qa.id}
                        onClick={() => handleSelect(qa)}
                        className="w-full rounded-xl border border-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-energy hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-energy transition cursor-pointer"
                      >
                        {lang === 'bg' ? qa.qBG : qa.qEN}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-12 items-center gap-2 rounded-xl bg-energy px-4 py-3 font-black text-white shadow-green hover:bg-green-700 transition cursor-pointer"
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline">{lang === 'bg' ? 'AI Помощник' : 'Solar AI'}</span>
      </button>
    </div>
  );
}
