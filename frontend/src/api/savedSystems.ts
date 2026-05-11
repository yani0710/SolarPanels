import { createSavedSystemRecord, deleteSavedSystemRecord, listSavedSystemsForCurrentUser } from '../lib/browserStore';
import type { RecommendationResult, SavedSystem } from '../types';

export async function listSystems() {
  return { systems: listSavedSystemsForCurrentUser() };
}

export async function getSavedSystems() {
  return listSavedSystemsForCurrentUser();
}

export async function saveSystem(payload: { title: string; inputSnapshot: unknown; resultSnapshot: RecommendationResult }) {
  return Promise.resolve(createSavedSystemRecord(payload));
}

export async function deleteSystem(id: number) {
  return deleteSavedSystemRecord(id);
}
