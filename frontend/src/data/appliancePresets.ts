import type { AppliancePreset } from '../types';

export const APPLIANCE_PRESETS: AppliancePreset[] = [
  { id: 'boiler-small', name: 'Бойлер', category: 'hotWater', label: 'Малък', estimatedKwhPerDay: 2.2, usageTime: 'evening', confidence: 0.72, explanation: 'Подходящо за малък бойлер или рядко ползване.' },
  { id: 'boiler-standard', name: 'Бойлер', category: 'hotWater', label: 'Стандартен', estimatedKwhPerDay: 3.2, usageTime: 'evening', confidence: 0.76, explanation: 'Типична стойност за около 80 литра.' },
  { id: 'boiler-large', name: 'Бойлер', category: 'hotWater', label: 'Голям / интензивно', estimatedKwhPerDay: 5.0, usageTime: 'evening', confidence: 0.68, explanation: 'За голямо домакинство или честа топла вода.' },
  { id: 'boiler-unknown', name: 'Бойлер', category: 'hotWater', label: 'Не знам', estimatedKwhPerDay: 3.2, usageTime: 'unknown', confidence: 0.55, explanation: 'Използваме стандартна средна стойност.' },
  { id: 'ac-small', name: 'Климатик', category: 'heatingCooling', label: 'Малък / рядко', estimatedKwhPerDay: 1.6, usageTime: 'seasonal', confidence: 0.66, explanation: 'Леко охлаждане или отопление.' },
  { id: 'ac-medium', name: 'Климатик', category: 'heatingCooling', label: 'Среден / всеки ден', estimatedKwhPerDay: 3.8, usageTime: 'evening', confidence: 0.7, explanation: 'Често използван климатик в дневна или спалня.' },
  { id: 'ac-large', name: 'Климатик', category: 'heatingCooling', label: 'Голям / отопление', estimatedKwhPerDay: 6.5, usageTime: 'constant', confidence: 0.62, explanation: 'Когато климатикът е основно отопление.' },
  { id: 'fridge-new', name: 'Хладилник', category: 'kitchen', label: 'Малък / нов', estimatedKwhPerDay: 0.55, usageTime: 'constant', confidence: 0.8, explanation: 'Ефективен нов уред.' },
  { id: 'fridge-standard', name: 'Хладилник', category: 'kitchen', label: 'Стандартен', estimatedKwhPerDay: 0.9, usageTime: 'constant', confidence: 0.78, explanation: 'Средна стойност за нормален хладилник.' },
  { id: 'fridge-old', name: 'Хладилник', category: 'kitchen', label: 'Голям / стар', estimatedKwhPerDay: 1.5, usageTime: 'constant', confidence: 0.68, explanation: 'По-старите уреди често харчат повече.' },
  { id: 'laptop', name: 'Компютър', category: 'electronics', label: 'Лаптоп', wattage: 65, hoursPerDay: 6, daysPerMonth: 24, usageTime: 'day', confidence: 0.78, explanation: 'Лек работен режим.' },
  { id: 'desktop', name: 'Компютър', category: 'electronics', label: 'Стандартен компютър', wattage: 180, hoursPerDay: 5, daysPerMonth: 24, usageTime: 'day', confidence: 0.72, explanation: 'Офис или домашен компютър.' },
  { id: 'gaming-pc', name: 'Компютър', category: 'electronics', label: 'Gaming / workstation', wattage: 450, hoursPerDay: 4, daysPerMonth: 22, usageTime: 'evening', confidence: 0.66, explanation: 'По-високо вечерно потребление.' },
  { id: 'washer', name: 'Пералня', category: 'laundry', label: 'Стандартна', estimatedKwhPerDay: 0.55, usageTime: 'balanced', confidence: 0.7, explanation: 'Средно седмично ползване, разпределено дневно.' },
  { id: 'dishwasher', name: 'Съдомиялна', category: 'kitchen', label: 'Стандартна', estimatedKwhPerDay: 0.75, usageTime: 'evening', confidence: 0.7, explanation: 'Често се пуска вечер.' },
  { id: 'lighting', name: 'Осветление', category: 'lighting', label: 'LED осветление', estimatedKwhPerDay: 0.7, usageTime: 'evening', confidence: 0.74, explanation: 'Средна стойност за LED осветление.' },
  { id: 'pump', name: 'Помпа', category: 'outdoor', label: 'Двор / кладенец', estimatedKwhPerDay: 1.4, usageTime: 'day', confidence: 0.6, explanation: 'Зависи силно от сезона и дебита.' },
  { id: 'ev-low', name: 'Електромобил', category: 'transport', label: 'Кара се рядко', estimatedKwhPerDay: 3.0, usageTime: 'evening', confidence: 0.62, explanation: 'Леко седмично зареждане.' },
  { id: 'ev-medium', name: 'Електромобил', category: 'transport', label: 'Средно ползване', estimatedKwhPerDay: 7.0, usageTime: 'evening', confidence: 0.62, explanation: 'Редовно зареждане у дома.' },
  { id: 'ev-high', name: 'Електромобил', category: 'transport', label: 'Много каране', estimatedKwhPerDay: 12.0, usageTime: 'evening', confidence: 0.56, explanation: 'Високо потребление, подходящо за детайлна оценка.' },
  { id: 'office', name: 'Офис техника', category: 'business', label: 'Малък офис', estimatedKwhPerDay: 4.2, usageTime: 'day', confidence: 0.66, explanation: 'Компютри, принтери, рутери и осветление.' }
];
