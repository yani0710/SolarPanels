import type { ApplianceInput, RecommendationResult, SavedSystem, User } from '../types';

export interface LocalCustomAppliancePayload {
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
}

export interface LocalAssistantUsage {
  used: number;
  limit: number;
  remaining: number;
  dayKey: string;
  resets: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

interface LocalSession {
  token: string;
  userId: number;
}

interface StoredCustomAppliance {
  id: number;
  userId: number;
  name: string;
  category: string;
  count: number;
  wattage: number;
  hoursPerDay: number;
  daysPerMonth: number;
  usageTime: string;
  isCritical: boolean;
  seasonality: string;
  highStartLoad: boolean;
  certainty: string;
  workPattern: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface StoredSavedSystem extends SavedSystem {
  userId: number;
}

const STORAGE_KEYS = {
  users: 'solarwise_local_users',
  session: 'solarwise_local_session',
  guestId: 'solarwise_guest_id',
  assistantUsage: 'solarwise_local_assistant_usage',
  appliances: 'solarwise_local_appliances',
  systems: 'solarwise_local_systems',
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function randomToken() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((item) => item.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string) {
  const encoded = new TextEncoder().encode(password);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return toHex(digest);
  }
  return `plain:${password}`;
}

function getUsers() {
  return readJson<StoredUser[]>(STORAGE_KEYS.users, []);
}

function setUsers(users: StoredUser[]) {
  writeJson(STORAGE_KEYS.users, users);
}

function getSession() {
  return readJson<LocalSession | null>(STORAGE_KEYS.session, null);
}

function setSession(session: LocalSession | null) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.session);
    localStorage.removeItem('solarwise_token');
    return;
  }
  writeJson(STORAGE_KEYS.session, session);
  localStorage.setItem('solarwise_token', session.token);
}

function getCurrentUserRecord() {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((user) => user.id === session.userId) ?? null;
}

function publicUser(user: StoredUser): User {
  const { passwordHash, ...publicData } = user;
  return publicData;
}

function nextId<T extends { id: number }>(items: T[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function storageForUser<T>(rootKey: string, userId: number): T[] {
  return readJson<T[]>(`${rootKey}_${userId}`, []);
}

function writeStorageForUser<T>(rootKey: string, userId: number, items: T[]) {
  writeJson(`${rootKey}_${userId}`, items);
}

function ensureCurrentUserId() {
  const session = getSession();
  if (!session) {
    throw new Error('Моля, влезте в профила си.');
  }
  return session.userId;
}

function mapStoredAppliance(row: StoredCustomAppliance): ApplianceInput {
  return {
    id: `custom-db-${row.id}`,
    name: row.name,
    category: row.category as ApplianceInput['category'],
    label: 'Мой уред',
    wattage: row.wattage,
    hoursPerDay: row.hoursPerDay,
    daysPerMonth: row.daysPerMonth,
    usageTime: row.usageTime as ApplianceInput['usageTime'],
    confidence: 0.86,
    explanation: 'Запазен собствен уред.',
    count: row.count,
    seasonality: row.seasonality as ApplianceInput['seasonality'],
    note: row.note,
    isCustom: true,
    highStartLoad: row.highStartLoad,
    certainty: row.certainty as ApplianceInput['certainty'],
    workPattern: row.workPattern as ApplianceInput['workPattern'],
    isCritical: row.isCritical,
  };
}

function mapStoredApplianceForProfile(row: StoredCustomAppliance) {
  return {
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
  };
}

function mapSavedSystem(row: StoredSavedSystem): SavedSystem {
  const { userId, ...saved } = row;
  return saved;
}

export async function registerLocalUser(payload: { name: string; email: string; password: string }) {
  const email = payload.email.trim().toLowerCase();
  const users = getUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error('Вече има профил с този email.');
  }

  const user: StoredUser = {
    id: nextId(users),
    name: payload.name.trim(),
    email,
    passwordHash: await hashPassword(payload.password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  setUsers(users);
  setSession({ token: randomToken(), userId: user.id });

  return { user: publicUser(user), token: localStorage.getItem('solarwise_token') ?? '' };
}

export async function loginLocalUser(payload: { email: string; password: string }) {
  const email = payload.email.trim().toLowerCase();
  const user = getUsers().find((item) => item.email === email);
  if (!user) {
    throw new Error('Грешен email или парола.');
  }

  const passwordHash = await hashPassword(payload.password);
  if (passwordHash !== user.passwordHash) {
    throw new Error('Грешен email или парола.');
  }

  setSession({ token: randomToken(), userId: user.id });
  return { user: publicUser(user), token: localStorage.getItem('solarwise_token') ?? '' };
}

export async function getLocalUser() {
  const user = getCurrentUserRecord();
  if (!user) {
    throw new Error('Сесията е изтекла. Влезте отново.');
  }
  return { user: publicUser(user) };
}

export async function logoutLocalUser() {
  setSession(null);
  return { ok: true as const };
}

export function getCurrentUserId() {
  const session = getSession();
  return session?.userId ?? null;
}

export function readCustomAppliances() {
  const userId = getCurrentUserId();
  if (!userId) return [];
  return storageForUser<StoredCustomAppliance>(STORAGE_KEYS.appliances, userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listCustomApplianceInputs() {
  return readCustomAppliances().map(mapStoredAppliance);
}

export function createCustomApplianceRecord(payload: LocalCustomAppliancePayload) {
  const userId = ensureCurrentUserId();
  const items = storageForUser<StoredCustomAppliance>(STORAGE_KEYS.appliances, userId);
  const now = new Date().toISOString();
  const row: StoredCustomAppliance = {
    id: nextId(items),
    userId,
    name: payload.name,
    category: payload.category,
    count: payload.count,
    wattage: payload.wattage,
    hoursPerDay: payload.hoursPerDay,
    daysPerMonth: payload.daysPerMonth,
    usageTime: payload.usageTime,
    isCritical: Boolean(payload.isCritical),
    seasonality: payload.seasonality ?? 'year-round',
    highStartLoad: Boolean(payload.highStartLoad),
    certainty: payload.certainty ?? 'approximate',
    workPattern: payload.workPattern ?? 'daily',
    note: payload.note ?? '',
    createdAt: now,
    updatedAt: now,
  };

  items.unshift(row);
  writeStorageForUser(STORAGE_KEYS.appliances, userId, items);
  return { appliance: mapStoredAppliance(row) };
}

export function addCustomApplianceRecord(payload: LocalCustomAppliancePayload) {
  const userId = ensureCurrentUserId();
  const items = storageForUser<StoredCustomAppliance>(STORAGE_KEYS.appliances, userId);
  const now = new Date().toISOString();
  const row: StoredCustomAppliance = {
    id: nextId(items),
    userId,
    name: payload.name,
    category: payload.category,
    count: payload.count,
    wattage: payload.wattage,
    hoursPerDay: payload.hoursPerDay,
    daysPerMonth: payload.daysPerMonth,
    usageTime: payload.usageTime,
    isCritical: Boolean(payload.isCritical),
    seasonality: payload.seasonality ?? 'year-round',
    highStartLoad: Boolean(payload.highStartLoad),
    certainty: payload.certainty ?? 'approximate',
    workPattern: payload.workPattern ?? 'daily',
    note: payload.note ?? '',
    createdAt: now,
    updatedAt: now,
  };

  items.unshift(row);
  writeStorageForUser(STORAGE_KEYS.appliances, userId, items);
  return { appliance: mapStoredApplianceForProfile(row) };
}

export function deleteCustomApplianceRecord(id: number) {
  const userId = ensureCurrentUserId();
  const items = storageForUser<StoredCustomAppliance>(STORAGE_KEYS.appliances, userId).filter((item) => item.id !== id);
  writeStorageForUser(STORAGE_KEYS.appliances, userId, items);
  return { ok: true as const };
}

export function readSavedSystems() {
  const userId = getCurrentUserId();
  if (!userId) return [];
  return storageForUser<StoredSavedSystem>(STORAGE_KEYS.systems, userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listSavedSystemsForCurrentUser() {
  return readSavedSystems().map(mapSavedSystem);
}

export function createSavedSystemRecord(payload: { title: string; inputSnapshot: unknown; resultSnapshot: RecommendationResult }) {
  const userId = ensureCurrentUserId();
  const items = storageForUser<StoredSavedSystem>(STORAGE_KEYS.systems, userId);
  const now = new Date().toISOString();
  const result = payload.resultSnapshot;
  const row: StoredSavedSystem = {
    id: nextId(items),
    userId,
    title: payload.title,
    inputSnapshot: payload.inputSnapshot,
    resultSnapshot: result,
    recommendedPowerKwp: result.recommendedPowerKwp,
    recommendedBatteryKwh: result.recommendedBatteryKwh,
    systemType: result.systemType,
    advice: result.advice,
    createdAt: now,
    updatedAt: now,
  };

  items.unshift(row);
  writeStorageForUser(STORAGE_KEYS.systems, userId, items);
  return { system: mapSavedSystem(row) };
}

export function deleteSavedSystemRecord(id: number) {
  const userId = ensureCurrentUserId();
  const items = storageForUser<StoredSavedSystem>(STORAGE_KEYS.systems, userId).filter((item) => item.id !== id);
  writeStorageForUser(STORAGE_KEYS.systems, userId, items);
  return { ok: true as const };
}

function getGuestId() {
  const existing = localStorage.getItem(STORAGE_KEYS.guestId);
  if (existing) return existing;
  const next = `guest-${randomToken()}`;
  localStorage.setItem(STORAGE_KEYS.guestId, next);
  return next;
}

function localSolarAnswer(message: string, context: string, language: 'bg' | 'en' = 'bg') {
  const text = message.toLowerCase();
  const isBG = language === 'bg';
  const hasProfile = !context.startsWith('No saved user profile');
  const profileLine = hasProfile
    ? (isBG ? '\n\nAlso I reviewed your saved SolarWise profile data.' : '\n\nI also considered your saved SolarWise profile data.')
    : '';

  if (text.includes('site') || text.includes('сайта') || text.includes('какво мога') || text.includes('what can i')) {
    if (isBG) {
      return `На този сайт можеш да:\n1. Направиш бърза оценка\n2. Направиш детайлна оценка\n3. Запазиш сценарии и препоръки\n4. Добавиш собствени уреди\n5. Вижаш графики на потребление\n6. Получиш честен съвет\n7. Питаш мен като AI асистент`;
    }
    return `On this site you can:\n1. Do a quick assessment\n2. Do a detailed assessment\n3. Save scenarios and recommendations\n4. Add custom appliances\n5. View consumption charts\n6. Get honest advice\n7. Ask me as your AI assistant\n8. Choose Bulgarian or English`;
  }

  if (text.includes('battery') || text.includes('батер')) {
    return isBG
      ? `Батерията има смисъл когато използваш много електричество вечер, искаш резервна мощност при прекъсване, или искаш по-голяма независимост. Ако целта ти е само по-ниска сметка и използваш ток през деня, можеш да започнеш с система, свързана към мрежата, и да добавиш батерия по-късно.${profileLine}`
      : `A battery makes sense when you use a lot of electricity in the evening, want backup during outages, or want more independence. If your goal is only a lower bill and most usage is daytime, you can often start on-grid and add storage later.${profileLine}`;
  }

  if (text.includes('kwp') || text.includes('kwh') || text.includes('киловат')) {
    return isBG
      ? `kWp е пиковата мощност на соларния панел. kWh е енергия, която се потребява или съхранява. Добрата оценка започва от месечното потребление, после се коригира за региона, ориентацията на покрива и сянката.${profileLine}`
      : `kWp is the peak size of the solar array. kWh is energy consumed or stored. A good first estimate starts from monthly consumption, then adjusts for region, roof direction, and shading.${profileLine}`;
  }

  if (text.includes('shade') || text.includes('сян') || text.includes('засенч')) {
    return isBG
      ? `Сянката е един от най-големите рискове за соларите. Дори частична сянка от комин, дърво или съседна сграда може да намали производството. Провери оформлението на системата и помисли за оптимизатори само ако геометрията го оправдава.${profileLine}`
      : `Shading is one of the biggest solar risks. Even partial shade from chimneys, trees, or nearby buildings can reduce production. Check the string layout and consider optimizers only when the roof geometry justifies them.${profileLine}`;
  }

  if (text.includes('hybrid') || text.includes('хибрид') || text.includes('off-grid') || text.includes('on-grid')) {
    return isBG
      ? `On-grid е обикновено най-добро за намаляване на сметката с най-простата инсталация. Хибридът добавя батерия и резервна мощност. Off-grid е за места без надежден достъп до мрежа.${profileLine}`
      : `On-grid is usually best for lowering bills with the simplest setup. Hybrid adds a battery and backup options. Off-grid is for places without reliable grid access.${profileLine}`;
  }

  return isBG
    ? `За надежна соларна препоръка започни с месечното потребление, ориентацията на покрива, сянката и нуждата от резервна мощност.${profileLine}`
    : `For a reliable solar recommendation, start with monthly consumption, roof orientation, shading, and backup needs.${profileLine}`;
}

function usageKey(scope: string, dayKey: string) {
  return `${STORAGE_KEYS.assistantUsage}_${scope}_${dayKey}`;
}

function readAssistantUsage(scope: string, limit: number) {
  const dayKey = todayKey();
  const usage = readJson<LocalAssistantUsage | null>(usageKey(scope, dayKey), null) ?? { used: 0, limit, remaining: limit, dayKey, resets: 'daily' };
  return { ...usage, limit, remaining: Math.max(0, limit - usage.used) };
}

function writeAssistantUsage(scope: string, usage: LocalAssistantUsage) {
  writeJson(usageKey(scope, usage.dayKey), usage);
}

function profileContext(userId: number | null) {
  if (!userId) return 'No saved user profile. Treat this as a first solar consultation.';

  const systems = storageForUser<StoredSavedSystem>(STORAGE_KEYS.systems, userId).slice(0, 3);
  const appliances = storageForUser<StoredCustomAppliance>(STORAGE_KEYS.appliances, userId).slice(0, 8);

  const saved = systems.map((system) => `${system.title}: ${system.recommendedPowerKwp} kWp, ${system.recommendedBatteryKwh} kWh, ${system.systemType}`);
  const applianceSummary = appliances.map((item) => `${item.name} ${item.wattage}W ${item.hoursPerDay}h/day`).join('; ');

  return [
    saved.length ? `Saved systems: ${saved.join(' | ')}` : 'No saved systems yet.',
    applianceSummary ? `Custom appliances: ${applianceSummary}` : 'No custom appliances yet.',
  ].join('\n');
}

export async function getLocalAssistantUsage() {
  const userId = getCurrentUserId();
  const limit = userId ? 20 : 3;
  const scope = userId ? `user-${userId}` : `guest-${getGuestId()}`;
  const usage = readAssistantUsage(scope, limit);
  return {
    usage,
    authenticated: Boolean(userId),
  };
}

export async function askLocalAssistant(message: string, language: 'bg' | 'en' = 'bg') {
  const userId = getCurrentUserId();
  const limit = userId ? 20 : 3;
  const scope = userId ? `user-${userId}` : `guest-${getGuestId()}`;
  const current = readAssistantUsage(scope, limit);

  if (current.used >= limit) {
    throw new Error(language === 'bg' ? 'Дневният лимит за AI въпроси е изчерпан. Ще се обнови утре.' : 'Daily AI question limit reached. Resets tomorrow.');
  }

  const nextUsage: LocalAssistantUsage = {
    used: current.used + 1,
    limit,
    remaining: Math.max(0, limit - (current.used + 1)),
    dayKey: todayKey(),
    resets: 'daily',
  };
  writeAssistantUsage(scope, nextUsage);

  const answer = localSolarAnswer(message, profileContext(userId), language);
  return { answer, usage: nextUsage, solarOnly: true as const };
}
