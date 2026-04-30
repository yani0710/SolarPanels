import { apiRequest } from './client';
import type { ApplianceInput } from '../types';

export type CustomAppliancePayload = {
  name: string;
  category: string;
  count: number;
  wattage: number;
  hoursPerDay: number;
  daysPerMonth: number;
  usageTime: string;
  isCritical?: boolean;
  seasonality?: string;
  highStartLoad?: boolean;
  certainty?: string;
  workPattern?: string;
  note?: string;
};

export async function listCustomAppliances() {
  return apiRequest<{ appliances: ApplianceInput[] }>('/appliances');
}

export async function createCustomAppliance(payload: CustomAppliancePayload) {
  return apiRequest<{ appliance: ApplianceInput }>('/appliances', { method: 'POST', body: JSON.stringify(payload) });
}
