import { DEFAULT_ASSUMPTIONS } from '../data/defaultAssumptions';
import type { ApplianceInput, UsageTime } from '../types';

export function estimateConsumptionFromBill(monthlyBillEur: number, pricePerKwh = DEFAULT_ASSUMPTIONS.pricePerKwhEur) {
  return Math.max(0, monthlyBillEur / pricePerKwh);
}

export function calculateApplianceConsumption(appliance: ApplianceInput) {
  const count = appliance.count ?? 1;
  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 1;
  if (appliance.estimatedKwhPerDay !== undefined) return Math.max(0, appliance.estimatedKwhPerDay * safeCount);
  const wattage = Number.isFinite(appliance.wattage) && appliance.wattage > 0 ? appliance.wattage : 120;
  const hours = Number.isFinite(appliance.hoursPerDay) && appliance.hoursPerDay > 0 ? appliance.hoursPerDay : 2;
  const days = Number.isFinite(appliance.daysPerMonth) && appliance.daysPerMonth > 0 ? appliance.daysPerMonth : 22;
  return Math.max(0, (wattage * safeCount * hours * days) / 1000 / 30);
}

export function calculateTotalConsumption(appliances: ApplianceInput[]) {
  const daily = appliances.reduce((sum, appliance) => sum + calculateApplianceConsumption(appliance), 0);
  return { daily, monthly: daily * 30 };
}

function usageSplit(usageTime: UsageTime) {
  switch (usageTime) {
    case 'day':
    case 'morning':
      return { day: 0.72, evening: 0.28 };
    case 'evening':
    case 'night':
      return { day: 0.24, evening: 0.76 };
    case 'constant':
      return { day: 0.5, evening: 0.5 };
    case 'balanced':
      return { day: 0.5, evening: 0.5 };
    case 'seasonal':
      return { day: 0.45, evening: 0.55 };
    case 'varies':
      return { day: 0.5, evening: 0.5 };
    default:
      return { day: 0.48, evening: 0.52 };
  }
}

export function calculateDayNightSplitFromUsage(dailyKwh: number, usageTime: UsageTime) {
  const split = usageSplit(usageTime);
  return { day: dailyKwh * split.day, evening: dailyKwh * split.evening };
}

export function calculateDayNightSplit(appliances: ApplianceInput[]) {
  return appliances.reduce(
    (acc, appliance) => {
      const daily = calculateApplianceConsumption(appliance);
      const split = usageSplit(appliance.usageTime);
      acc.day += daily * split.day;
      acc.evening += daily * split.evening;
      return acc;
    },
    { day: 0, evening: 0 }
  );
}

export function recommendSystemSize(dailyKwh: number, sunHours = DEFAULT_ASSUMPTIONS.averageSunHours, productionFactor = 1) {
  const size = (dailyKwh / Math.max(sunHours * productionFactor, 1.5)) * DEFAULT_ASSUMPTIONS.systemSafetyFactor;
  return Math.round(Math.max(1.2, size) * 10) / 10;
}

export function recommendBatteryCapacity(eveningKwh: number, backupKwh: number, wantsBackup: boolean) {
  const base = Math.max(wantsBackup ? backupKwh : 0, eveningKwh * 0.78);
  if (base < 2.2 && !wantsBackup) return 0;
  return Math.round(base * DEFAULT_ASSUMPTIONS.batterySafetyFactor * 10) / 10;
}