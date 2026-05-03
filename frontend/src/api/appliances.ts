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

export interface CustomAppliance {
  id: number;
  name: string;
  category: string;
  wattage: number;
  hoursPerDay: number;
  daysPerMonth: number;
  count: number;
  usageTime: string;
  isCritical: boolean;
  certainty: string;
  createdAt: string;
}

export async function listCustomAppliances() {
  return apiRequest<{ appliances: ApplianceInput[] }>('/appliances');
}

export async function getSavedAppliances() {
  const response = await apiRequest<{ appliances: CustomAppliance[] }>('/appliances/saved');
  return response.appliances;
}

export async function createCustomAppliance(payload: CustomAppliancePayload) {
  return apiRequest<{ appliance: ApplianceInput }>('/appliances', { method: 'POST', body: JSON.stringify(payload) });
}

export async function addCustomAppliance(payload: CustomAppliancePayload) {
  const response = await apiRequest<{ appliance: CustomAppliance }>('/appliances/add', { method: 'POST', body: JSON.stringify(payload) });
  return response.appliance;
}
