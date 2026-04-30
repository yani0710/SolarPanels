import type { ApplianceInput } from '../types';
import { calculateApplianceConsumption, calculateDayNightSplit, calculateTotalConsumption } from './calculations';

export function calculateDetailedApplianceConsumption(appliance: ApplianceInput) {
  return calculateApplianceConsumption(appliance);
}

export { calculateDayNightSplit, calculateTotalConsumption };
