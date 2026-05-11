<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;

class TokenService
{
    public static function sign(User $user): string
    {
        $payload = [
            'sub' => $user->id,
            'exp' => now()->addDays(7)->timestamp,
        ];

        $encodedPayload = self::base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        $signature = hash_hmac('sha256', $encodedPayload, (string) env('JWT_SECRET', 'dev-secret'), true);

        return $encodedPayload . '.' . self::base64UrlEncode($signature);
    }

    public static function verify(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 2) {
            return null;
        }

        [$encodedPayload, $encodedSignature] = $parts;
        $expectedSignature = self::base64UrlEncode(hash_hmac('sha256', $encodedPayload, (string) env('JWT_SECRET', 'dev-secret'), true));

        if (!hash_equals($expectedSignature, $encodedSignature)) {
            return null;
        }

        $payloadJson = self::base64UrlDecode($encodedPayload);
        $payload = json_decode($payloadJson, true);

        if (!is_array($payload) || !isset($payload['sub'])) {
            return null;
        }

        if (isset($payload['exp']) && is_numeric($payload['exp']) && (int) $payload['exp'] < time()) {
            return null;
        }

        return ['sub' => (int) $payload['sub']];
    }

    public static function userFromRequest(Request $request): ?User
    {
        $token = (string) $request->bearerToken();

        if ($token === '') {
            return null;
        }

        $payload = self::verify($token);

        if (!$payload) {
            return null;
        }

        return User::query()->find($payload['sub']);
    }

    private static function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $value): string
    {
        $padding = strlen($value) % 4;

        if ($padding > 0) {
            $value .= str_repeat('=', 4 - $padding);
        }

        return base64_decode(strtr($value, '-_', '+/')) ?: '';
    }
}
