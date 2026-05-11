<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedSystem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedSystemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = SavedSystem::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['systems' => $rows->map(fn (SavedSystem $row) => $this->mapSystem($row))->values()]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $row = SavedSystem::query()
            ->where('id', (int) $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$row) {
            return response()->json(['message' => 'Сценарият не е намерен.'], 404);
        }

        return response()->json(['system' => $this->mapSystem($row)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'min:1'],
            'inputSnapshot' => ['required'],
            'resultSnapshot' => ['required', 'array'],
            'resultSnapshot.recommendedPowerKwp' => ['required', 'numeric'],
            'resultSnapshot.recommendedBatteryKwh' => ['required', 'numeric'],
            'resultSnapshot.systemType' => ['required', 'string'],
            'resultSnapshot.advice' => ['required', 'string'],
        ]);

        $row = SavedSystem::query()->create([
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'input_snapshot' => json_encode($data['inputSnapshot'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'result_snapshot' => json_encode($data['resultSnapshot'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'recommended_power_kwp' => $data['resultSnapshot']['recommendedPowerKwp'],
            'recommended_battery_kwh' => $data['resultSnapshot']['recommendedBatteryKwh'],
            'system_type' => $data['resultSnapshot']['systemType'],
            'advice' => $data['resultSnapshot']['advice'],
        ]);

        return response()->json(['system' => $this->mapSystem($row)], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'min:1'],
            'inputSnapshot' => ['required'],
            'resultSnapshot' => ['required', 'array'],
            'resultSnapshot.recommendedPowerKwp' => ['required', 'numeric'],
            'resultSnapshot.recommendedBatteryKwh' => ['required', 'numeric'],
            'resultSnapshot.systemType' => ['required', 'string'],
            'resultSnapshot.advice' => ['required', 'string'],
        ]);

        $row = SavedSystem::query()
            ->where('id', (int) $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$row) {
            return response()->json(['message' => 'Сценарият не е намерен.'], 404);
        }

        $row->update([
            'title' => $data['title'],
            'input_snapshot' => json_encode($data['inputSnapshot'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'result_snapshot' => json_encode($data['resultSnapshot'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'recommended_power_kwp' => $data['resultSnapshot']['recommendedPowerKwp'],
            'recommended_battery_kwh' => $data['resultSnapshot']['recommendedBatteryKwh'],
            'system_type' => $data['resultSnapshot']['systemType'],
            'advice' => $data['resultSnapshot']['advice'],
        ]);

        return response()->json(['system' => $this->mapSystem($row->fresh())]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        SavedSystem::query()
            ->where('id', (int) $id)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['ok' => true]);
    }

    private function mapSystem(SavedSystem $row): array
    {
        return [
            'id' => $row->id,
            'title' => $row->title,
            'inputSnapshot' => json_decode((string) $row->input_snapshot, true),
            'resultSnapshot' => json_decode((string) $row->result_snapshot, true),
            'recommendedPowerKwp' => $row->recommended_power_kwp,
            'recommendedBatteryKwh' => $row->recommended_battery_kwh,
            'systemType' => $row->system_type,
            'advice' => $row->advice,
            'createdAt' => $row->created_at?->toIso8601String(),
            'updatedAt' => $row->updated_at?->toIso8601String(),
        ];
    }
}
