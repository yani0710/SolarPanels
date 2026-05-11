import { askLocalAssistant, getLocalAssistantUsage } from '../lib/browserStore';

export interface AssistantUsage {
  used: number;
  limit: number;
  remaining: number;
  dayKey: string;
  resets: string;
}

export interface AssistantAskResponse {
  answer: string;
  usage: AssistantUsage;
  solarOnly: boolean;
}

export interface AssistantUsageResponse {
  usage: AssistantUsage;
  authenticated: boolean;
}

function guestId() {
  const key = 'solarwise_guest_id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const next = `guest-${crypto.randomUUID()}`;
  localStorage.setItem(key, next);
  return next;
}

const guestHeaders = () => ({ 'X-Guest-Id': guestId() });

export function getAssistantUsage() {
  void guestHeaders;
  return getLocalAssistantUsage() as Promise<AssistantUsageResponse>;
}

export function askAssistant(message: string, language: string = 'bg') {
  void guestHeaders;
  return askLocalAssistant(message, language as 'bg' | 'en') as Promise<AssistantAskResponse>;
}
