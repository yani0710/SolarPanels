<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssistantMessage;
use App\Services\AssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssistantController extends Controller
{
    public function __construct(private readonly AssistantService $assistantService)
    {
    }

    public function usage(Request $request): JsonResponse
    {
        $current = $this->assistantService->currentUsage($request);

        return response()->json([
            'usage' => $this->assistantService->usagePayload($current['usage']->question_count, $current['limit'], $current['dayKey']),
            'authenticated' => (bool) $request->user(),
        ]);
    }

    public function ask(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'min:2', 'max:900'],
            'language' => ['sometimes', 'string', 'in:bg,en'],
        ]);

        $language = $data['language'] ?? 'bg';
        $current = $this->assistantService->currentUsage($request);

        if (!$this->assistantService->isSolarQuestion($data['message'])) {
            return response()->json([
                'answer' => 'I can answer only solar panel, battery, inverter, electricity usage, and PV system questions.',
                'usage' => $this->assistantService->usagePayload($current['usage']->question_count, $current['limit'], $current['dayKey']),
                'solarOnly' => true,
            ]);
        }

        if ($current['usage']->question_count >= $current['limit']) {
            $message = $language === 'bg'
                ? 'Дневният лимит за AI въпроси е изчерпан. Ще се обнови утре.'
                : ($request->user() ? 'Daily AI question limit reached. Resets tomorrow.' : 'Guest limit reached. Sign in for more questions.');

            return response()->json([
                'message' => $message,
                'usage' => $this->assistantService->usagePayload($current['usage']->question_count, $current['limit'], $current['dayKey']),
            ], 429);
        }

        $current['usage']->increment('question_count');
        $current['usage']->refresh();

        $context = $this->assistantService->profileContext($request->user()?->id);
        $answer = $this->assistantService->generateAssistantAnswer($data['message'], $context, $language);

        AssistantMessage::query()->create([
            'user_id' => $request->user()?->id,
            'guest_id' => $current['guestId'],
            'role' => 'user',
            'content' => $data['message'],
        ]);

        AssistantMessage::query()->create([
            'user_id' => $request->user()?->id,
            'guest_id' => $current['guestId'],
            'role' => 'assistant',
            'content' => $answer,
        ]);

        return response()->json([
            'answer' => $answer,
            'usage' => $this->assistantService->usagePayload($current['usage']->question_count, $current['limit'], $current['dayKey']),
            'solarOnly' => true,
        ]);
    }
}
