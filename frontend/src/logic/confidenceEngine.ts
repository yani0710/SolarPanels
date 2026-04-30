import type { Confidence } from '../types';

export function calculateConfidenceScore(base: number, unknownAnswers: number, severeWarnings: number) {
  return Math.max(30, Math.min(92, Math.round(base - unknownAnswers * 5 - severeWarnings * 12)));
}

export function confidenceLabel(score: number): Confidence {
  if (score >= 76) return 'добро';
  if (score <= 55) return 'ниско';
  return 'средно';
}
