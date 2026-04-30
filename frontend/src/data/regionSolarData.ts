export const REGION_SOLAR_DATA: Record<string, { label: string; sunHours: number }> = {
  sofia: { label: 'София и Западна България', sunHours: 3.6 },
  plovdiv: { label: 'Пловдив / Тракия', sunHours: 4.0 },
  varna: { label: 'Варна / Черноморие', sunHours: 3.8 },
  burgas: { label: 'Бургас / Южно Черноморие', sunHours: 4.1 },
  ruse: { label: 'Русе / Дунавска равнина', sunHours: 3.7 },
  mountain: { label: 'Планински район', sunHours: 3.3 },
  unknown: { label: 'Не знам / средна стойност', sunHours: 3.8 }
};
