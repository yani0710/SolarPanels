import { APPLIANCE_PRESETS } from './appliancePresets';

const byIds = (ids: string[]) => APPLIANCE_PRESETS.filter((item) => ids.includes(item.id));

export const HOUSEHOLD_PROFILES = [
  { id: 'small-home', label: 'Малко домакинство', description: 'Основни уреди и умерена сметка.', appliances: byIds(['fridge-standard', 'lighting', 'laptop', 'washer']) },
  { id: 'medium-home', label: 'Средно домакинство', description: 'Типична къща или апартамент с бойлер.', appliances: byIds(['fridge-standard', 'boiler-standard', 'lighting', 'washer', 'dishwasher', 'desktop']) },
  { id: 'large-home', label: 'Голямо домакинство', description: 'Повече уреди, топла вода и вечерно потребление.', appliances: byIds(['fridge-old', 'boiler-large', 'lighting', 'washer', 'dishwasher', 'ac-medium', 'desktop']) },
  { id: 'ac-home', label: 'Къща с климатици', description: 'Отопление/охлаждане с климатици.', appliances: byIds(['fridge-standard', 'boiler-standard', 'ac-large', 'lighting', 'washer']) },
  { id: 'villa', label: 'Вила', description: 'Непостоянно ползване и нужда от автономност.', appliances: byIds(['fridge-new', 'lighting', 'pump', 'boiler-small']) },
  { id: 'office', label: 'Малък офис', description: 'Преобладаващо дневно потребление.', appliances: byIds(['office', 'lighting', 'ac-medium']) },
  { id: 'farm', label: 'Ферма', description: 'Дворни уреди, помпи и възможна нужда от backup.', appliances: byIds(['pump', 'fridge-old', 'lighting', 'office']) },
  { id: 'custom', label: 'Собствен профил', description: 'Започни от празен списък и избери уреди.', appliances: [] }
];
