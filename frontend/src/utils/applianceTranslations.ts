import type { Language } from '../context/LanguageContext';
import type { AppliancePreset } from '../types';

export function getLocalizedText(
  text: string | { bg: string; en: string } | undefined,
  language: Language,
  fallback: string = ''
): string {
  if (!text) return fallback;
  if (typeof text === 'string') return text;
  return text[language] || fallback;
}

export function getLocalizedAppliance(preset: AppliancePreset, language: Language): AppliancePreset {
  return {
    ...preset,
    name: getLocalizedText(preset.name, language, preset.id),
    label: getLocalizedText(preset.label, language),
    explanation: getLocalizedText(preset.explanation, language),
  };
}
