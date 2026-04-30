import { BatteryCharging, ClipboardCheck, Settings2 } from 'lucide-react';

export function EnergyBasics() {
  const items = [
    ['Попълни малко', 'Не знаеш стойност? Избираме разумна средна и продължаваш.', ClipboardCheck],
    ['Получаваш dashboard', 'kWp, батерия, тип система, графики, предупреждения и честен съвет.', BatteryCharging],
    ['Уточняваш само ако искаш', 'Детайлният режим добавя уреди, backup и профили без да става страшно.', Settings2]
  ] as const;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(([title, text, Icon]) => (
        <div key={title} className="rounded-[1.5rem] border border-white/12 bg-white/[0.055] p-6 shadow-card backdrop-blur-xl">
          <Icon className="text-mint" />
          <h3 className="mt-4 text-xl font-black text-white">{title}</h3>
          <p className="mt-2 leading-7 text-muted">{text}</p>
        </div>
      ))}
    </div>
  );
}
