import type { RecommendationResult, SunCondition, SystemType } from '../types';

type Bilingual = { bg: string; en: string };

export function generateWarnings(params: {
  sunCondition: SunCondition;
  eveningShare: number;
  wantsBackup: boolean;
  batteryNeeded: boolean;
  monthlyKwh: number;
  systemType: SystemType;
  mountPossible?: 'yes' | 'no' | 'unknown';
}): Bilingual[] {
  const warnings: Bilingual[] = [];
  if (params.sunCondition === 'heavyShade') warnings.push({ bg: 'Силното засенчване може да направи системата икономически неефективна без професионален оглед.', en: 'Heavy shading can make the system economically inefficient without a professional site survey.' });
  if (params.sunCondition === 'partialShade') warnings.push({ bg: 'Частичното засенчване намалява производството. Добре е да се провери реалната осветеност.', en: 'Partial shading reduces production. It is worth checking actual sun exposure on site.' });
  if (params.eveningShare > 0.55 && !params.batteryNeeded) warnings.push({ bg: 'При вечерно потребление ползата от on-grid система може да е по-ниска без батерия.', en: 'With high evening consumption the benefit of an on-grid system may be lower without a battery.' });
  if (params.wantsBackup && !params.batteryNeeded) warnings.push({ bg: 'Резервно захранване без батерия не е реалистично при стандартна соларна система.', en: 'Backup power without a battery is not realistic with a standard solar system.' });
  if (params.systemType === 'off-grid' && params.monthlyKwh > 650) warnings.push({ bg: 'Off-grid система при високо потребление става значително по-скъпа и изисква внимателно оразмеряване.', en: 'An off-grid system with high consumption becomes significantly more expensive and requires careful sizing.' });
  if (params.mountPossible === 'no') warnings.push({ bg: 'Ако няма реална възможност за монтаж, първата стъпка е технически оглед, не оферта.', en: 'If there is no realistic mounting option, the first step is a technical site survey, not a quote.' });
  return warnings;
}

export function generateSmartAdvice(result: Omit<RecommendationResult, 'advice' | 'nextSteps'>): Bilingual {
  if (result.systemType === 'needs-inspection') {
    return {
      bg: 'При тези условия соларна система може да няма добър икономически смисъл без оглед. Първо проверете засенчването, реалната осветеност и възможността за монтаж.',
      en: 'Under these conditions a solar system may not make good economic sense without a site survey. First check shading, actual sun exposure, and mounting feasibility.'
    };
  }
  if (result.batteryNeeded && result.systemType === 'hybrid') {
    return {
      bg: 'При вашия профил батерията има смисъл, особено за вечерно потребление или backup. Може да започнете с hybrid-ready конфигурация и да добавите батерия поетапно.',
      en: 'For your profile a battery makes sense, especially for evening consumption or backup. You can start with a hybrid-ready configuration and add the battery in stages.'
    };
  }
  if (result.systemType === 'on-grid') {
    return {
      bg: 'On-grid система изглежда разумен първи избор: по-ниска сложност, добра ефективност през деня и фокус върху намаляване на сметката.',
      en: 'An on-grid system looks like a sensible first choice: lower complexity, good daytime efficiency, and a focus on reducing the bill.'
    };
  }
  if (result.systemType === 'off-grid') {
    return {
      bg: 'Търсите повече автономност. Това е възможно, но изисква по-внимателно планиране на батерията, резервните уреди и сезонните разлики.',
      en: 'You are seeking more autonomy. This is achievable but requires more careful planning of battery sizing, backup appliances, and seasonal variations.'
    };
  }
  return {
    bg: 'Оценката е ориентировъчна, но достатъчно добра за първи разговор с монтажник или за сравнение на сценарии.',
    en: 'The estimate is indicative but good enough for an initial conversation with an installer or for comparing scenarios.'
  };
}

export function nextStepsFor(result: RecommendationResult): Bilingual[] {
  if (result.systemType === 'needs-inspection') return [
    { bg: 'Проверете засенчването в различни часове', en: 'Check shading at different times of day' },
    { bg: 'Поискайте оглед преди оферта', en: 'Request a site survey before a quote' },
    { bg: 'Направете детайлна оценка с повече данни', en: 'Run a detailed assessment with more data' }
  ];
  return [
    { bg: 'Сравнете бърза и детайлна оценка', en: 'Compare quick and detailed assessment' },
    { bg: 'Запазете сценария в профил', en: 'Save the scenario to your profile' },
    { bg: 'Проверете реална възможност за монтаж', en: 'Check realistic mounting feasibility' }
  ];
}
