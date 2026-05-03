import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, Lock, MessageCircle, Send, Sparkles, X, Globe } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { askAssistant, getAssistantUsage, type AssistantUsage } from '../../api/assistant';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

const startersEN = [
  'What can I do on this site?',
  'Do I need a battery?',
  'What is kWp vs kWh?',
];

const startersBG = [
  'Какво мога да правя на сайта?',
  'Трябва ли ми батерия?',
  'Какво е kWp срещу kWh?',
];

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
    getAssistantUsage()
      .then((data) => {
        if (data && data.usage) setUsage(data.usage);
      })
      .catch((err) => console.warn("Assistant usage fetch failed:", err));
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const creditText = useMemo(() => {
    if (!usage) return language === 'bg' ? 'кредити зареждане' : 'credits loading';
    if (language === 'bg') {
      return `${usage.remaining}/${usage.limit} остатък днес`;
    }
    return `${usage.remaining}/${usage.limit} left today`;
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

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-[390px] overflow-hidden rounded-lg border border-white/12 bg-[#07111d]/95 text-white shadow-2xl backdrop-blur-2xl"
          >
            <div className="border-b border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-mint to-cyan text-navy shadow-glow">
                    <Bot size={20} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-black">{language === 'bg' ? 'AI Асистент' : 'Solar AI'} <Sparkles size={14} className="text-solar" /></div>
                    <div className="text-xs font-semibold text-muted">{user ? 'Персонализирано' : 'Гостен режим'}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLanguage(language === 'bg' ? 'en' : 'bg')}
                    className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/8 text-slate-200 hover:bg-white/12"
                    title={language === 'bg' ? 'English' : 'Български'}
                  >
                    <Globe size={16} />
                  </button>
                  <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/8 text-slate-200" aria-label={language === 'bg' ? 'Затвори' : 'Close'}>
                    <X size={17} />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/18 px-3 py-2 text-xs font-bold">
                <span className="text-mint">{creditText}</span>
                {!user && (
                  <button onClick={() => onAuth('register')} className="inline-flex items-center gap-1 text-cyan hover:text-cyan/80">
                    <Lock size={13} /> {language === 'bg' ? 'още' : 'more'}
                  </button>
                )}
              </div>
            </div>

            <div ref={scrollRef} className="max-h-[340px] space-y-3 overflow-auto p-4">
              {messages.map((item, index) => (
                <div key={`${item.role}-${index}`} className={`rounded-lg border p-3 text-sm leading-6 ${item.role === 'user' ? 'ml-8 border-cyan/20 bg-cyan/10 text-white' : 'mr-8 border-white/10 bg-white/[0.055] text-slate-200'}`}>
                  {item.content}
                </div>
              ))}
              {loading && (
                <div className="mr-8 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] p-3 text-sm text-muted">
                  <Loader2 size={16} className="animate-spin text-mint" /> {language === 'bg' ? 'Мислене...' : 'Thinking...'}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-2 flex flex-wrap gap-2">
                {starters.map((item) => (
                  <button key={item} onClick={() => submit(item)} disabled={loading} className="rounded-md border border-white/10 bg-white/8 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:border-cyan/40">
                    {item}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <input 
                  value={message} 
                  onChange={(event) => setMessage(event.target.value)} 
                  placeholder={language === 'bg' ? 'Питай само за соларни...' : 'Ask about solar only...'} 
                  className="premium-input min-h-11 px-3 py-2 text-sm" 
                />
                <button disabled={loading || !message.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gradient-to-r from-mint to-cyan text-navy disabled:opacity-50" aria-label={language === 'bg' ? 'Изпрати' : 'Send'}>
                  <Send size={17} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen((value) => !value)} className="group flex min-h-12 items-center gap-2 rounded-lg border border-white/12 bg-gradient-to-r from-mint to-cyan px-4 py-3 font-black text-navy shadow-glow">
        <MessageCircle size={20} />
        <span className="hidden sm:inline">{language === 'bg' ? 'AI Помощник' : 'Solar AI'}</span>
      </button>
    </div>
  );
}
