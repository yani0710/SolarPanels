<?php

use App\Http\Controllers\Api\ApplianceController;
use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SavedSystemController;
use App\Http\Middleware\ApiAuth;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['ok' => true, 'name' => 'SolarWise BG API']));

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/me', [AuthController::class, 'me'])->middleware(ApiAuth::class);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware(ApiAuth::class);

Route::middleware(ApiAuth::class)->group(function (): void {
    Route::get('/appliances', [ApplianceController::class, 'index']);
    Route::get('/appliances/saved', [ApplianceController::class, 'saved']);
    Route::post('/appliances', [ApplianceController::class, 'store']);
    Route::post('/appliances/add', [ApplianceController::class, 'add']);
    Route::put('/appliances/{id}', [ApplianceController::class, 'update']);
    Route::delete('/appliances/{id}', [ApplianceController::class, 'destroy']);

    Route::get('/systems', [SavedSystemController::class, 'index']);
    Route::get('/systems/{id}', [SavedSystemController::class, 'show']);
    Route::post('/systems', [SavedSystemController::class, 'store']);
    Route::put('/systems/{id}', [SavedSystemController::class, 'update']);
    Route::delete('/systems/{id}', [SavedSystemController::class, 'destroy']);
});

Route::get('/assistant/usage', [AssistantController::class, 'usage']);
Route::post('/assistant/ask', [AssistantController::class, 'ask']);
