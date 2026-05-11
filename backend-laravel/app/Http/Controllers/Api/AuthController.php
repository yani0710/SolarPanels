<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $email = mb_strtolower(trim($data['email']));

        if (User::query()->where('email', $email)->exists()) {
            return response()->json(['message' => 'Вече има профил с този email.'], 409);
        }

        $user = User::query()->create([
            'name' => trim($data['name']),
            'email' => $email,
            'password_hash' => Hash::make($data['password'], ['rounds' => 12]),
        ]);

        return response()->json([
            'user' => $this->publicUser($user),
            'token' => TokenService::sign($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:1'],
        ]);

        $email = mb_strtolower(trim($data['email']));
        $user = User::query()->where('email', $email)->first();

        if (!$user || !Hash::check($data['password'], (string) $user->password_hash)) {
            return response()->json(['message' => 'Грешен email или парола.'], 401);
        }

        return response()->json([
            'user' => $this->publicUser($user),
            'token' => TokenService::sign($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->publicUser($request->user())]);
    }

    public function logout(): JsonResponse
    {
        return response()->json(['ok' => true]);
    }

    private function publicUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'createdAt' => $user->created_at?->toIso8601String(),
        ];
    }
}
