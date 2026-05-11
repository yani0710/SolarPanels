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
            whileHover={{ y: -2 }}
            type="button"
            onClick={() => onChange(item.id)}
            className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all sm:p-6 cursor-pointer ${
              selected
                ? 'border-energy bg-amber-50 shadow-green ring-1 ring-energy/30'
                : 'card hover:border-energy/40 hover:shadow-card-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${selected ? 'bg-energy text-white' : 'bg-slate-100 text-energy'}`}>
                <Icon size={24} />
              </span>
              <div>
                <div className="text-xl font-black text-heading">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {item.features.map((feature) => (
                <span key={feature} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CheckCircle2 size={16} className="text-energy" />
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
