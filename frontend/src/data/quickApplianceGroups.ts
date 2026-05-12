import type { ApplianceInput } from '../types';

type Bilingual = { bg: string; en: string };

export interface QuickApplianceOption {
  id: string;
  subgroup?: Bilingual;
  label: Bilingual;
  description?: Bilingual;
  kwhPerDay: number;
  sizeKwhPerDay?: Partial<Record<'small' | 'standard' | 'large' | 'unknown', number>>;
  usageTime: ApplianceInput['usageTime'];
  confidence: number;
  warning?: Bilingual;
  detailLabel?: Bilingual;
  detailSuffix?: string;
  detailType?: 'number' | 'text';
  detailMin?: number;
  detailMax?: number;
  detailStep?: number;
  detailDefault?: number;
}

export interface QuickApplianceGroup {
  id: string;
  title: Bilingual;
  subtitle?: Bilingual;
  category: ApplianceInput['category'];
  options: QuickApplianceOption[];
}

export const QUICK_APPLIANCE_GROUPS: QuickApplianceGroup[] = [
  {
    id: 'boiler',
    title: { bg: 'Бойлер', en: 'Boiler' },
    subtitle: { bg: 'Топла вода', en: 'Hot water' },
    category: 'hotWater',
    options: [
      { id: 'boiler', subgroup: { bg: 'Бойлер', en: 'Boiler' }, label: { bg: 'Бойлер', en: 'Boiler' }, description: { bg: 'Размерът се избира в настройките на уреда.', en: 'Size is selected in the appliance settings.' }, kwhPerDay: 3.2, usageTime: 'evening', confidence: 0.72 }
    ]
  },
  {
    id: 'heatingCooling',
    title: { bg: 'Отопление и охлаждане', en: 'Heating & Cooling' },
    subtitle: { bg: 'Климатици и термоконтрол', en: 'Air conditioners and climate control' },
    category: 'heatingCooling',
    options: [
      {
        id: 'ac',
        subgroup: { bg: 'Климатик', en: 'Air conditioner' },
        label: { bg: 'Климатик', en: 'Air conditioner' },
        description: { bg: 'Брой се задава от "Количество".', en: 'Count is set via "Quantity".' },
        kwhPerDay: 4.5,
        sizeKwhPerDay: { small: 3.0, standard: 4.5, large: 6.5, unknown: 4.5 },
        usageTime: 'evening',
        confidence: 0.62,
        detailLabel: { bg: 'Мощност (BTU)', en: 'Power (BTU)' },
        detailType: 'number',
        detailMin: 9000,
        detailMax: 24000,
        detailStep: 1000,
        detailDefault: 12000
      }
    ]
  },
  {
    id: 'kitchen',
    title: { bg: 'Кухня', en: 'Kitchen' },
    subtitle: { bg: 'Готвене и малки кухненски уреди', en: 'Cooking and small kitchen appliances' },
    category: 'kitchen',
    options: [
      { id: 'fridge', subgroup: { bg: 'Съхранение', en: 'Storage' }, label: { bg: 'Хладилник', en: 'Refrigerator' }, description: { bg: 'Работи постоянно.', en: 'Runs continuously.' }, kwhPerDay: 1.2, sizeKwhPerDay: { small: 0.9, standard: 1.2, large: 1.7, unknown: 1.2 }, usageTime: 'constant', confidence: 0.75 },
      { id: 'freezer', subgroup: { bg: 'Съхранение', en: 'Storage' }, label: { bg: 'Фризер', en: 'Freezer' }, description: { bg: 'Самостоятелен фризер.', en: 'Standalone freezer.' }, kwhPerDay: 0.65, sizeKwhPerDay: { small: 0.47, standard: 0.63, large: 0.86, unknown: 0.63 }, usageTime: 'constant', confidence: 0.74, detailLabel: { bg: 'Размер (L)', en: 'Size (L)' }, detailSuffix: 'L', detailType: 'number', detailMin: 50, detailMax: 500, detailStep: 10, detailDefault: 220 },
      { id: 'oven', subgroup: { bg: 'Готвене', en: 'Cooking' }, label: { bg: 'Фурна / котлони', en: 'Oven / hob' }, description: { bg: 'Основно вечер.', en: 'Mainly in the evening.' }, kwhPerDay: 1.2, sizeKwhPerDay: { small: 0.8, standard: 1.2, large: 1.8, unknown: 1.2 }, usageTime: 'evening', confidence: 0.62 },
      { id: 'dishwasher', subgroup: { bg: 'Почистване', en: 'Cleaning' }, label: { bg: 'Съдомиялна', en: 'Dishwasher' }, description: { bg: '0.8–1.5 kWh/цикъл (типично).', en: '0.8–1.5 kWh/cycle (typical).' }, kwhPerDay: 1.0, sizeKwhPerDay: { small: 0.8, standard: 1.0, large: 1.4, unknown: 1.0 }, usageTime: 'evening', confidence: 0.66 },
      { id: 'microwave', subgroup: { bg: 'Готвене', en: 'Cooking' }, label: { bg: 'Микровълнова', en: 'Microwave' }, description: { bg: 'Кратки цикли.', en: 'Short cycles.' }, kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.15, standard: 0.25, large: 0.35, unknown: 0.25 }, usageTime: 'evening', confidence: 0.68 },
      { id: 'coffee-machine', subgroup: { bg: 'Малки уреди', en: 'Small appliances' }, label: { bg: 'Кафе машина', en: 'Coffee machine' }, description: { bg: 'Включва standby (типично).', en: 'Includes standby (typical).' }, kwhPerDay: 0.35, sizeKwhPerDay: { small: 0.25, standard: 0.35, large: 0.6, unknown: 0.35 }, usageTime: 'day', confidence: 0.64 },
      { id: 'kettle', subgroup: { bg: 'Малки уреди', en: 'Small appliances' }, label: { bg: 'Електрическа кана', en: 'Electric kettle' }, description: { bg: '≈ 0.03–0.23 kWh/кипване (спрямо литри).', en: '≈ 0.03–0.23 kWh/boil (depending on litres).' }, kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.12, standard: 0.25, large: 0.45, unknown: 0.25 }, usageTime: 'day', confidence: 0.6 },
      { id: 'airfryer', subgroup: { bg: 'Готвене', en: 'Cooking' }, label: { bg: 'Еър фрайър', en: 'Air fryer' }, description: { bg: 'Средна до честа употреба.', en: 'Medium to frequent use.' }, kwhPerDay: 0.6, sizeKwhPerDay: { small: 0.4, standard: 0.6, large: 0.9, unknown: 0.6 }, usageTime: 'evening', confidence: 0.6 },
      { id: 'toaster', subgroup: { bg: 'Малки уреди', en: 'Small appliances' }, label: { bg: 'Тостер', en: 'Toaster' }, description: { bg: 'Кратки цикли.', en: 'Short cycles.' }, kwhPerDay: 0.08, sizeKwhPerDay: { small: 0.05, standard: 0.08, large: 0.12, unknown: 0.08 }, usageTime: 'morning', confidence: 0.62 },
      { id: 'electric-grill', subgroup: { bg: 'Готвене', en: 'Cooking' }, label: { bg: 'Електрически грил', en: 'Electric grill' }, description: { bg: 'Периодична употреба.', en: 'Occasional use.' }, kwhPerDay: 0.35, sizeKwhPerDay: { small: 0.25, standard: 0.35, large: 0.55, unknown: 0.35 }, usageTime: 'evening', confidence: 0.58 },
      { id: 'rice-cooker', subgroup: { bg: 'Малки уреди', en: 'Small appliances' }, label: { bg: 'Оризоварка / мултикукър', en: 'Rice cooker / multicooker' }, description: { bg: 'Периодична употреба.', en: 'Occasional use.' }, kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.18, standard: 0.25, large: 0.4, unknown: 0.25 }, usageTime: 'evening', confidence: 0.58 }
    ]
  },
  {
    id: 'laundry',
    title: { bg: 'Пране и сушене', en: 'Laundry & Drying' },
    subtitle: { bg: 'Разделени пералня, сушилня и комбиниран уред', en: 'Separate washer, dryer and combined unit' },
    category: 'laundry',
    options: [
      { id: 'washer', subgroup: { bg: 'Пране', en: 'Washing' }, label: { bg: 'Пералня', en: 'Washing machine' }, description: { bg: '≈ 0.46–1.0 kWh/цикъл (типично).', en: '≈ 0.46–1.0 kWh/cycle (typical).' }, kwhPerDay: 0.6, sizeKwhPerDay: { small: 0.45, standard: 0.6, large: 0.9, unknown: 0.6 }, usageTime: 'balanced', confidence: 0.66, detailLabel: { bg: 'Капацитет (kg)', en: 'Capacity (kg)' }, detailType: 'number', detailMin: 4, detailMax: 14, detailStep: 1, detailDefault: 8 },
      { id: 'dryer', subgroup: { bg: 'Сушене', en: 'Drying' }, label: { bg: 'Сушилня', en: 'Tumble dryer' }, description: { bg: 'Типично 2–4 kWh/цикъл.', en: 'Typically 2–4 kWh/cycle.' }, kwhPerDay: 2.6, sizeKwhPerDay: { small: 2.0, standard: 2.6, large: 3.6, unknown: 2.6 }, usageTime: 'evening', confidence: 0.58, detailLabel: { bg: 'Капацитет (kg)', en: 'Capacity (kg)' }, detailType: 'number', detailMin: 4, detailMax: 14, detailStep: 1, detailDefault: 8 },
      { id: 'washer-dryer', subgroup: { bg: 'Комбинирани', en: 'Combined' }, label: { bg: 'Пералня със сушилня', en: 'Washer-dryer' }, description: { bg: 'Комбиниран цикъл е по-скъп.', en: 'Combined cycle consumes more.' }, kwhPerDay: 3.0, sizeKwhPerDay: { small: 2.4, standard: 3.0, large: 3.8, unknown: 3.0 }, usageTime: 'evening', confidence: 0.56, detailLabel: { bg: 'Капацитет (kg)', en: 'Capacity (kg)' }, detailType: 'number', detailMin: 4, detailMax: 12, detailStep: 1, detailDefault: 8 },
      { id: 'iron', subgroup: { bg: 'Малки уреди', en: 'Small appliances' }, label: { bg: 'Ютия', en: 'Iron' }, description: { bg: 'Кратки цикли седмично.', en: 'Short weekly cycles.' }, kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.15, standard: 0.25, large: 0.4, unknown: 0.25 }, usageTime: 'day', confidence: 0.6 }
    ]
  },
  {
    id: 'electronics',
    title: { bg: 'Електроника', en: 'Electronics' },
    subtitle: { bg: 'Домашен офис, интернет и забавление', en: 'Home office, internet and entertainment' },
    category: 'electronics',
    options: [
      { id: 'tv', subgroup: { bg: 'Забавление', en: 'Entertainment' }, label: { bg: 'Телевизор', en: 'Television' }, description: { bg: '≈ 0.3–0.5 kWh/ден (типично).', en: '≈ 0.3–0.5 kWh/day (typical).' }, kwhPerDay: 0.4, sizeKwhPerDay: { small: 0.25, standard: 0.4, large: 0.6, unknown: 0.4 }, usageTime: 'evening', confidence: 0.68, detailLabel: { bg: 'Инч', en: 'Inches' }, detailSuffix: '"', detailType: 'number', detailMin: 24, detailMax: 90, detailStep: 1, detailDefault: 55 },
      { id: 'desktop', subgroup: { bg: 'Компютри', en: 'Computers' }, label: { bg: 'Настолен компютър', en: 'Desktop computer' }, description: { bg: 'Зависи от натоварване.', en: 'Depends on workload.' }, kwhPerDay: 1.3, sizeKwhPerDay: { small: 0.8, standard: 1.3, large: 2.2, unknown: 1.3 }, usageTime: 'day', confidence: 0.58 },
      { id: 'laptop', subgroup: { bg: 'Компютри', en: 'Computers' }, label: { bg: 'Лаптоп', en: 'Laptop' }, description: { bg: 'По-ниска консумация.', en: 'Lower consumption.' }, kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.15, standard: 0.25, large: 0.4, unknown: 0.25 }, usageTime: 'day', confidence: 0.66 },
      { id: 'router', subgroup: { bg: 'Интернет', en: 'Internet' }, label: { bg: 'Рутер / модем', en: 'Router / modem' }, description: { bg: '5–20W, 24/7.', en: '5–20W, 24/7.' }, kwhPerDay: 0.24, sizeKwhPerDay: { small: 0.12, standard: 0.24, large: 0.48, unknown: 0.24 }, usageTime: 'constant', confidence: 0.72 },
      { id: 'console', subgroup: { bg: 'Забавление', en: 'Entertainment' }, label: { bg: 'Игрова конзола', en: 'Gaming console' }, description: { bg: 'Вечерна употреба.', en: 'Evening use.' }, kwhPerDay: 0.6, sizeKwhPerDay: { small: 0.35, standard: 0.6, large: 1.0, unknown: 0.6 }, usageTime: 'evening', confidence: 0.6 },
      { id: 'speakers', subgroup: { bg: 'Аудио', en: 'Audio' }, label: { bg: 'Тонколони / аудио система', en: 'Speakers / audio system' }, description: { bg: 'Музика и филми.', en: 'Music and movies.' }, kwhPerDay: 0.3, sizeKwhPerDay: { small: 0.15, standard: 0.3, large: 0.6, unknown: 0.3 }, usageTime: 'evening', confidence: 0.6 },
      { id: 'monitor', subgroup: { bg: 'Компютри', en: 'Computers' }, label: { bg: 'Монитор', en: 'Monitor' }, description: { bg: 'Втори екран / офис.', en: 'Second screen / office.' }, kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.15, standard: 0.25, large: 0.4, unknown: 0.25 }, usageTime: 'day', confidence: 0.62 },
      { id: 'printer', subgroup: { bg: 'Офис', en: 'Office' }, label: { bg: 'Принтер', en: 'Printer' }, description: { bg: 'Рядка употреба + standby.', en: 'Rare use + standby.' }, kwhPerDay: 0.08, sizeKwhPerDay: { small: 0.05, standard: 0.08, large: 0.15, unknown: 0.08 }, usageTime: 'day', confidence: 0.55 },
      { id: 'network-switch', subgroup: { bg: 'Интернет', en: 'Internet' }, label: { bg: 'Суич / мрежово устройство', en: 'Switch / network device' }, description: { bg: 'Работи 24/7.', en: 'Runs 24/7.' }, kwhPerDay: 0.2, sizeKwhPerDay: { small: 0.1, standard: 0.2, large: 0.4, unknown: 0.2 }, usageTime: 'constant', confidence: 0.6 }
    ]
  },
  {
    id: 'lighting',
    title: { bg: 'Осветление', en: 'Lighting' },
    subtitle: { bg: 'Основно, LED и нощно осветление', en: 'Main, LED and night lighting' },
    category: 'lighting',
    options: [
      { id: 'lights', subgroup: { bg: 'Основно', en: 'Main' }, label: { bg: 'Лампи и осветление', en: 'Lights and lighting' }, description: { bg: 'Общо осветление в дома.', en: 'General home lighting.' }, kwhPerDay: 0.9, sizeKwhPerDay: { small: 0.5, standard: 0.9, large: 1.6, unknown: 0.9 }, usageTime: 'evening', confidence: 0.64, detailLabel: { bg: 'Мощност (W)', en: 'Power (W)' }, detailType: 'number', detailMin: 5, detailMax: 500, detailStep: 5, detailDefault: 60 },
      { id: 'led-strip', subgroup: { bg: 'LED', en: 'LED' }, label: { bg: 'LED осветление', en: 'LED lighting' }, description: { bg: 'Ленти, декоративно LED.', en: 'Strips, decorative LED.' }, kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.12, standard: 0.25, large: 0.5, unknown: 0.25 }, usageTime: 'evening', confidence: 0.66, detailLabel: { bg: 'Мощност (W)', en: 'Power (W)' }, detailType: 'number', detailMin: 5, detailMax: 200, detailStep: 5, detailDefault: 20 },
      { id: 'night-lights', subgroup: { bg: 'Нощно', en: 'Night' }, label: { bg: 'Нощно осветление', en: 'Night lighting' }, description: { bg: 'Слаба нощна светлина.', en: 'Faint night light.' }, kwhPerDay: 0.12, sizeKwhPerDay: { small: 0.06, standard: 0.12, large: 0.2, unknown: 0.12 }, usageTime: 'night', confidence: 0.64 }
    ]
  },
  {
    id: 'transport',
    title: { bg: 'Транспорт', en: 'Transport' },
    subtitle: { bg: 'Зареждане на електромобил', en: 'Electric vehicle charging' },
    category: 'transport',
    options: [
      { id: 'ev-rare', subgroup: { bg: 'EV', en: 'EV' }, label: { bg: 'Електромобил рядко', en: 'Electric car (rarely)' }, description: { bg: 'Няколко зареждания седмично.', en: 'A few charges per week.' }, kwhPerDay: 3.0, usageTime: 'evening', confidence: 0.58 },
      { id: 'ev-often', subgroup: { bg: 'EV', en: 'EV' }, label: { bg: 'Електромобил често', en: 'Electric car (often)' }, description: { bg: 'Почти всекидневно зареждане.', en: 'Nearly daily charging.' }, kwhPerDay: 8.5, usageTime: 'evening', confidence: 0.54 },
      { id: 'ebike', subgroup: { bg: 'EV', en: 'EV' }, label: { bg: 'Електрически велосипед/скутер', en: 'E-bike / scooter' }, description: { bg: 'Кратки зареждания.', en: 'Short charges.' }, kwhPerDay: 0.35, sizeKwhPerDay: { small: 0.2, standard: 0.35, large: 0.6, unknown: 0.35 }, usageTime: 'evening', confidence: 0.6 }
    ]
  },
  {
    id: 'outdoor',
    title: { bg: 'Двор и помпи', en: 'Yard & Pumps' },
    subtitle: { bg: 'Вода, инструменти и сезонни товари', en: 'Water, tools and seasonal loads' },
    category: 'outdoor',
    options: [
      { id: 'pump', subgroup: { bg: 'Вода', en: 'Water' }, label: { bg: 'Помпа за вода', en: 'Water pump' }, description: { bg: 'Кладенец, сонда или поливане.', en: 'Well, borehole or irrigation.' }, kwhPerDay: 1.4, usageTime: 'day', confidence: 0.6 },
      { id: 'vacuum', subgroup: { bg: 'Почистване', en: 'Cleaning' }, label: { bg: 'Прахосмукачка', en: 'Vacuum cleaner' }, description: { bg: 'Периодична домашна употреба.', en: 'Occasional domestic use.' }, kwhPerDay: 0.35, sizeKwhPerDay: { small: 0.25, standard: 0.35, large: 0.55, unknown: 0.35 }, usageTime: 'day', confidence: 0.64 },
      { id: 'lawn-mower', subgroup: { bg: 'Инструменти', en: 'Tools' }, label: { bg: 'Електрическа косачка', en: 'Electric lawn mower' }, description: { bg: 'Сезонно/периодично.', en: 'Seasonal / occasional.' }, kwhPerDay: 0.4, sizeKwhPerDay: { small: 0.25, standard: 0.4, large: 0.7, unknown: 0.4 }, usageTime: 'day', confidence: 0.5 },
      { id: 'pool-pump', subgroup: { bg: 'Вода', en: 'Water' }, label: { bg: 'Помпа за басейн', en: 'Pool pump' }, description: { bg: 'Сезонна и по-дълга работа.', en: 'Seasonal, longer run times.' }, kwhPerDay: 3.5, sizeKwhPerDay: { small: 2.5, standard: 3.5, large: 5.5, unknown: 3.5 }, usageTime: 'day', confidence: 0.45 }
    ]
  }
];

export function quickSelectionsToAppliances(
  selections: Record<string, string[]>,
  options: { boilerLiters?: number; intensities?: Record<string, 'low' | 'medium' | 'high' | 'unknown'> } = {}
) {
  const intensityMultiplier = (intensity: 'low' | 'medium' | 'high' | 'unknown' = 'unknown') => {
    if (intensity === 'low') return 0.75;
    if (intensity === 'high') return 1.35;
    return 1;
  };

  const litersToKwh = (liters: number) => Math.max(0.5, liters * 0.04);

  return QUICK_APPLIANCE_GROUPS.flatMap((group) =>
    (selections[group.id] ?? [])
      .map((optionId) => {
        const option = group.options.find((item) => item.id === optionId);
        if (!option) return null;

        const selectedIntensity = options.intensities?.[group.id] ?? 'unknown';
        const isCustomBoiler = group.id === 'boiler' && option.id === 'custom-liters';
        let estimatedKwhPerDay = isCustomBoiler ? litersToKwh(options.boilerLiters ?? 80) : option.kwhPerDay;

        if (!isCustomBoiler && estimatedKwhPerDay <= 0) return null;
        if (!isCustomBoiler) {
          estimatedKwhPerDay *= intensityMultiplier(selectedIntensity);
        }

        return {
          id: `quick-${group.id}-${option.id}`,
          name: group.title,
          category: group.category,
          label: isCustomBoiler ? `${options.boilerLiters ?? 80} L` : option.label,
          estimatedKwhPerDay,
          usageTime: option.usageTime,
          confidence: option.confidence,
          explanation: isCustomBoiler
            ? { bg: `Изчислено от ${options.boilerLiters ?? 80} литра бойлер.`, en: `Calculated from ${options.boilerLiters ?? 80} litre boiler.` }
            : option.warning ?? { bg: 'Бърз preset със средна стойност.', en: 'Quick preset with average value.' }
        } satisfies ApplianceInput;
      })
      .filter(Boolean)
  ) as ApplianceInput[];
}
