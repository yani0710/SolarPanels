type Language = 'bg' | 'en';

const REGION_LABELS: Record<string, Record<Language, string>> = {
  sofia: { bg: 'София и Западна България', en: 'Sofia and Western Bulgaria' },
  plovdiv: { bg: 'Пловдив / Тракия', en: 'Plovdiv / Thrace' },
  varna: { bg: 'Варна / Черноморие', en: 'Varna / Black Sea coast' },
  burgas: { bg: 'Бургас / Южно Черноморие', en: 'Burgas / Southern Black Sea' },
  ruse: { bg: 'Русе / Дунавска равнина', en: 'Ruse / Danube plain' },
  mountain: { bg: 'Планински район', en: 'Mountain region' },
  unknown: { bg: 'Не знам / средна стойност', en: 'Unknown / average value' }
};

export const REGION_SOLAR_DATA: Record<string, { label: string; sunHours: number }> = {
  sofia: { label: 'София и Западна България', sunHours: 3.6 },
  plovdiv: { label: 'Пловдив / Тракия', sunHours: 4.0 },
  varna: { label: 'Варна / Черноморие', sunHours: 3.8 },
  burgas: { label: 'Бургас / Южно Черноморие', sunHours: 4.1 },
  ruse: { label: 'Русе / Дунавска равнина', sunHours: 3.7 },
  mountain: { label: 'Планински район', sunHours: 3.3 },
  unknown: { label: 'Не знам / средна стойност', sunHours: 3.8 }
};

export function getRegionLabel(id: string, language: Language): string {
  return REGION_LABELS[id]?.[language] ?? REGION_LABELS['unknown']?.[language] ?? id;
}