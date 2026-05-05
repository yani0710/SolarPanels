import type { ApplianceInput } from '../types';

export interface QuickApplianceOption {
  id: string;
  subgroup?: string;
  label: string;
  description?: string;
  kwhPerDay: number;
  sizeKwhPerDay?: Partial<Record<'small' | 'standard' | 'large' | 'unknown', number>>;
  usageTime: ApplianceInput['usageTime'];
  confidence: number;
  warning?: string;
  detailLabel?: string;
  detailSuffix?: string;
  detailType?: 'number' | 'text';
  detailMin?: number;
  detailMax?: number;
  detailStep?: number;
  detailDefault?: number;
}

export interface QuickApplianceGroup {
  id: string;
  title: string;
  subtitle?: string;
  category: ApplianceInput['category'];
  options: QuickApplianceOption[];
}

export const QUICK_APPLIANCE_GROUPS: QuickApplianceGroup[] = [
  {
    id: 'boiler',
    title: 'Бойлер',
    subtitle: 'Топла вода',
    category: 'hotWater',
    options: [
      { id: 'boiler', subgroup: 'Бойлер', label: 'Бойлер', description: 'Размерът се избира в настройките на уреда.', kwhPerDay: 3.2, usageTime: 'evening', confidence: 0.72 }
    ]
  },
  {
    id: 'heatingCooling',
    title: 'Отопление и охлаждане',
    subtitle: 'Климатици и термоконтрол',
    category: 'heatingCooling',
    options: [
      {
        id: 'ac',
        subgroup: 'Климатик',
        label: 'Климатик',
        description: 'Брой се задава от "Количество".',
        kwhPerDay: 4.5,
        sizeKwhPerDay: { small: 3.0, standard: 4.5, large: 6.5, unknown: 4.5 },
        usageTime: 'evening',
        confidence: 0.62,
        detailLabel: 'Мощност (BTU)',
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
    title: 'Кухня',
    subtitle: 'Готвене и малки кухненски уреди',
    category: 'kitchen',
    options: [
      {
        id: 'fridge',
        subgroup: 'Съхранение',
        label: 'Хладилник',
        description: 'Работи постоянно.',
        kwhPerDay: 1.2,
        sizeKwhPerDay: { small: 0.9, standard: 1.2, large: 1.7, unknown: 1.2 },
        usageTime: 'constant',
        confidence: 0.75
      },
      {
        id: 'freezer',
        subgroup: 'Съхранение',
        label: 'Фризер',
        description: 'Самостоятелен фризер.',
        kwhPerDay: 0.65,
        sizeKwhPerDay: { small: 0.47, standard: 0.63, large: 0.86, unknown: 0.63 },
        usageTime: 'constant',
        confidence: 0.74,
        detailLabel: 'Размер (L)',
        detailSuffix: 'L',
        detailType: 'number',
        detailMin: 50,
        detailMax: 500,
        detailStep: 10,
        detailDefault: 220
      },
      {
        id: 'oven',
        subgroup: 'Готвене',
        label: 'Фурна / котлони',
        description: 'Основно вечер.',
        kwhPerDay: 1.2,
        sizeKwhPerDay: { small: 0.8, standard: 1.2, large: 1.8, unknown: 1.2 },
        usageTime: 'evening',
        confidence: 0.62
      },
      {
        id: 'dishwasher',
        subgroup: 'Почистване',
        label: 'Съдомиялна',
        description: '0.8–1.5 kWh/цикъл (типично).',
        kwhPerDay: 1.0,
        sizeKwhPerDay: { small: 0.8, standard: 1.0, large: 1.4, unknown: 1.0 },
        usageTime: 'evening',
        confidence: 0.66
      },
      {
        id: 'microwave',
        subgroup: 'Готвене',
        label: 'Микровълнова',
        description: 'Кратки цикли.',
        kwhPerDay: 0.25,
        sizeKwhPerDay: { small: 0.15, standard: 0.25, large: 0.35, unknown: 0.25 },
        usageTime: 'evening',
        confidence: 0.68
      },
      {
        id: 'coffee-machine',
        subgroup: 'Малки уреди',
        label: 'Кафе машина',
        description: 'Включва standby (типично).',
        kwhPerDay: 0.35,
        sizeKwhPerDay: { small: 0.25, standard: 0.35, large: 0.6, unknown: 0.35 },
        usageTime: 'day',
        confidence: 0.64
      },
      {
        id: 'kettle',
        subgroup: 'Малки уреди',
        label: 'Електрическа кана',
        description: '≈ 0.03–0.23 kWh/кипване (спрямо литри).',
        kwhPerDay: 0.25,
        sizeKwhPerDay: { small: 0.12, standard: 0.25, large: 0.45, unknown: 0.25 },
        usageTime: 'day',
        confidence: 0.6
      },
      {
        id: 'airfryer',
        subgroup: 'Готвене',
        label: 'Еър фрайър',
        description: 'Средна до честа употреба.',
        kwhPerDay: 0.6,
        sizeKwhPerDay: { small: 0.4, standard: 0.6, large: 0.9, unknown: 0.6 },
        usageTime: 'evening',
        confidence: 0.6
      },
      {
        id: 'toaster',
        subgroup: 'Малки уреди',
        label: 'Тостер',
        description: 'Кратки цикли.',
        kwhPerDay: 0.08,
        sizeKwhPerDay: { small: 0.05, standard: 0.08, large: 0.12, unknown: 0.08 },
        usageTime: 'morning',
        confidence: 0.62
      },
      {
        id: 'electric-grill',
        subgroup: 'Готвене',
        label: 'Електрически грил',
        description: 'Периодична употреба.',
        kwhPerDay: 0.35,
        sizeKwhPerDay: { small: 0.25, standard: 0.35, large: 0.55, unknown: 0.35 },
        usageTime: 'evening',
        confidence: 0.58
      },
      {
        id: 'rice-cooker',
        subgroup: 'Малки уреди',
        label: 'Оризоварка / мултикукър',
        description: 'Периодична употреба.',
        kwhPerDay: 0.25,
        sizeKwhPerDay: { small: 0.18, standard: 0.25, large: 0.4, unknown: 0.25 },
        usageTime: 'evening',
        confidence: 0.58
      }
    ]
  },
  {
    id: 'laundry',
    title: 'Пране и сушене',
    subtitle: 'Разделени пералня, сушилня и комбиниран уред',
    category: 'laundry',
    options: [
      { id: 'washer', subgroup: 'Пране', label: 'Пералня', description: '≈ 0.46–1.0 kWh/цикъл (типично).', kwhPerDay: 0.6, sizeKwhPerDay: { small: 0.45, standard: 0.6, large: 0.9, unknown: 0.6 }, usageTime: 'balanced', confidence: 0.66, detailLabel: 'Капацитет (kg)', detailType: 'number', detailMin: 4, detailMax: 14, detailStep: 1, detailDefault: 8 },
      { id: 'dryer', subgroup: 'Сушене', label: 'Сушилня', description: 'Типично 2–4 kWh/цикъл.', kwhPerDay: 2.6, sizeKwhPerDay: { small: 2.0, standard: 2.6, large: 3.6, unknown: 2.6 }, usageTime: 'evening', confidence: 0.58, detailLabel: 'Капацитет (kg)', detailType: 'number', detailMin: 4, detailMax: 14, detailStep: 1, detailDefault: 8 },
      { id: 'washer-dryer', subgroup: 'Комбинирани', label: 'Пералня със сушилня', description: 'Комбиниран цикъл е по-скъп.', kwhPerDay: 3.0, sizeKwhPerDay: { small: 2.4, standard: 3.0, large: 3.8, unknown: 3.0 }, usageTime: 'evening', confidence: 0.56, detailLabel: 'Капацитет (kg)', detailType: 'number', detailMin: 4, detailMax: 12, detailStep: 1, detailDefault: 8 },
      { id: 'iron', subgroup: 'Малки уреди', label: 'Ютия', description: 'Кратки цикли седмично.', kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.15, standard: 0.25, large: 0.4, unknown: 0.25 }, usageTime: 'day', confidence: 0.6 }
    ]
  },
  {
    id: 'electronics',
    title: 'Електроника',
    subtitle: 'Домашен офис, интернет и забавление',
    category: 'electronics',
    options: [
      { id: 'tv', subgroup: 'Забавление', label: 'Телевизор', description: '≈ 0.3–0.5 kWh/ден (типично).', kwhPerDay: 0.4, sizeKwhPerDay: { small: 0.25, standard: 0.4, large: 0.6, unknown: 0.4 }, usageTime: 'evening', confidence: 0.68, detailLabel: 'Инч', detailSuffix: '"', detailType: 'number', detailMin: 24, detailMax: 90, detailStep: 1, detailDefault: 55 },
      { id: 'desktop', subgroup: 'Компютри', label: 'Настолен компютър', description: 'Зависи от натоварване.', kwhPerDay: 1.3, sizeKwhPerDay: { small: 0.8, standard: 1.3, large: 2.2, unknown: 1.3 }, usageTime: 'day', confidence: 0.58 },
      { id: 'laptop', subgroup: 'Компютри', label: 'Лаптоп', description: 'По-ниска консумация.', kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.15, standard: 0.25, large: 0.4, unknown: 0.25 }, usageTime: 'day', confidence: 0.66 },
      { id: 'router', subgroup: 'Интернет', label: 'Рутер / модем', description: '5–20W, 24/7.', kwhPerDay: 0.24, sizeKwhPerDay: { small: 0.12, standard: 0.24, large: 0.48, unknown: 0.24 }, usageTime: 'constant', confidence: 0.72 },
      { id: 'console', subgroup: 'Забавление', label: 'Игрова конзола', description: 'Вечерна употреба.', kwhPerDay: 0.6, sizeKwhPerDay: { small: 0.35, standard: 0.6, large: 1.0, unknown: 0.6 }, usageTime: 'evening', confidence: 0.6 },
      { id: 'speakers', subgroup: 'Аудио', label: 'Тонколони / аудио система', description: 'Музика и филми.', kwhPerDay: 0.3, sizeKwhPerDay: { small: 0.15, standard: 0.3, large: 0.6, unknown: 0.3 }, usageTime: 'evening', confidence: 0.6 }
      ,
      { id: 'monitor', subgroup: 'Компютри', label: 'Монитор', description: 'Втори екран / офис.', kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.15, standard: 0.25, large: 0.4, unknown: 0.25 }, usageTime: 'day', confidence: 0.62 },
      { id: 'printer', subgroup: 'Офис', label: 'Принтер', description: 'Рядка употреба + standby.', kwhPerDay: 0.08, sizeKwhPerDay: { small: 0.05, standard: 0.08, large: 0.15, unknown: 0.08 }, usageTime: 'day', confidence: 0.55 },
      { id: 'network-switch', subgroup: 'Интернет', label: 'Суич / мрежово устройство', description: 'Работи 24/7.', kwhPerDay: 0.2, sizeKwhPerDay: { small: 0.1, standard: 0.2, large: 0.4, unknown: 0.2 }, usageTime: 'constant', confidence: 0.6 }
    ]
  },
  {
    id: 'lighting',
    title: 'Осветление',
    subtitle: 'Основно, LED и нощно осветление',
    category: 'lighting',
    options: [
      { id: 'lights', subgroup: 'Основно', label: 'Лампи и осветление', description: 'Общо осветление в дома.', kwhPerDay: 0.9, sizeKwhPerDay: { small: 0.5, standard: 0.9, large: 1.6, unknown: 0.9 }, usageTime: 'evening', confidence: 0.64, detailLabel: 'Мощност (W)', detailType: 'number', detailMin: 5, detailMax: 500, detailStep: 5, detailDefault: 60 },
      { id: 'led-strip', subgroup: 'LED', label: 'LED осветление', description: 'Ленти, декоративно LED.', kwhPerDay: 0.25, sizeKwhPerDay: { small: 0.12, standard: 0.25, large: 0.5, unknown: 0.25 }, usageTime: 'evening', confidence: 0.66, detailLabel: 'Мощност (W)', detailType: 'number', detailMin: 5, detailMax: 200, detailStep: 5, detailDefault: 20 },
      { id: 'night-lights', subgroup: 'Нощно', label: 'Нощно осветление', description: 'Слаба нощна светлина.', kwhPerDay: 0.12, sizeKwhPerDay: { small: 0.06, standard: 0.12, large: 0.2, unknown: 0.12 }, usageTime: 'night', confidence: 0.64 }
    ]
  },
  {
    id: 'transport',
    title: 'Транспорт',
    subtitle: 'Зареждане на електромобил',
    category: 'transport',
    options: [
      { id: 'ev-rare', subgroup: 'EV', label: 'Електромобил рядко', description: 'Няколко зареждания седмично.', kwhPerDay: 3.0, usageTime: 'evening', confidence: 0.58 },
      { id: 'ev-often', subgroup: 'EV', label: 'Електромобил често', description: 'Почти всекидневно зареждане.', kwhPerDay: 8.5, usageTime: 'evening', confidence: 0.54 },
      { id: 'ebike', subgroup: 'EV', label: 'Електрически велосипед/скутер', description: 'Кратки зареждания.', kwhPerDay: 0.35, sizeKwhPerDay: { small: 0.2, standard: 0.35, large: 0.6, unknown: 0.35 }, usageTime: 'evening', confidence: 0.6 }
    ]
  },
  {
    id: 'outdoor',
    title: 'Двор и помпи',
    subtitle: 'Вода, инструменти и сезонни товари',
    category: 'outdoor',
    options: [
      { id: 'pump', subgroup: 'Вода', label: 'Помпа за вода', description: 'Кладенец, сонда или поливане.', kwhPerDay: 1.4, usageTime: 'day', confidence: 0.6 },
      { id: 'vacuum', subgroup: 'Почистване', label: 'Прахосмукачка', description: 'Периодична домашна употреба.', kwhPerDay: 0.35, sizeKwhPerDay: { small: 0.25, standard: 0.35, large: 0.55, unknown: 0.35 }, usageTime: 'day', confidence: 0.64 },
      { id: 'lawn-mower', subgroup: 'Инструменти', label: 'Електрическа косачка', description: 'Сезонно/периодично.', kwhPerDay: 0.4, sizeKwhPerDay: { small: 0.25, standard: 0.4, large: 0.7, unknown: 0.4 }, usageTime: 'day', confidence: 0.5 },
      { id: 'pool-pump', subgroup: 'Вода', label: 'Помпа за басейн', description: 'Сезонна и по-дълга работа.', kwhPerDay: 3.5, sizeKwhPerDay: { small: 2.5, standard: 3.5, large: 5.5, unknown: 3.5 }, usageTime: 'day', confidence: 0.45 }
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
            ? `Изчислено от ${options.boilerLiters ?? 80} литра бойлер.`
            : option.warning ?? 'Бърз preset със средна стойност.'
        } satisfies ApplianceInput;
      })
      .filter(Boolean)
  ) as ApplianceInput[];
}
