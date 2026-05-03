import { apiRequest } from './client';
import type { RecommendationResult, SavedSystem } from '../types';

export async function listSystems() {
  return apiRequest<{ systems: SavedSystem[] }>('/systems');
}

export async function getSavedSystems() {
  const response = await apiRequest<{ systems: SavedSystem[] }>('/systems');
  return response.systems;
}

export async function saveSystem(payload: { title: string; inputSnapshot: unknown; resultSnapshot: RecommendationResult }) {
  return apiRequest<{ system: SavedSystem }>('/systems', { method: 'POST', body: JSON.stringify(payload) });
}

export async function deleteSystem(id: number) {
  return apiRequest<{ ok: true }>(`/systems/${id}`, { method: 'DELETE' });
}
