import { DEFAULT_ASSUMPTIONS } from '../data/defaultAssumptions';
import { REGION_SOLAR_DATA } from '../data/regionSolarData';
import { SYSTEM_RULES } from '../data/systemRules';
import type { ApplianceInput, DetailedAssessmentInput, QuickAssessmentInput, RecommendationResult, SystemType } from '../types';
import { calculateApplianceConsumption, calculateDayNightSplit, calculateDayNightSplitFromUsage, calculateTotalConsumption, estimateConsumptionFromBill, recommendBatteryCapacity, recommendSystemSize } from './calculations';
import { generateSmartAdvice, generateWarnings, nextStepsFor } from './adviceEngine';

function productionFactor(sunCondition: string) {
  if (sunCondition === 'heavyShade') return DEFAULT_ASSUMPTIONS.heavyShadeProductionFactor;
  if (sunCondition === 'partialShade') return DEFAULT_ASSUMPTIONS.partialShadeProductionFactor;
  return 1;
}

function recommendSystemType(params: {
  goal: string;
  wantsBackup: boolean;
  batteryNeeded: boolean;
  eveningShare: number;
  sunCondition: string;
  objectType: string;
  mountPossible?: string;
}): SystemType {
  if (params.sunCondition === 'heavyShade' || params.mountPossible === 'no') return 'needs-inspection';
  if (params.goal === 'offgrid' || params.objectType === 'farm') return 'off-grid';
  if (params.wantsBackup || params.batteryNeeded || params.eveningShare > SYSTEM_RULES.eveningShareBatteryThreshold || params.goal === 'independence') return 'hybrid';
  return 'on-grid';
}

function confidenceLabel(score: number) {
  if (score >= SYSTEM_RULES.goodConfidenceThreshold) return 'добро' as const;
  if (score <= SYSTEM_RULES.lowConfidenceThreshold) return 'ниско' as const;
  return 'средно' as const;
}

function rangeLabel(value: number, minStep = 0.5) {
  const low = Math.max(minStep, Math.floor((value * 0.9) / minStep) * minStep);
  const high = Math.ceil((value * 1.15) / minStep) * minStep;
  return `${low % 1 === 0 ? low.toFixed(0) : low.toFixed(1)}-${high % 1 === 0 ? high.toFixed(0) : high.toFixed(1)}`;
}

function localizeField(text: string | { bg: string; en: string }, lang: 'bg' | 'en'): string {
  if (typeof text === 'string') return text;
  return text[lang] ?? '';
}

function topConsumers(appliances: Array<{ name: string | { bg: string; en: string }; label?: string | { bg: string; en: string }; daily: number }>, monthlyKwh: number) {
  return appliances
    .map((item) => {
      const monthly = item.daily * 30;
      const nameBg = localizeField(item.name, 'bg');
      const nameEn = localizeField(item.name, 'en');
      const labelBg = item.label ? localizeField(item.label, 'bg') : '';
      const labelEn = item.label ? localizeField(item.label, 'en') : '';
      return {
        name: {
          bg: labelBg ? `${nameBg} · ${labelBg}` : nameBg,
          en: labelEn ? `${nameEn} · ${labelEn}` : nameEn
        },
        monthlyKwh: Math.round(monthly),
        percent: Math.round((monthly / Math.max(monthlyKwh, 1)) * 100),
        advice: monthly > 120
          ? { bg: 'Голям консуматор. Проверете време на работа и ефективност.', en: 'High consumer. Check operating hours and efficiency.' }
          : { bg: 'Нормален принос към общото потребление.', en: 'Normal contribution to total consumption.' }
      };
    })
    .sort((a, b) => b.monthlyKwh - a.monthlyKwh)
    .slice(0, 5);
}

function confidencePenalty(appliances: ApplianceInput[]) {
  return appliances.reduce((sum, appliance) => {
    if (appliance.certainty === 'average' || appliance.usageTime === 'unknown' || appliance.seasonality === 'unknown') return sum + 3;
    if (appliance.certainty === 'approximate') return sum + 1;
    return sum;
  }, 0);
}

function applianceMeta(appliances: ApplianceInput[]) {
  return appliances.map((item) => ({ name: item.name as string | { bg: string; en: string }, label: item.label as string | { bg: string; en: string } | undefined, daily: calculateApplianceConsumption(item) }));
}

function highStartWarnings(appliances: ApplianceInput[], systemType: SystemType, wantsBackup: boolean) {
  if (!wantsBackup && systemType !== 'off-grid') return [];
  const risky = appliances.filter((item) => item.highStartLoad && item.isCritical);
  if (!risky.length) return [];
  return [{ bg: 'Някои критични уреди имат висок стартов ток. При backup/off-grid може да е нужен по-мощен инвертор.', en: 'Some critical appliances have a high startup current. For backup/off-grid a more powerful inverter may be needed.' }];
}

function finalize(params: {
  dailyKwh: number;
  monthlyKwh: number;
  dayKwh: number;
  eveningKwh: number;
  goal: string;
  wantsBackup: boolean;
  backupHours: number;
  sunCondition: string;
  objectType: string;
  sunHours: number;
  confidenceBase: number;
  criticalKwh?: number;
  mountPossible?: 'yes' | 'no' | 'unknown';
  appliances?: ApplianceInput[];
}): RecommendationResult {
  const eveningShare = params.eveningKwh / Math.max(params.dailyKwh, 1);
  const batteryNeeded = params.wantsBackup || eveningShare > SYSTEM_RULES.eveningShareBatteryThreshold || params.goal === 'independence' || params.goal === 'offgrid';
  const systemType = recommendSystemType({ ...params, batteryNeeded, eveningShare });
  const recommendedPowerKwp = recommendSystemSize(params.dailyKwh, params.sunHours, productionFactor(params.sunCondition));
  const backupKwh = Math.max(params.criticalKwh ?? 0, (params.dailyKwh / 24) * params.backupHours);
  const recommendedBatteryKwh = batteryNeeded ? recommendBatteryCapacity(params.eveningKwh, backupKwh, params.wantsBackup) : 0;
  const appliances = params.appliances ?? [];
  const confidenceScore = Math.round(Math.max(30, Math.min(92, params.confidenceBase - (params.sunCondition === 'unknown' ? 8 : 0) - (params.sunCondition === 'heavyShade' ? 22 : 0) - confidencePenalty(appliances))));
  const warnings = [
    ...generateWarnings({
      sunCondition: params.sunCondition as never,
      eveningShare,
      wantsBackup: params.wantsBackup,
      batteryNeeded,
      monthlyKwh: params.monthlyKwh,
      systemType,
      mountPossible: params.mountPossible
    }),
    ...highStartWarnings(appliances, systemType, params.wantsBackup)
  ];
  const partial = {
    recommendedPowerKwp,
    recommendedPowerRange: rangeLabel(recommendedPowerKwp),
    batteryNeeded,
    recommendedBatteryKwh,
    recommendedBatteryRange: recommendedBatteryKwh > 0 ? rangeLabel(recommendedBatteryKwh, 1) : '0',
    systemType,
    confidence: confidenceLabel(confidenceScore),
    confidenceScore,
    dailyConsumptionKwh: Math.round(params.dailyKwh * 10) / 10,
    monthlyConsumptionKwh: Math.round(params.monthlyKwh),
    dayConsumptionKwh: Math.round(params.dayKwh * 10) / 10,
    eveningConsumptionKwh: Math.round(params.eveningKwh * 10) / 10,
    topConsumers: topConsumers(applianceMeta(appliances), params.monthlyKwh),
    criticalLoadKwh: Math.round((params.criticalKwh ?? 0) * 10) / 10,
    warnings,
    chartData: [
      { name: 'Day', value: Math.round(params.dayKwh * 10) / 10 },
      { name: 'Evening', value: Math.round(params.eveningKwh * 10) / 10 }
    ]
  };
  const advice = generateSmartAdvice(partial);
  const result = { ...partial, advice, nextSteps: [] };
  return { ...result, nextSteps: nextStepsFor(result) };
}

export function analyzeQuick(input: QuickAssessmentInput): RecommendationResult {
  const billMonthlyKwh = estimateConsumptionFromBill(input.monthlyBillEur);
  const applianceTotal = input.appliances.length ? calculateTotalConsumption(input.appliances) : { daily: 0, monthly: 0 };
  const monthlyKwh = input.billKnown ? Math.max(billMonthlyKwh, applianceTotal.monthly * 0.85) : Math.max(billMonthlyKwh, applianceTotal.monthly);
  const dailyKwh = monthlyKwh / 30;
  const usageSplit = calculateDayNightSplitFromUsage(Math.max(dailyKwh - applianceTotal.daily, 0), input.usageTime);
  const applianceSplit = input.appliances.length ? calculateDayNightSplit(input.appliances) : { day: 0, evening: 0 };
  const split = { day: usageSplit.day + applianceSplit.day, evening: usageSplit.evening + applianceSplit.evening };
  return finalize({
    dailyKwh,
    monthlyKwh,
    dayKwh: split.day,
    eveningKwh: split.evening,
    goal: input.goal,
    wantsBackup: input.wantsBackup === 'yes',
    backupHours: input.wantsBackup === 'yes' ? 6 : 0,
    sunCondition: input.sunCondition,
    objectType: input.objectType,
    sunHours: REGION_SOLAR_DATA[input.region]?.sunHours ?? DEFAULT_ASSUMPTIONS.averageSunHours,
    confidenceBase: input.usageTime === 'unknown' || input.sunCondition === 'unknown' || !input.billKnown ? 60 : input.appliances.length ? 76 : 68,
    appliances: input.appliances
  });
}

export function analyzeDetailed(input: DetailedAssessmentInput): RecommendationResult {
  const total = input.appliances.length ? calculateTotalConsumption(input.appliances) : { daily: estimateConsumptionFromBill(input.monthlyBillEur, input.pricePerKwh) / 30, monthly: estimateConsumptionFromBill(input.monthlyBillEur, input.pricePerKwh) };
  const monthlyKwh = input.monthlyKwh && input.monthlyKwh > 0 ? input.monthlyKwh : total.monthly;
  const dailyKwh = monthlyKwh / 30;
  const split = input.appliances.length ? calculateDayNightSplit(input.appliances) : calculateDayNightSplitFromUsage(dailyKwh, 'unknown');
  const criticalKwh = input.appliances.filter((item) => item.isCritical).reduce((sum, item) => sum + calculateApplianceConsumption(item), 0);
  const region = REGION_SOLAR_DATA[input.region] ?? REGION_SOLAR_DATA.unknown;
  return finalize({
    dailyKwh,
    monthlyKwh,
    dayKwh: split.day,
    eveningKwh: split.evening,
    goal: input.goal,
    wantsBackup: input.backupScope !== 'unknown' && input.backupHours > 0,
    backupHours: input.backupHours,
    sunCondition: input.sunCondition,
    objectType: input.objectType,
    sunHours: region.sunHours,
    confidenceBase: input.appliances.length >= 4 ? 84 : 70,
    criticalKwh,
    mountPossible: input.mountPossible === 'probably' ? 'unknown' : input.mountPossible,
    appliances: input.appliances
  });
}
