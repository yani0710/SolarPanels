import { BatteryCharging, ClipboardCheck, Settings2 } from 'lucide-react';

export function EnergyBasics() {
  const items = [
    ['Попълни малко', 'Не знаеш стойност? Избираме разумна средна и продължаваш без спиране.', ClipboardCheck, '01'],
    ['Получаваш dashboard', 'kWp, батерия, тип система, графики, предупреждения и честен съвет.', BatteryCharging, '02'],
    ['Уточняваш само ако искаш', 'Детайлният режим добавя уреди, backup и профили без да става страшно.', Settings2, '03']
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(([title, text, Icon, step]) => (
        <div
          key={title}
          className="relative overflow-hidden rounded-xl border border-white/80 bg-white/82 p-6 shadow-card backdrop-blur transition-shadow hover:shadow-card-md"
        >
          <div className="absolute right-5 top-4 text-4xl font-black text-slate-100">{step}</div>
          <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-100 to-sky-100 text-energy">
            <Icon size={24} />
          </div>
          <h3 className="relative mt-4 text-xl font-black text-heading">{title}</h3>
          <p className="relative mt-2 leading-7 text-muted">{text}</p>
        </div>
      ))}
    </div>
  );
}
