import type { RecommendationResult, SunCondition, SystemType } from '../types';

export function generateWarnings(params: {
  sunCondition: SunCondition;
  eveningShare: number;
  wantsBackup: boolean;
  batteryNeeded: boolean;
  monthlyKwh: number;
  systemType: SystemType;
  mountPossible?: 'yes' | 'no' | 'unknown';
}) {
  const warnings: string[] = [];
  if (params.sunCondition === 'heavyShade') warnings.push('Силното засенчване може да направи системата икономически неефективна без професионален оглед.');
  if (params.sunCondition === 'partialShade') warnings.push('Частичното засенчване намалява производството. Добре е да се провери реалната осветеност.');
  if (params.eveningShare > 0.55 && !params.batteryNeeded) warnings.push('При вечерно потребление ползата от on-grid система може да е по-ниска без батерия.');
  if (params.wantsBackup && !params.batteryNeeded) warnings.push('Резервно захранване без батерия не е реалистично при стандартна соларна система.');
  if (params.systemType === 'off-grid' && params.monthlyKwh > 650) warnings.push('Off-grid система при високо потребление става значително по-скъпа и изисква внимателно оразмеряване.');
  if (params.mountPossible === 'no') warnings.push('Ако няма реална възможност за монтаж, първата стъпка е технически оглед, не оферта.');
  return warnings;
}

export function generateSmartAdvice(result: Omit<RecommendationResult, 'advice' | 'nextSteps'>) {
  if (result.systemType === 'needs-inspection') {
    return 'При тези условия соларна система може да няма добър икономически смисъл без оглед. Първо проверете засенчването, реалната осветеност и възможността за монтаж.';
  }
  if (result.batteryNeeded && result.systemType === 'hybrid') {
    return 'При вашия профил батерията има смисъл, особено за вечерно потребление или backup. Може да започнете с hybrid-ready конфигурация и да добавите батерия поетапно.';
  }
  if (result.systemType === 'on-grid') {
    return 'On-grid система изглежда разумен първи избор: по-ниска сложност, добра ефективност през деня и фокус върху намаляване на сметката.';
  }
  if (result.systemType === 'off-grid') {
    return 'Търсите повече автономност. Това е възможно, но изисква по-внимателно планиране на батерията, резервните уреди и сезонните разлики.';
  }
  return 'Оценката е ориентировъчна, но достатъчно добра за първи разговор с монтажник или за сравнение на сценарии.';
}

export function nextStepsFor(result: RecommendationResult) {
  if (result.systemType === 'needs-inspection') return ['Проверете засенчването в различни часове', 'Поискайте оглед преди оферта', 'Направете детайлна оценка с повече данни'];
  return ['Сравнете бърза и детайлна оценка', 'Запазете сценария в профил', 'Проверете реална възможност за монтаж'];
}
