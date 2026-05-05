import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, Lock, MessageCircle, Send, Sparkles, X, Globe } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { askAssistant, getAssistantUsage, type AssistantUsage } from '../../api/assistant';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

const startersEN = ['What can I do on this site?', 'Do I need a battery?', 'What is kWp vs kWh?'];
const startersBG = ['Какво мога да правя на сайта?', 'Трябва ли ми батерия?', 'Какво е kWp срещу kWh?'];

export function SolarAssistant({ onAuth, onNewAppliance }: { onAuth: (mode: 'login' | 'register') => void; onNewAppliance: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<'bg' | 'en'>('bg');
  const [usage, setUsage] = useState<AssistantUsage | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: language === 'bg'
      ? 'Питай ме за соларни панели, батерии, инвертори, размер, сянка, резервна мощност или потребление на електричество. Също мога да ти разкажа как работи сайта!'
      : 'Ask me about solar panels, batteries, inverters, sizing, roof shade, backup, electricity usage, or how this site works!' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAssistantUsage().then((data) => { if (data?.usage) setUsage(data.usage); }).catch(() => {});
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const creditText = useMemo(() => {
    if (!usage) return language === 'bg' ? 'кредити зареждане' : 'credits loading';
    return language === 'bg' ? `${usage.remaining}/${usage.limit} остатък днес` : `${usage.remaining}/${usage.limit} left today`;
  }, [usage, language]);

  const starters = language === 'bg' ? startersBG : startersEN;

  const submit = async (text = message) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setMessage('');
    setLoading(true);
    setMessages((items) => [...items, { role: 'user', content: trimmed }]);
    try {
      const response = await askAssistant(trimmed, language);
      setUsage(response.usage);
      setMessages((items) => [...items, { role: 'assistant', content: response.answer }]);
    } catch (err) {
      setMessages((items) => [...items, { role: 'assistant', content: err instanceof Error ? err.message : language === 'bg' ? 'Асистентът е недостъпен в момента.' : 'The assistant is unavailable right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  void onNewAppliance;

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-[390px] overflow-hidden rounded-2xl border border-border bg-white text-heading shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-border bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-energy to-sky text-white">
                    <Bot size={20} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-black text-heading">
                      {language === 'bg' ? 'AI Асистент' : 'Solar AI'} <Sparkles size={14} className="text-solar" />
                    </div>
                    <div className="text-xs font-semibold text-muted">{user ? 'Персонализирано' : 'Гостен режим'}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setLanguage(language === 'bg' ? 'en' : 'bg')} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer" title={language === 'bg' ? 'English' : 'Български'}>
                    <Globe size={16} />
                  </button>
                  <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer" aria-label="Затвори">
                    <X size={17} />
                  </button>
                </div>
              </div>
              {/* Credits row */}
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-slate-100 px-3 py-2 text-xs font-bold">
                <span className="text-energy">{creditText}</span>
                {!user && (
                  <button onClick={() => onAuth('register')} className="inline-flex items-center gap-1 text-sky hover:underline cursor-pointer">
                    <Lock size={13} /> {language === 'bg' ? 'още' : 'more'}
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="max-h-[340px] space-y-3 overflow-auto p-4">
              {messages.map((item, index) => (
                <div key={`${item.role}-${index}`} className={`rounded-xl border p-3 text-sm leading-6 ${item.role === 'user' ? 'ml-8 border-sky-200 bg-sky-50 text-slate-800' : 'mr-8 border-border bg-slate-50 text-slate-700'}`}>
                  {item.content}
                </div>
              ))}
              {loading && (
                <div className="mr-8 flex items-center gap-2 rounded-xl border border-border bg-slate-50 p-3 text-sm text-muted">
                  <Loader2 size={16} className="animate-spin text-energy" /> {language === 'bg' ? 'Мислене...' : 'Thinking...'}
                </div>
              )}
            </div>

            {/* Footer / Input */}
            <div className="border-t border-border p-3">
              <div className="mb-2 flex flex-wrap gap-2">
                {starters.map((item) => (
                  <button key={item} onClick={() => submit(item)} disabled={loading} className="rounded-xl border border-border bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-energy hover:bg-green-50 hover:text-energy transition disabled:opacity-50 cursor-pointer">
                    {item}
                  </button>
                ))}
              </div>
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'bg' ? 'Питай само за соларни...' : 'Ask about solar only...'}
                  className="input-field min-h-11 px-3 py-2 text-sm"
                />
                <button disabled={loading || !message.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-energy text-white disabled:opacity-50 hover:bg-green-700 transition cursor-pointer" aria-label="Изпрати">
                  <Send size={17} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Float button */}
      <button onClick={() => setOpen((v) => !v)} className="flex min-h-12 items-center gap-2 rounded-xl bg-energy px-4 py-3 font-black text-white shadow-green hover:bg-green-700 transition cursor-pointer">
        <MessageCircle size={20} />
        <span className="hidden sm:inline">{language === 'bg' ? 'AI Помощник' : 'Solar AI'}</span>
      </button>
    </div>
  );
}
