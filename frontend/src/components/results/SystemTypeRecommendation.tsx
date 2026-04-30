import { AlertTriangle, BatteryCharging, Home, Network, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecommendationResult, SystemType } from '../../types';

const content: Record<SystemType, { title: string; text: string; icon: typeof Network; tone: string }> = {
  'on-grid': { title: 'On-grid', text: 'Подходящо за намаляване на сметката без задължителна батерия.', icon: Network, tone: 'from-cyan/20 to-white/[0.04]' },
  hybrid: { title: 'Hybrid', text: 'Подходящо за вечерно потребление, backup и по-гъвкава система.', icon: BatteryCharging, tone: 'from-mint/20 to-cyan/10' },
  'off-grid': { title: 'Off-grid', text: 'Подходящо при автономност и слаб или липсващ достъп до мрежа.', icon: Home, tone: 'from-solar/20 to-mint/10' },
  'needs-inspection': { title: 'Нужен оглед', text: 'Има риск в условията. Препоръчва се професионална проверка.', icon: AlertTriangle, tone: 'from-warning/20 to-danger/10' }
};

export function SystemTypeRecommendation({ result }: { result: RecommendationResult }) {
  const item = content[result.systemType];
  const Icon = item.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }} className={`mobile-card min-w-0 border border-white/12 bg-gradient-to-br ${item.tone} p-5 shadow-card backdrop-blur-xl`}>
      <Icon className="text-cyan" />
      <h3 className="mt-3 text-lg font-black text-white sm:text-xl">Тип система</h3>
      <div className="mt-3 text-4xl font-black text-white">{item.title}</div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[SunMedium, BatteryCharging, Network].map((SmallIcon, index) => (
          <div key={index} className={`grid h-14 place-items-center rounded-2xl border ${index === 1 && result.systemType === 'on-grid' ? 'border-white/8 bg-white/5 text-muted/40' : 'border-white/12 bg-white/8 text-mint'}`}>
            <SmallIcon size={20} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
    </motion.div>
  );
}
