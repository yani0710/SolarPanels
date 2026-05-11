<?php

namespace App\Http\Middleware;

use App\Services\TokenService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiAuth
{
    public function handle(Request $request, Closure $next)
    {
        $user = TokenService::userFromRequest($request);

        if (!$user) {
            return response()->json(['message' => 'Моля, влезте в профила си.'], 401);
        }

        Auth::shouldUse('web');
        Auth::setUser($user);
        $request->setUserResolver(fn () => $user);
        $request->attributes->set('apiUser', $user);

        return $next($request);
    }
}
