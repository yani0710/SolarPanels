import { getLocalUser, loginLocalUser, logoutLocalUser, registerLocalUser } from '../lib/browserStore';
import type { User } from '../types';

export async function register(payload: { name: string; email: string; password: string }) {
  return registerLocalUser(payload) as Promise<{ user: User; token: string }>;
}

export async function login(payload: { email: string; password: string }) {
  return loginLocalUser(payload) as Promise<{ user: User; token: string }>;
}

export async function me() {
  return getLocalUser();
}

export async function logout() {
  return logoutLocalUser();
}
