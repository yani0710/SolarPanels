import { AlertTriangle, BatteryCharging, Home, Network, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecommendationResult, SystemType } from '../../types';

const content: Record<SystemType, { title: string; text: string; icon: typeof Network; tone: string; iconColor: string }> = {
  'on-grid':         { title: 'On-grid',     text: 'Подходящо за намаляване на сметката без задължителна батерия.',         icon: Network,        tone: 'from-sky-50 to-white border-sky-200',        iconColor: 'text-sky' },
  hybrid:            { title: 'Hybrid',      text: 'Подходящо за вечерно потребление, backup и по-гъвкава система.',         icon: BatteryCharging, tone: 'from-green-50 to-sky-50 border-energy/30',    iconColor: 'text-energy' },
  'off-grid':        { title: 'Off-grid',    text: 'Подходящо при автономност и слаб или липсващ достъп до мрежа.',         icon: Home,            tone: 'from-amber-50 to-green-50 border-solar/30',   iconColor: 'text-solar' },
  'needs-inspection':{ title: 'Нужен оглед', text: 'Има риск в условията. Препоръчва се професионална проверка.', icon: AlertTriangle,   tone: 'from-amber-100 to-red-50 border-warning/30', iconColor: 'text-warning' }
};

export function SystemTypeRecommendation({ result }: { result: RecommendationResult }) {
  const item = content[result.systemType];
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.14 }}
      className={`min-w-0 rounded-2xl border bg-gradient-to-br ${item.tone} p-5`}
    >
      <Icon className={item.iconColor} />
      <h3 className="mt-3 text-lg font-black text-heading sm:text-xl">Тип система</h3>
      <div className="mt-2 text-4xl font-black text-heading">{item.title}</div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[SunMedium, BatteryCharging, Network].map((SmallIcon, index) => (
          <div key={index} className={`grid h-14 place-items-center rounded-xl border ${index === 1 && result.systemType === 'on-grid' ? 'border-border bg-slate-50 text-slate-300' : 'border-energy/20 bg-green-100 text-energy'}`}>
            <SmallIcon size={20} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
    </motion.div>
  );
}
