import { apiRequest } from './client';
import type { User } from '../types';

export async function register(payload: { name: string; email: string; password: string }) {
  return apiRequest<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export async function login(payload: { email: string; password: string }) {
  return apiRequest<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export async function me() {
  return apiRequest<{ user: User }>('/auth/me');
}

export async function logout() {
  return apiRequest<{ ok: true }>('/auth/logout', { method: 'POST' });
}
