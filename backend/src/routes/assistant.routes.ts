import { Router } from 'express';
import type { Request } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { optionalAuth } from '../middleware/auth.js';

export const assistantRouter = Router();
assistantRouter.use(optionalAuth);

const askSchema = z.object({
  message: z.string().trim().min(2).max(900),
  language: z.string().default('bg').refine(val => ['bg', 'en'].includes(val))
});

const GUEST_LIMIT = Number(process.env.ASSISTANT_GUEST_DAILY_LIMIT ?? 3);
const USER_LIMIT = Number(process.env.ASSISTANT_USER_DAILY_LIMIT ?? 20);

const solarTerms = [
  'solar', 'panel', 'pv', 'photovoltaic', 'inverter', 'battery', 'kwp', 'kwh', 'watt', 'roof', 'shade',
  'shading', 'sun', 'grid', 'off-grid', 'ongrid', 'on-grid', 'hybrid', 'electricity', 'energy', 'tariff',
  'consumption', 'appliance', 'backup', 'mounting', 'солар', 'панел', 'фотоволта', 'инвертор', 'батерия',
  'киловат', 'покрив', 'сянка', 'засенч', 'слънце', 'ток', 'мрежа', 'хибрид', 'уред', 'сметка',
  'потребление', 'монтаж', 'ориентация', 'наклон', 'backup', 'резерв'
];

function dayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Sofia',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function getGuestId(req: Request) {
  const raw = String(req.headers['x-guest-id'] ?? '').trim();
  return raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'anonymous';
}

function isSolarQuestion(message: string) {
  const text = message.toLowerCase();
  return solarTerms.some((term) => text.includes(term));
}

function usagePayload(questionCount: number, limit: number, key = dayKey()) {
  return {
    used: questionCount,
    limit,
    remaining: Math.max(0, limit - questionCount),
    dayKey: key,
    resets: 'daily'
  };
}

async function currentUsage(req: Request) {
  const key = dayKey();
  const limit = req.user ? USER_LIMIT : GUEST_LIMIT;
  const guestId = req.user ? null : getGuestId(req);
  const usage = req.user
    ? await prisma.assistantUsage.upsert({
        where: { userId_dayKey: { userId: req.user.id, dayKey: key } },
        create: { userId: req.user.id, dayKey: key },
        update: {}
      })
    : await prisma.assistantUsage.upsert({
        where: { guestId_dayKey: { guestId: guestId!, dayKey: key } },
        create: { guestId, dayKey: key },
        update: {}
      });

  return { usage, limit, key, guestId };
}

async function profileContext(userId: number | undefined) {
  if (!userId) return 'No saved user profile. Treat this as a first solar consultation.';

  const [systems, appliances] = await Promise.all([
    prisma.savedSystem.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.customAppliance.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 8 })
  ]);

  const saved = systems.map((system) => {
    const result = JSON.parse(system.resultSnapshot) as { recommendedPowerRange?: string; recommendedBatteryRange?: string; systemType?: string; confidence?: string };
    return `${system.title}: ${result.recommendedPowerRange ?? system.recommendedPowerKwp} kWp, ${result.recommendedBatteryRange ?? system.recommendedBatteryKwh} kWh, ${result.systemType ?? system.systemType}, confidence ${result.confidence ?? 'unknown'}`;
  });
  const applianceSummary = appliances.map((item) => `${item.name} ${item.wattage}W ${item.hoursPerDay}h/day ${item.usageTime}`).join('; ');

  return [
    saved.length ? `Saved systems: ${saved.join(' | ')}` : 'No saved systems yet.',
    applianceSummary ? `Custom appliances: ${applianceSummary}` : 'No custom appliances yet.'
  ].join('\n');
}

function localSolarAnswer(message: string, context: string, language: string = 'bg') {
  const text = message.toLowerCase();
  const hasProfile = !context.startsWith('No saved user profile');
  
  const isBG = language === 'bg';
  const profileLine = hasProfile 
    ? (isBG ? '\n\nТакже съм разгледал твоите запазени данни от профила.' : '\n\nI also considered your saved SolarWise profile data.')
    : '';

  // Site features questions
  if (text.includes('site') || text.includes('сайта') || text.includes('какво мога') || text.includes('what can i')) {
    if (isBG) {
      return `На този сайт можеш да:
1. Направиш бърза оценка - отговори на няколко въпроса и получи препоръка за мощност, батерия и тип система
2. Направиш детайлна оценка - добави собствени уреди и получи по-точна препоръка
3. Запазиш сценарии и препоръки в профила си
4. Добавиш собствени уреди (фризер, печка, помпа и т.н.)
5. Вижаш графики на потребление и сценарии
6. Получиш честен съвет за твоята ситуация
7. Питаш мен като AI асистент`;
    } else {
      return `On this site you can:
1. Do a quick assessment - answer a few questions and get recommendations for power, battery, and system type
2. Do a detailed assessment - add your own appliances for more accurate recommendations
3. Save scenarios and recommendations in your profile
4. Add custom appliances (freezer, oven, pump, etc.)
5. View consumption charts and scenarios
6. Get honest advice for your situation
7. Ask me as your AI assistant
8. Choose your language (Bulgarian or English)`;
    }
  }

  if (text.includes('battery') || text.includes('батер')) {
    return isBG 
      ? `Батерията има смисъл когато използваш много електричество вечер, искаш резервна мощност при прекъсване, или искаш по-голяма независимост. Ако целта ти е само по-ниска сметка и използваш ток през деня, можеш да започнеш с система, свързана към мрежата, и да добавиш батерия по-късно.${profileLine}`
      : `A battery makes sense when you use a lot of electricity in the evening, want backup during outages, or want more independence. If your goal is only a lower bill and most usage is daytime, you can often start on-grid and add storage later.${profileLine}`;
  }

  if (text.includes('kwp') || text.includes('kwh') || text.includes('киловат')) {
    return isBG
      ? `kWp е пиковата мощност на соларния панел. kWh е енергия, която се потребява или съхранява. Добрата оценка започва от месечния ток, след което се коригира за региона, ориентация на покрива, сянка и колко ток използваш през деня спрямо вечер.${profileLine}`
      : `kWp is the peak size of the solar array. kWh is energy consumed or stored. A good first estimate starts from monthly kWh, then adjusts for region, roof direction, shading, and how much power you use during the day versus evening.${profileLine}`;
  }

  if (text.includes('shade') || text.includes('сян') || text.includes('засенч')) {
    return isBG
      ? `Сянката е един от най-големите рискове за соларите. Дори частична сянка от комин, дърво или съседна сграда може да намали производството. За осенчени покриви, поискай проверка на оформлението на системата и помисли за оптимизатори само ако геометрията на покрива го оправдава.${profileLine}`
      : `Shading is one of the biggest solar risks. Even partial shade from chimneys, trees, or nearby buildings can reduce production. For shaded roofs, ask for a string layout check and consider optimizers or microinverters only when the roof geometry justifies them.${profileLine}`;
  }

  if (text.includes('hybrid') || text.includes('хибрид') || text.includes('off-grid') || text.includes('on-grid')) {
    return isBG
      ? `На-мрежа е обикновено най-добро за намаляване на сметката с най-простата инсталация. Хибридът добавя батерия и опции за резервна мощност. Off-grid е за места без надежден достъп до мрежа, но изисква по-внимателен размер поради зимата и облачните периоди.${profileLine}`
      : `On-grid is usually best for lowering bills with the simplest setup. Hybrid adds a battery and backup options. Off-grid is for places without reliable grid access, but it needs more careful sizing because winter and cloudy periods matter a lot.${profileLine}`;
  }

  if (text.includes('price') || text.includes('cost') || text.includes('roi') || text.includes('цена') || text.includes('сметка')) {
    return isBG
      ? `За цена и възвращаемост, полезни входни данни са месечен ток, цена на тока, състояние на покрива, размер на системата и дали ти трябва батерия. Резервната батерия подобрява комфорта и независимостта, но обикновено удължава възвращаемостта в сравнение с проста система, свързана към мрежата.${profileLine}`
      : `For cost and payback, the useful inputs are monthly kWh, electricity price, roof conditions, system size, and whether you need a battery. Battery backup improves comfort and independence, but it usually lengthens payback compared with a simple on-grid system.${profileLine}`;
  }

  return isBG
    ? `За надежна соларна препоръка, започни с месечното потребление, ориентацията на покрива, сянката, дневното/вечерното използване, потребността от резервна мощност и бъдещите товари като електромобили или топлинни помпи. Мога да помогна да сравниш системи, размер на батерия, избор на инвертор и рискове на покрива.${profileLine}`
    : `For a reliable solar recommendation, start with monthly consumption, roof orientation, shading, daytime/evening usage, backup needs, and future loads like EVs or heat pumps. I can help compare on-grid, hybrid, battery size, inverter choice, and roof risks.${profileLine}`;
}

function extractResponseText(data: unknown) {
  const record = data as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  if (record.output_text) return record.output_text;
  return record.output?.flatMap((item) => item.content ?? []).map((item) => item.text).filter(Boolean).join('\n').trim();
}

async function generateAssistantAnswer(message: string, context: string, language: string = 'bg') {
  if (!process.env.OPENAI_API_KEY) return localSolarAnswer(message, context, language);

  const isBG = language === 'bg';
  const systemLang = isBG ? 'Bulgarian' : 'English';

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        max_output_tokens: 520,
        input: [
          {
            role: 'system',
            content: `You are SolarWise Assistant. Answer only questions about solar panels, PV systems, inverters, batteries, energy consumption, roof mounting, sizing, payback, backup power, and related electrical planning. Be practical, concise, and avoid pretending to be a licensed installer. If the user asks outside solar/energy topics, refuse briefly. Use the user's profile context when available. Respond in ${systemLang}.\n\n${context}`
          },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) return localSolarAnswer(message, context, language);
    const data = await response.json() as unknown;
    return extractResponseText(data) || localSolarAnswer(message, context, language);
  } catch {
    return localSolarAnswer(message, context, language);
  }
}

assistantRouter.get('/usage', async (req, res, next) => {
  try {
    const { usage, limit, key } = await currentUsage(req);
    res.json({ usage: usagePayload(usage.questionCount, limit, key), authenticated: Boolean(req.user) });
  } catch (err) {
    next(err);
  }
});

assistantRouter.post('/ask', async (req, res, next) => {
  try {
    const input = askSchema.parse(req.body);
    const { usage, limit, key, guestId } = await currentUsage(req);

    if (!isSolarQuestion(input.message)) {
      return res.json({
        answer: 'I can answer only solar panel, battery, inverter, electricity usage, and PV system questions.',
        usage: usagePayload(usage.questionCount, limit, key),
        solarOnly: true
      });
    }

    if (usage.questionCount >= limit) {
      const msg = input.language === 'bg'
        ? 'Дневният лимит за AI въпроси е изчерпан. Ще се обнови утре.'
        : req.user ? 'Daily AI question limit reached. Resets tomorrow.' : 'Guest limit reached. Sign in for more questions.';
      return res.status(429).json({
        message: msg,
        usage: usagePayload(usage.questionCount, limit, key)
      });
    }

    const nextUsage = await prisma.assistantUsage.update({
      where: { id: usage.id },
      data: { questionCount: { increment: 1 } }
    });
    const context = await profileContext(req.user?.id);
    const answer = await generateAssistantAnswer(input.message, context, input.language);

    await prisma.assistantMessage.createMany({
      data: [
        { userId: req.user?.id, guestId, role: 'user', content: input.message },
        { userId: req.user?.id, guestId, role: 'assistant', content: answer }
      ]
    });

    res.json({ answer, usage: usagePayload(nextUsage.questionCount, limit, key), solarOnly: true });
  } catch (err) {
    next(err);
  }
});
