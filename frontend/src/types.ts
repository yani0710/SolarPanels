export type ObjectType = 'apartment' | 'house' | 'villa' | 'business' | 'farm';
export type UsageTime = 'morning' | 'day' | 'evening' | 'night' | 'balanced' | 'constant' | 'seasonal' | 'varies' | 'unknown';
export type Goal = 'save' | 'backup' | 'independence' | 'check' | 'offgrid';
export type SunCondition = 'open' | 'urban' | 'partialShade' | 'heavyShade' | 'unknown';
export type SystemType = 'on-grid' | 'hybrid' | 'off-grid' | 'needs-inspection';
export type Confidence = 'ниско' | 'средно' | 'добро';
export type ApplianceSeasonality = 'year-round' | 'summer' | 'winter' | 'weekends' | 'unknown';
export type ApplianceCategory =
  | 'kitchen'
  | 'laundry'
  | 'heatingCooling'
  | 'hotWater'
  | 'electronics'
  | 'lighting'
  | 'outdoor'
  | 'transport'
  | 'business'
  | 'custom';

export interface AppliancePreset {
  id: string;
  name: string;
  category: ApplianceCategory;
  label: string;
  estimatedKwhPerDay?: number;
  wattage?: number;
  hoursPerDay?: number;
  daysPerMonth?: number;
  usageTime: UsageTime;
  confidence: number;
  explanation: string;
  count?: number;
  seasonality?: ApplianceSeasonality;
  note?: string;
  isCustom?: boolean;
  highStartLoad?: boolean;
  certainty?: 'average' | 'approximate' | 'accurate' | 'spec';
  workPattern?: 'daily' | 'weekdays' | 'weekends' | 'seasonal' | 'varies' | 'unknown';
}

export interface ApplianceInput extends AppliancePreset {
  isCritical?: boolean;
}

export interface QuickAssessmentInput {
  mode: 'quick';
  objectType: ObjectType;
  region: string;
  monthlyBillEur: number;
  billKnown: boolean;
  appliances: ApplianceInput[];
  usageTime: UsageTime;
  wantsBackup: 'yes' | 'no' | 'unknown';
  sunCondition: SunCondition;
  goal: Goal;
}

export interface DetailedAssessmentInput {
  mode: 'detailed';
  objectType: ObjectType;
  region: string;
  cityOrArea?: string;
  monthlyBillEur: number;
  monthlyKwh?: number;
  pricePerKwh?: number;
  dayNightTariff?: 'yes' | 'no' | 'unknown';
  gridPhase?: 'single' | 'three' | 'unknown';
  goal: Goal;
  profileId: string;
  appliances: ApplianceInput[];
  backupHours: number;
  backupScope: 'critical' | 'whole' | 'unknown';
  sunCondition: SunCondition;
  obstacles?: string[];
  mountPossible: 'yes' | 'probably' | 'unknown' | 'no';
  budget?: number;
  priority?: 'lowest-price' | 'balance' | 'independence' | 'backup' | 'future-ready' | 'unknown';
  batteryPreference?: 'now' | 'later' | 'no' | 'unknown';
  futurePlans?: string[];
}

export interface RecommendationResult {
  recommendedPowerKwp: number;
  recommendedPowerRange: string;
  batteryNeeded: boolean;
  recommendedBatteryKwh: number;
  recommendedBatteryRange: string;
  systemType: SystemType;
  confidence: Confidence;
  confidenceScore: number;
  dailyConsumptionKwh: number;
  monthlyConsumptionKwh: number;
  dayConsumptionKwh: number;
  eveningConsumptionKwh: number;
  topConsumers: Array<{ name: string; monthlyKwh: number; percent: number; advice: string }>;
  criticalLoadKwh: number;
  warnings: string[];
  advice: string;
  nextSteps: string[];
  chartData: Array<{ name: string; value: number }>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface SavedSystem {
  id: number;
  title: string;
  inputSnapshot: unknown;
  resultSnapshot: RecommendationResult;
  recommendedPowerKwp: number;
  recommendedBatteryKwh: number;
  systemType: SystemType;
  advice: string;
  createdAt: string;
  updatedAt: string;
}
