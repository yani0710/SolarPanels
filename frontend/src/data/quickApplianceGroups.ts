import type { ApplianceInput } from '../types';

export interface QuickApplianceGroup {
  id: string;
  title: string;
  category: ApplianceInput['category'];
  options: Array<{
    id: string;
    label: string;
    kwhPerDay: number;
    usageTime: ApplianceInput['usageTime'];
    confidence: number;
    warning?: string;
  }>;
}

export const QUICK_APPLIANCE_GROUPS: QuickApplianceGroup[] = [
  {
    id: 'boiler',
    title: 'Бойлер',
    category: 'hotWater',
    options: [
      { id: 'none', label: 'Нямам', kwhPerDay: 0, usageTime: 'unknown', confidence: 0.9 },
      { id: 'unknown', label: 'Не знам', kwhPerDay: 3.2, usageTime: 'evening', confidence: 0.55 },
      { id: 'small', label: 'Малък', kwhPerDay: 2.2, usageTime: 'evening', confidence: 0.72 },
      { id: 'standard', label: 'Стандартен', kwhPerDay: 3.2, usageTime: 'evening', confidence: 0.76 },
      { id: 'large', label: 'Голям', kwhPerDay: 5.0, usageTime: 'evening', confidence: 0.68 }
    ]
  },
  {
    id: 'ac',
    title: 'Климатици',
    category: 'heatingCooling',
    options: [
      { id: 'none', label: 'Нямам', kwhPerDay: 0, usageTime: 'unknown', confidence: 0.9 },
      { id: 'one-normal', label: '1 климатик нормално', kwhPerDay: 3.2, usageTime: 'evening', confidence: 0.68 },
      { id: 'two-daily', label: '2+ всеки ден', kwhPerDay: 7.8, usageTime: 'constant', confidence: 0.62 },
      { id: 'intense', label: 'Много интензивно', kwhPerDay: 11.5, usageTime: 'constant', confidence: 0.54 },
      { id: 'unknown', label: 'Не знам', kwhPerDay: 4.2, usageTime: 'seasonal', confidence: 0.5 }
    ]
  },
  {
    id: 'kitchen',
    title: 'Кухненски уреди',
    category: 'kitchen',
    options: [
      { id: 'basic', label: 'Хладилник/фризер', kwhPerDay: 1.1, usageTime: 'constant', confidence: 0.76 },
      { id: 'cooking', label: 'Фурна/котлони често', kwhPerDay: 2.4, usageTime: 'evening', confidence: 0.64 },
      { id: 'dishwasher', label: 'Съдомиялна', kwhPerDay: 0.8, usageTime: 'evening', confidence: 0.7 },
      { id: 'unknown', label: 'Не знам', kwhPerDay: 1.6, usageTime: 'balanced', confidence: 0.55 }
    ]
  },
  {
    id: 'laundry',
    title: 'Пране и сушене',
    category: 'laundry',
    options: [
      { id: 'washer', label: 'Пералня', kwhPerDay: 0.55, usageTime: 'balanced', confidence: 0.7 },
      { id: 'dryer-rare', label: 'Сушилня рядко', kwhPerDay: 0.9, usageTime: 'evening', confidence: 0.62 },
      { id: 'dryer-often', label: 'Сушилня често', kwhPerDay: 2.4, usageTime: 'evening', confidence: 0.6 },
      { id: 'unknown', label: 'Не знам', kwhPerDay: 0.8, usageTime: 'unknown', confidence: 0.55 }
    ]
  },
  {
    id: 'work',
    title: 'Работа, двор и транспорт',
    category: 'electronics',
    options: [
      { id: 'home-office', label: 'Компютър/home office', kwhPerDay: 1.1, usageTime: 'day', confidence: 0.72 },
      { id: 'pump', label: 'Помпа за вода', kwhPerDay: 1.4, usageTime: 'day', confidence: 0.6 },
      { id: 'ev-rare', label: 'Електромобил рядко', kwhPerDay: 3.0, usageTime: 'evening', confidence: 0.58 },
      { id: 'ev-often', label: 'Електромобил често', kwhPerDay: 8.5, usageTime: 'evening', confidence: 0.54 },
      { id: 'business-machines', label: 'Машини за бизнес', kwhPerDay: 7.0, usageTime: 'day', confidence: 0.45, warning: 'Бизнес машините могат силно да изкривят бързата оценка. Детайлният режим е по-подходящ.' }
    ]
  }
];

export function quickSelectionsToAppliances(selections: Record<string, string[]>) {
  return QUICK_APPLIANCE_GROUPS.flatMap((group) =>
    (selections[group.id] ?? [])
      .map((optionId) => {
        const option = group.options.find((item) => item.id === optionId);
        if (!option || option.kwhPerDay <= 0) return null;
        return {
          id: `quick-${group.id}-${option.id}`,
          name: group.title,
          category: group.category,
          label: option.label,
          estimatedKwhPerDay: option.kwhPerDay,
          usageTime: option.usageTime,
          confidence: option.confidence,
          explanation: option.warning ?? 'Бърз preset със средна стойност.'
        } satisfies ApplianceInput;
      })
      .filter(Boolean)
  ) as ApplianceInput[];
}
