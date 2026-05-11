<?php

namespace App\Services;

use App\Models\AssistantUsage;
use App\Models\CustomAppliance;
use App\Models\SavedSystem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AssistantService
{
    private array $solarTerms = [
        'solar', 'panel', 'pv', 'photovoltaic', 'inverter', 'battery', 'kwp', 'kwh', 'watt', 'roof', 'shade',
        'shading', 'sun', 'grid', 'off-grid', 'ongrid', 'on-grid', 'hybrid', 'electricity', 'energy', 'tariff',
        'consumption', 'appliance', 'backup', 'mounting', 'солар', 'панел', 'фотоволта', 'инвертор', 'батерия',
        'киловат', 'покрив', 'сянка', 'засенч', 'слънце', 'ток', 'мрежа', 'хибрид', 'уред', 'сметка',
        'потребление', 'монтаж', 'ориентация', 'наклон', 'backup', 'резерв',
    ];

    public function dayKey(): string
    {
        return now('Europe/Sofia')->format('Y-m-d');
    }

    public function guestId(Request $request): string
    {
        $raw = trim((string) $request->header('X-Guest-Id', ''));
        $clean = preg_replace('/[^a-zA-Z0-9_-]/', '', $raw) ?? '';

        return substr($clean, 0, 80) ?: 'anonymous';
    }

    public function isSolarQuestion(string $message): bool
    {
        $text = mb_strtolower($message);

        foreach ($this->solarTerms as $term) {
            if (str_contains($text, $term)) {
                return true;
            }
        }

        return false;
    }

    public function usagePayload(int $questionCount, int $limit, ?string $dayKey = null): array
    {
        $resolvedDayKey = $dayKey ?? $this->dayKey();

        return [
            'used' => $questionCount,
            'limit' => $limit,
            'remaining' => max(0, $limit - $questionCount),
            'dayKey' => $resolvedDayKey,
            'resets' => 'daily',
        ];
    }

    public function currentUsage(Request $request): array
    {
        $dayKey = $this->dayKey();
        $limit = $request->user() ? (int) env('ASSISTANT_USER_DAILY_LIMIT', 20) : (int) env('ASSISTANT_GUEST_DAILY_LIMIT', 3);
        $user = $request->user();
        $guestId = $user ? null : $this->guestId($request);

        $usage = AssistantUsage::query()->firstOrCreate(
            $user
                ? ['user_id' => $user->id, 'day_key' => $dayKey]
                : ['guest_id' => $guestId, 'day_key' => $dayKey],
            ['question_count' => 0]
        );

        return [
            'usage' => $usage,
            'limit' => $limit,
            'dayKey' => $dayKey,
            'guestId' => $guestId,
        ];
    }

    public function profileContext(?int $userId): string
    {
        if (!$userId) {
            return 'No saved user profile. Treat this as a first solar consultation.';
        }

        $systems = SavedSystem::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get();

        $appliances = CustomAppliance::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->limit(8)
            ->get();

        $saved = $systems->map(function (SavedSystem $system): string {
            $result = json_decode((string) $system->result_snapshot, true) ?: [];
            $recommendedPowerRange = $result['recommendedPowerRange'] ?? $system->recommended_power_kwp;
            $recommendedBatteryRange = $result['recommendedBatteryRange'] ?? $system->recommended_battery_kwh;
            $systemType = $result['systemType'] ?? $system->system_type;
            $confidence = $result['confidence'] ?? 'unknown';

            return sprintf('%s: %s kWp, %s kWh, %s, confidence %s', $system->title, $recommendedPowerRange, $recommendedBatteryRange, $systemType, $confidence);
        })->all();

        $applianceSummary = $appliances->map(function (CustomAppliance $item): string {
            return sprintf('%s %sW %sh/day %s', $item->name, $item->wattage, $item->hours_per_day, $item->usage_time);
        })->implode('; ');

        return implode("\n", [
            $saved ? 'Saved systems: ' . implode(' | ', $saved) : 'No saved systems yet.',
            $applianceSummary ? 'Custom appliances: ' . $applianceSummary : 'No custom appliances yet.',
        ]);
    }

    public function localSolarAnswer(string $message, string $context, string $language = 'bg'): string
    {
        $text = mb_strtolower($message);
        $hasProfile = !str_starts_with($context, 'No saved user profile');
        $isBG = $language === 'bg';
        $profileLine = $hasProfile
            ? ($isBG ? "\n\nAlso I reviewed your saved SolarWise profile data." : "\n\nI also considered your saved SolarWise profile data.")
            : '';

        if (str_contains($text, 'site') || str_contains($text, 'сайта') || str_contains($text, 'какво мога') || str_contains($text, 'what can i')) {
            if ($isBG) {
                return implode("\n", [
                    'На този сайт можеш да:',
                    '1. Направиш бърза оценка - отговори на няколко въпроса и получи препоръка за мощност, батерия и тип система',
                    '2. Направиш детайлна оценка - добави собствени уреди и получи по-точна препоръка',
                    '3. Запазиш сценарии и препоръки в профила си',
                    '4. Добавиш собствени уреди (фризер, печка, помпа и т.н.)',
                    '5. Вижаш графики на потребление и сценарии',
                    '6. Получиш честен съвет за твоята ситуация',
                    '7. Питаш мен като AI асистент',
                ]);
            }

            return implode("\n", [
                'On this site you can:',
                '1. Do a quick assessment - answer a few questions and get recommendations for power, battery, and system type',
                '2. Do a detailed assessment - add your own appliances for more accurate recommendations',
                '3. Save scenarios and recommendations in your profile',
                '4. Add custom appliances (freezer, oven, pump, etc.)',
                '5. View consumption charts and scenarios',
                '6. Get honest advice for your situation',
                '7. Ask me as your AI assistant',
                '8. Choose your language (Bulgarian or English)',
            ]);
        }

        if (str_contains($text, 'battery') || str_contains($text, 'батер')) {
            return $isBG
                ? 'Батерията има смисъл когато използваш много електричество вечер, искаш резервна мощност при прекъсване, или искаш по-голяма независимост. Ако целта ти е само по-ниска сметка и използваш ток през деня, можеш да започнеш с система, свързана към мрежата, и да добавиш батерия по-късно.' . $profileLine
                : 'A battery makes sense when you use a lot of electricity in the evening, want backup during outages, or want more independence. If your goal is only a lower bill and most usage is daytime, you can often start on-grid and add storage later.' . $profileLine;
        }

        if (str_contains($text, 'kwp') || str_contains($text, 'kwh') || str_contains($text, 'киловат')) {
            return $isBG
                ? 'kWp е пиковата мощност на соларния панел. kWh е енергия, която се потребява или съхранява. Добрата оценка започва от месечния ток, след което се коригира за региона, ориентация на покрива, сянка и колко ток използваш през деня спрямо вечер.' . $profileLine
                : 'kWp is the peak size of the solar array. kWh is energy consumed or stored. A good first estimate starts from monthly kWh, then adjusts for region, roof direction, shading, and how much power you use during the day versus evening.' . $profileLine;
        }

        if (str_contains($text, 'shade') || str_contains($text, 'сян') || str_contains($text, 'засенч')) {
            return $isBG
                ? 'Сянката е един от най-големите рискове за соларите. Дори частична сянка от комин, дърво или съседна сграда може да намали производството. За осенчени покриви, поискай проверка на оформлението на системата и помисли за оптимизатори само ако геометрията на покрива го оправдава.' . $profileLine
                : 'Shading is one of the biggest solar risks. Even partial shade from chimneys, trees, or nearby buildings can reduce production. For shaded roofs, ask for a string layout check and consider optimizers or microinverters only when the roof geometry justifies them.' . $profileLine;
        }

        if (str_contains($text, 'hybrid') || str_contains($text, 'хибрид') || str_contains($text, 'off-grid') || str_contains($text, 'on-grid')) {
            return $isBG
                ? 'На-мрежа е обикновено най-добро за намаляване на сметката с най-простата инсталация. Хибридът добавя батерия и опции за резервна мощност. Off-grid е за места без надежден достъп до мрежа, но изисква по-внимателен размер поради зимата и облачните периоди.' . $profileLine
                : 'On-grid is usually best for lowering bills with the simplest setup. Hybrid adds a battery and backup options. Off-grid is for places without reliable grid access, but it needs more careful sizing because winter and cloudy periods matter a lot.' . $profileLine;
        }

        if (str_contains($text, 'price') || str_contains($text, 'cost') || str_contains($text, 'roi') || str_contains($text, 'цена') || str_contains($text, 'сметка')) {
            return $isBG
                ? 'За цена и възвращаемост, полезни входни данни са месечен ток, цена на тока, състояние на покрива, размер на системата и дали ти трябва батерия. Резервната батерия подобрява комфорта и независимостта, но обикновено удължава възвращаемостта в сравнение с проста система, свързана към мрежата.' . $profileLine
                : 'For cost and payback, the useful inputs are monthly kWh, electricity price, roof conditions, system size, and whether you need a battery. Battery backup improves comfort and independence, but it usually lengthens payback compared with a simple on-grid system.' . $profileLine;
        }

        return $isBG
            ? 'За надежна соларна препоръка, започни с месечното потребление, ориентацията на покрива, сянката, дневното/вечерното използване, потребността от резервна мощност и бъдещите товари като електромобили или топлинни помпи. Мога да помогна да сравниш системи, размер на батерия, избор на инвертор и рискове на покрива.' . $profileLine
            : 'For a reliable solar recommendation, start with monthly consumption, roof orientation, shading, daytime/evening usage, backup needs, and future loads like EVs or heat pumps. I can help compare on-grid, hybrid, battery size, inverter choice, and roof risks.' . $profileLine;
    }

    public function generateAssistantAnswer(string $message, string $context, string $language = 'bg'): string
    {
        if (!env('OPENAI_API_KEY')) {
            return $this->localSolarAnswer($message, $context, $language);
        }

        $isBG = $language === 'bg';
        $systemLang = $isBG ? 'Bulgarian' : 'English';

        try {
            $response = Http::withToken((string) env('OPENAI_API_KEY'))
                ->acceptJson()
                ->asJson()
                ->post('https://api.openai.com/v1/responses', [
                    'model' => (string) env('OPENAI_MODEL', 'gpt-4o-mini'),
                    'max_output_tokens' => 520,
                    'input' => [
                        [
                            'role' => 'system',
                            'content' => "You are SolarWise Assistant. Answer only questions about solar panels, PV systems, inverters, batteries, energy consumption, roof mounting, sizing, payback, backup power, and related electrical planning. Be practical, concise, and avoid pretending to be a licensed installer. If the user asks outside solar/energy topics, refuse briefly. Use the user's profile context when available. Respond in {$systemLang}.\n\n{$context}",
                        ],
                        [
                            'role' => 'user',
                            'content' => $message,
                        ],
                    ],
                ]);

            if (!$response->successful()) {
                return $this->localSolarAnswer($message, $context, $language);
            }

            $data = $response->json();
            $text = $this->extractResponseText($data);

            return $text !== '' ? $text : $this->localSolarAnswer($message, $context, $language);
        } catch (\Throwable) {
            return $this->localSolarAnswer($message, $context, $language);
        }
    }

    private function extractResponseText(mixed $data): string
    {
        if (is_array($data)) {
            if (!empty($data['output_text']) && is_string($data['output_text'])) {
                return trim($data['output_text']);
            }

            $chunks = [];

            foreach ($data['output'] ?? [] as $item) {
                foreach ($item['content'] ?? [] as $content) {
                    if (!empty($content['text']) && is_string($content['text'])) {
                        $chunks[] = $content['text'];
                    }
                }
            }

            return trim(implode("\n", $chunks));
        }

        return '';
    }
}
