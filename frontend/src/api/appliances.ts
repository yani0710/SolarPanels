import { addCustomApplianceRecord, createCustomApplianceRecord, deleteCustomApplianceRecord, listCustomApplianceInputs, readCustomAppliances } from '../lib/browserStore';
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
  return { appliances: listCustomApplianceInputs() };
}

export async function getSavedAppliances() {
  return readCustomAppliances().map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    wattage: row.wattage,
    hoursPerDay: row.hoursPerDay,
    daysPerMonth: row.daysPerMonth,
    count: row.count,
    usageTime: row.usageTime,
    isCritical: row.isCritical,
    certainty: row.certainty,
    createdAt: row.createdAt,
    seasonality: row.seasonality,
    highStartLoad: row.highStartLoad,
    workPattern: row.workPattern,
    note: row.note,
  })) as CustomAppliance[];
}

export async function createCustomAppliance(payload: CustomAppliancePayload) {
  return Promise.resolve(createCustomApplianceRecord(payload));
}

export async function addCustomAppliance(payload: CustomAppliancePayload) {
  return Promise.resolve(addCustomApplianceRecord(payload).appliance as CustomAppliance);
}
