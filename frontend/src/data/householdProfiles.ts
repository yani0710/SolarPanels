type Language = 'bg' | 'en';
import { APPLIANCE_PRESETS } from './appliancePresets';

const byIds = (ids: string[]) => APPLIANCE_PRESETS.filter((item) => ids.includes(item.id));

const PROFILE_LABELS: Record<string, Record<Language, string>> = {
  'small-home': { bg: 'Малко домакинство', en: 'Small household' },
  'medium-home': { bg: 'Средно домакинство', en: 'Medium household' },
  'large-home': { bg: 'Голямо домакинство', en: 'Large household' },
  'ac-home': { bg: 'Къща с климатици', en: 'House with AC' },
  'villa': { bg: 'Вила', en: 'Villa' },
  'office': { bg: 'Малък офис', en: 'Small office' },
  'farm': { bg: 'Ферма', en: 'Farm' },
  'custom': { bg: 'Собствен профил', en: 'Custom profile' }
};

const PROFILE_DESCRIPTIONS: Record<string, Record<Language, string>> = {
  'small-home': { bg: 'Основни уреди и умерена сметка.', en: 'Basic appliances and moderate bill.' },
  'medium-home': { bg: 'Типична къща или апартамент с бойлер.', en: 'Typical house or apartment with water heater.' },
  'large-home': { bg: 'Повече уреди, топла вода и вечерно потребление.', en: 'More appliances, hot water and evening consumption.' },
  'ac-home': { bg: 'Отопление/охлаждане с климатици.', en: 'Heating/cooling with air conditioners.' },
  'villa': { bg: 'Непостоянно ползване и нужда от автономност.', en: 'Occasional use with need for autonomy.' },
  'office': { bg: 'Преобладаващо дневно потребление.', en: 'Predominantly daytime consumption.' },
  'farm': { bg: 'Дворни уреди, помпи и възможна нужда от backup.', en: 'Outdoor appliances, pumps and possible backup need.' },
  'custom': { bg: 'Започни от празен списък и избери уреди.', en: 'Start from an empty list and select appliances.' }
};

export function getProfileLabel(id: string): string {
  return PROFILE_LABELS[id]?.en ?? id;
}

export function getProfileDescription(id: string): string {
  return PROFILE_DESCRIPTIONS[id]?.en ?? '';
}

export function translateProfile(id: string, language: Language): { label: string; description: string } {
  const label = PROFILE_LABELS[id]?.[language] ?? PROFILE_LABELS[id]?.en ?? id;
  const description = PROFILE_DESCRIPTIONS[id]?.[language] ?? PROFILE_DESCRIPTIONS[id]?.en ?? '';
  return { label, description };
}

export const HOUSEHOLD_PROFILES = [
  { id: 'small-home', appliances: byIds(['fridge-standard', 'lighting', 'laptop', 'washer']) },
  { id: 'medium-home', appliances: byIds(['fridge-standard', 'boiler-standard', 'lighting', 'washer', 'dishwasher', 'desktop']) },
  { id: 'large-home', appliances: byIds(['fridge-old', 'boiler-large', 'lighting', 'washer', 'dishwasher', 'ac-medium', 'desktop']) },
  { id: 'ac-home', appliances: byIds(['fridge-standard', 'boiler-standard', 'ac-large', 'lighting', 'washer']) },
  { id: 'villa', appliances: byIds(['fridge-new', 'lighting', 'pump', 'boiler-small']) },
  { id: 'office', appliances: byIds(['office', 'lighting', 'ac-medium']) },
  { id: 'farm', appliances: byIds(['pump', 'fridge-old', 'lighting', 'office']) },
  { id: 'custom', appliances: [] }
];