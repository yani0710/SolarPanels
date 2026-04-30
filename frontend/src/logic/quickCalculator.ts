import type { ApplianceInput } from '../types';
import { calculateTotalConsumption } from './calculations';

export function calculateQuickApplianceImpact(appliances: ApplianceInput[]) {
  return calculateTotalConsumption(appliances);
}
