import { CheckCircle2, Gauge, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const modes = [
  {
    id: 'quick',
    title: 'Бърза оценка',
    text: 'За хора, които искат резултат с малко въпроси и разумни средни стойности.',
    icon: Gauge,
    features: ['5-7 лесни стъпки', 'Не знам опции', 'Резултат за минути', 'Уреди чрез групи']
  },
  {
    id: 'detailed',
    title: 'Детайлна оценка',
    text: 'Premium configurator с уреди, backup нужди и live summary панел.',
    icon: SlidersHorizontal,
    features: ['Конкретни уреди', 'Пресети и ръчни настройки', 'Backup анализ', 'По-точна препоръка']
  }
] as const;

export function ModeSelector({ mode, onChange }: { mode: 'quick' | 'detailed'; onChange: (mode: 'quick' | 'detailed') => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modes.map((item, index) => {
        const Icon = item.icon;
        const selected = mode === item.id;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -3 }}
            type="button"
            onClick={() => onChange(item.id)}
            className={`relative overflow-hidden rounded-lg border p-5 text-left transition sm:p-6 ${selected ? 'border-mint/70 bg-mint/10 shadow-glow' : 'border-white/12 bg-white/[0.055] hover:border-cyan/40 hover:bg-white/[0.075]'}`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
            <div className="relative flex items-start gap-4">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-md ${selected ? 'bg-mint text-navy' : 'bg-white/8 text-cyan'}`}>
                <Icon size={24} />
              </span>
              <div>
                <div className="text-xl font-black text-white">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
              </div>
            </div>
            <div className="relative mt-5 grid gap-2 sm:grid-cols-2">
              {item.features.map((feature) => (
                <span key={feature} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <CheckCircle2 size={16} className={selected ? 'text-mint' : 'text-cyan'} />
                  {feature}
                </span>
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
