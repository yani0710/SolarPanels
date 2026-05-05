import { BatteryCharging, ClipboardCheck, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function EnergyBasics() {
  const items = [
    ['Попълни малко', 'Не знаеш стойност? Избираме разумна средна и продължаваш.', ClipboardCheck],
    ['Получаваш dashboard', 'kWp, батерия, тип система, графики, предупреждения и честен съвет.', BatteryCharging],
    ['Уточняваш само ако искаш', 'Детайлният режим добавя уреди, backup и профили без да става страшно.', Settings2]
  ] as const;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(([title, text, Icon], index) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="card p-6 hover:shadow-card-md transition-shadow cursor-default"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-100 text-energy">
            <Icon size={24} />
          </div>
          <h3 className="mt-4 text-xl font-black text-heading">{title}</h3>
          <p className="mt-2 leading-7 text-muted">{text}</p>
        </motion.div>
      ))}
    </div>
  );
}
