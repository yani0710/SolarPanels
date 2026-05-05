import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const items = [
  ['Какво означава kWp?', 'kWp е пикова мощност на соларната система при стандартни условия. Това не е постоянното производство.'],
  ['Какво означава kWh?', 'kWh е количество енергия. Сметката за ток обикновено се базира на kWh.'],
  ['Кога ми трябва батерия?', 'Най-често при вечерно потребление, резервно захранване или желание за по-голяма независимост.'],
  ['Работи ли on-grid система при спиране на тока?', 'Стандартна on-grid система обикновено не работи при спиране. За backup най-често трябва hybrid инвертор и батерия.'],
  ['Защо засенчването е проблем?', 'Сянката намалява производството и може силно да влоши икономиката на системата.'],
  ['Защо резултатите са ориентировъчни?', 'Без оглед, точна ориентация, наклон и реални уреди резултатът е добра първа оценка, не проект.']
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid gap-3">
      {items.map(([q, a], index) => (
        <div key={q} className="card overflow-hidden">
          <button
            onClick={() => setOpen(open === index ? -1 : index)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-black text-heading hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {q}
            <ChevronDown
              size={20}
              className={`shrink-0 text-slate-400 transition-transform duration-200 ${open === index ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {open === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="border-t border-border px-5 pb-5 pt-4 leading-7 text-muted">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
