<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomAppliance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplianceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = CustomAppliance::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['appliances' => $rows->map(fn (CustomAppliance $row) => $this->mapPreset($row))->values()]);
    }

    public function saved(Request $request): JsonResponse
    {
        $rows = CustomAppliance::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get([
                'id',
                'name',
                'category',
                'wattage',
                'hours_per_day',
                'days_per_month',
                'count',
                'created_at',
            ]);

        return response()->json([
            'appliances' => $rows->map(fn (CustomAppliance $row) => [
                'id' => $row->id,
                'name' => $row->name,
                'category' => $row->category,
                'wattage' => $row->wattage,
                'hoursPerDay' => $row->hours_per_day,
                'daysPerMonth' => $row->days_per_month,
                'count' => $row->count,
                'createdAt' => $row->created_at?->toIso8601String(),
            ])->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:100'],
            'category' => ['required', 'string', 'min:1', 'max:50'],
            'count' => ['sometimes', 'numeric', 'gt:0'],
            'wattage' => ['required', 'numeric', 'gt:0', 'max:50000'],
            'hoursPerDay' => ['required', 'numeric', 'min:0', 'max:24'],
            'daysPerMonth' => ['required', 'numeric', 'min:1', 'max:31'],
            'usageTime' => ['required', 'string'],
            'isCritical' => ['sometimes', 'boolean'],
            'seasonality' => ['sometimes', 'string'],
            'highStartLoad' => ['sometimes', 'boolean'],
            'certainty' => ['sometimes', 'string'],
            'workPattern' => ['sometimes', 'string'],
            'note' => ['sometimes', 'string', 'max:500'],
        ]);

        $row = CustomAppliance::query()->create([
            'user_id' => $request->user()->id,
            'name' => $data['name'],
            'category' => $data['category'],
            'count' => $data['count'] ?? 1,
            'wattage' => $data['wattage'],
            'hours_per_day' => $data['hoursPerDay'],
            'days_per_month' => $data['daysPerMonth'],
            'usage_time' => $data['usageTime'],
            'is_critical' => (bool) ($data['isCritical'] ?? false),
            'seasonality' => $data['seasonality'] ?? 'year-round',
            'high_start_load' => (bool) ($data['highStartLoad'] ?? false),
            'certainty' => $data['certainty'] ?? 'approximate',
            'work_pattern' => $data['workPattern'] ?? 'daily',
            'note' => $data['note'] ?? '',
        ]);

        return response()->json(['appliance' => $this->mapPreset($row)], 201);
    }

    public function add(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:100'],
            'category' => ['required', 'string', 'min:1', 'max:50'],
            'wattage' => ['required', 'numeric', 'gt:0', 'max:50000'],
            'hoursPerDay' => ['required', 'numeric', 'min:0', 'max:24'],
            'daysPerMonth' => ['required', 'numeric', 'min:1', 'max:31'],
            'count' => ['sometimes', 'numeric', 'gt:0'],
        ]);

        $row = CustomAppliance::query()->create([
            'user_id' => $request->user()->id,
            'name' => $data['name'],
            'category' => $data['category'],
            'wattage' => $data['wattage'],
            'hours_per_day' => $data['hoursPerDay'],
            'days_per_month' => $data['daysPerMonth'],
            'count' => $data['count'] ?? 1,
            'usage_time' => 'flexible',
            'certainty' => 'approximate',
            'is_critical' => false,
            'seasonality' => 'year-round',
            'high_start_load' => false,
            'work_pattern' => 'daily',
            'note' => '',
        ]);

        return response()->json([
            'appliance' => [
                'id' => $row->id,
                'name' => $row->name,
                'category' => $row->category,
                'wattage' => $row->wattage,
                'hoursPerDay' => $row->hours_per_day,
                'daysPerMonth' => $row->days_per_month,
                'count' => $row->count,
                'createdAt' => $row->created_at?->toIso8601String(),
            ],
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:100'],
            'category' => ['required', 'string', 'min:1', 'max:50'],
            'count' => ['sometimes', 'numeric', 'gt:0'],
            'wattage' => ['required', 'numeric', 'gt:0', 'max:50000'],
            'hoursPerDay' => ['required', 'numeric', 'min:0', 'max:24'],
            'daysPerMonth' => ['required', 'numeric', 'min:1', 'max:31'],
            'usageTime' => ['required', 'string'],
            'isCritical' => ['sometimes', 'boolean'],
            'seasonality' => ['sometimes', 'string'],
            'highStartLoad' => ['sometimes', 'boolean'],
            'certainty' => ['sometimes', 'string'],
            'workPattern' => ['sometimes', 'string'],
            'note' => ['sometimes', 'string', 'max:500'],
        ]);

        $resolvedId = (int) str_replace('custom-db-', '', $id);
        $existing = CustomAppliance::query()
            ->where('id', $resolvedId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$existing) {
            return response()->json(['message' => 'Уредът не е намерен.'], 404);
        }

        $existing->update([
            'name' => $data['name'],
            'category' => $data['category'],
            'count' => $data['count'] ?? 1,
            'wattage' => $data['wattage'],
            'hours_per_day' => $data['hoursPerDay'],
            'days_per_month' => $data['daysPerMonth'],
            'usage_time' => $data['usageTime'],
            'is_critical' => (bool) ($data['isCritical'] ?? false),
            'seasonality' => $data['seasonality'] ?? 'year-round',
            'high_start_load' => (bool) ($data['highStartLoad'] ?? false),
            'certainty' => $data['certainty'] ?? 'approximate',
            'work_pattern' => $data['workPattern'] ?? 'daily',
            'note' => $data['note'] ?? '',
        ]);

        return response()->json(['appliance' => $this->mapPreset($existing->fresh())]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $resolvedId = (int) str_replace('custom-db-', '', $id);

        CustomAppliance::query()
            ->where('id', $resolvedId)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['ok' => true]);
    }

    private function mapPreset(CustomAppliance $row): array
    {
        return [
            'id' => 'custom-db-' . $row->id,
            'name' => $row->name,
            'category' => $row->category,
            'count' => $row->count,
            'wattage' => $row->wattage,
            'hoursPerDay' => $row->hours_per_day,
            'daysPerMonth' => $row->days_per_month,
            'usageTime' => $row->usage_time,
            'isCritical' => (bool) $row->is_critical,
            'seasonality' => $row->seasonality,
            'highStartLoad' => (bool) $row->high_start_load,
            'certainty' => $row->certainty,
            'workPattern' => $row->work_pattern,
            'note' => $row->note,
            'label' => 'Мой уред',
            'confidence' => 0.86,
            'explanation' => 'Запазен собствен уред.',
            'isCustom' => true,
        ];
    }
}
